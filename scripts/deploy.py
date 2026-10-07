#!/usr/bin/env python3
"""
Deploy the website folder to Cloudflare.

Usage (from the MiguelAdanWebsite folder):
    python3 scripts/deploy.py                 # build both pages from src/ and translations/, check, publish
    python3 scripts/deploy.py --check         # build and check only, publish nothing
    python3 scripts/deploy.py --project NAME  # use a different Cloudflare project name
    python3 scripts/deploy.py --workers       # the site lives in a Worker instead of Pages
    python3 scripts/deploy.py --mads-ref v1.2 # use a MADS tag, branch or commit instead of the latest
    python3 scripts/deploy.py --keep-mads     # don't download MADS, use the copy already in website/assets

Before building, it downloads the latest MA Design System (MADS) stylesheet from
https://github.com/MAAdan/MADS (css/mads.css) into website/assets/mads.css, so the
site always goes out with the current design system. Don't edit that copy: change
MADS on GitHub instead and deploy again.

It uses Wrangler, Cloudflare's official command-line tool, through `npx`, so the
only requirement is Node.js (https://nodejs.org, or `brew install node`).

Sign-in: the first time, Wrangler opens your browser to log in to Cloudflare and
remembers it afterwards. If you would rather use an API token (for example on a
machine without a browser), set these before running the script:
    export CLOUDFLARE_API_TOKEN=...   # token with "Cloudflare Pages: Edit"
    export CLOUDFLARE_ACCOUNT_ID=...  # shown in the Cloudflare dashboard sidebar
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

PROJECT_NAME = "miguel-adan"          # the Cloudflare Pages project name
SITE_URL = "https://miguel-adan.com"
SCRIPTS_DIR = Path(__file__).resolve().parent       # this folder (scripts/)
SITE_DIR = SCRIPTS_DIR.parent / "website"           # MiguelAdanWebsite/website
WRANGLER = ["npx", "--yes", "wrangler@4"]
WORKERD_MISSING = "is needed by workerd"            # Wrangler's error when its copy lacks the part built for this computer

MADS_REPO = "MAAdan/MADS"                            # the design system's GitHub repository
MADS_FILES = {"css/mads.css": "assets/mads.css"}     # file in MADS → where it goes in website/
MADS_RAW = "https://raw.githubusercontent.com/{repo}/{ref}/{path}"
MADS_API = "https://api.github.com/repos/{repo}/commits/{ref}"


def say(msg, kind="info"):
    marks = {"info": "•", "ok": "✓", "warn": "!", "err": "✗"}
    print(f"{marks[kind]} {msg}", flush=True)


def fail(msg):
    say(msg, "err")
    sys.exit(1)


def download(url, accept=None):
    """Fetch a URL and return its bytes. Falls back to curl, which uses the system's
    certificates, for Python installs on macOS that can't verify HTTPS by themselves."""
    headers = {"User-Agent": "miguel-adan-deploy"}
    if accept:
        headers["Accept"] = accept
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=20) as r:
            return r.read()
    except (urllib.error.URLError, OSError) as e:
        if shutil.which("curl") is None:
            raise
        cmd = ["curl", "-fsSL", "--max-time", "20"] + sum((["-H", f"{k}: {v}"] for k, v in headers.items()), []) + [url]
        out = subprocess.run(cmd, capture_output=True)
        if out.returncode != 0:
            raise OSError(out.stderr.decode(errors="replace").strip() or str(e))
        return out.stdout


def update_mads(ref):
    """Copy the design system from GitHub into website/assets, pinned to one commit."""
    # Find the exact commit, so every file comes from the same version and the copy says which one it is.
    try:
        sha = json.loads(download(MADS_API.format(repo=MADS_REPO, ref=ref)))["sha"]
    except Exception:
        sha = None  # GitHub's API can be rate limited; the files themselves are still reachable
    version = sha or ref
    for src, dest in MADS_FILES.items():
        url = MADS_RAW.format(repo=MADS_REPO, ref=version, path=src)
        try:
            text = download(url).decode("utf-8")
        except Exception as e:
            fail(f"Couldn't download MADS from {url}\n  ({e})\n"
                 "  Check your internet connection and that the repository and file still exist.\n"
                 "  To publish with the copy already in website/assets, run again with --keep-mads.")
        if "--mads-" not in text:
            fail(f"The file downloaded from {url} doesn't look like the MADS stylesheet. Nothing was changed.")
        stamp = (f"/* MADS {src} from https://github.com/{MADS_REPO}"
                 f" at {sha[:7] if sha else ref}. Downloaded by scripts/deploy.py: don't edit, change MADS instead. */\n")
        target = SITE_DIR / dest
        old = target.read_text(encoding="utf-8") if target.is_file() else None
        new = stamp + text
        # ignore the stamp line when deciding whether the design system itself changed
        same = old is not None and old.split("\n", 1)[-1] == text
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(new, encoding="utf-8")
        where = f"{MADS_REPO}@{sha[:7]}" if sha else f"{MADS_REPO} ({ref})"
        say(f"MADS {src} is up to date ({where})." if same else f"MADS {src} updated from {where}.", "ok")


def build_pages():
    """Generate the English and Spanish pages from src/index.html and the translation files."""
    sys.path.insert(0, str(SCRIPTS_DIR))
    try:
        import build
    except ImportError:
        fail("build.py is missing from the scripts folder.")
    build.build()  # stops with a clear message if any text is missing in either language


def check_site():
    """Make sure every file the pages use is there, and point out files they don't use."""
    pages = [SITE_DIR / "index.html", SITE_DIR / "es" / "index.html"]
    for page in pages:
        if not page.is_file():
            fail(f"Can't find {page}. Is the website folder next to the scripts folder?")

    used, missing = set(), []
    for page in pages:
        html = page.read_text(encoding="utf-8")
        refs = [(ref, page.parent / ref) for ref in
                re.findall(r'(?<![/\w.])((?:\.\./)?assets/[^"\')\s?#]+)', html)]
        # full web addresses on the site itself, such as the link-preview images
        refs += [(ref, SITE_DIR / path) for ref, path in
                 re.findall(r'(https?://(?:www\.)?miguel-adan\.com/(assets/[^"\')\s?#]+))', html)]
        for ref, target in refs:
            target = target.resolve()
            rel = str(target.relative_to(SITE_DIR.resolve())).replace(os.sep, "/") if SITE_DIR.resolve() in target.parents else ref
            used.add(rel)
            if not target.is_file():
                missing.append(f"{page.relative_to(SITE_DIR)}: {ref}")
    if missing:
        fail("The pages refer to files that are missing:\n    " + "\n    ".join(sorted(set(missing))))

    present = {str(p.relative_to(SITE_DIR)).replace(os.sep, "/")
               for p in (SITE_DIR / "assets").rglob("*")
               if p.is_file() and p.name not in (".DS_Store", "Thumbs.db")}
    unused = sorted(present - used)
    if unused:
        say("These files aren't used by the pages and will be uploaded anyway:\n    "
            + "\n    ".join(unused), "warn")

    ignored = {".DS_Store", "Thumbs.db"}
    files = [p for p in SITE_DIR.rglob("*") if p.is_file() and p.name not in ignored]
    size = sum(p.stat().st_size for p in files) / 1_000_000
    say(f"Site checked: English and Spanish pages, {len(files)} files, {size:.1f} MB, nothing missing.", "ok")


def wrangler(args, env, capture=False):
    return subprocess.run(WRANGLER + args, env=env, text=True,
                          capture_output=capture, cwd=SITE_DIR.parent)


def ensure_node():
    if shutil.which("npx") is None:
        fail("Node.js isn't installed, and the deploy needs it.\n"
             "  Install it from https://nodejs.org (or run: brew install node), then try again.")


def node_arch():
    """The platform and processor type the installed Node.js was built for, e.g. ('darwin', 'arm64')."""
    out = subprocess.run(["node", "-p", "process.platform + ' ' + process.arch"], capture_output=True, text=True)
    parts = out.stdout.split()
    return (parts[0], parts[1]) if out.returncode == 0 and len(parts) == 2 else (sys.platform, "?")


def check_node_arch():
    """On an Apple Silicon Mac, point out an Intel build of Node.js (it runs through Rosetta and confuses Wrangler)."""
    if sys.platform != "darwin":
        return
    apple_silicon = subprocess.run(["sysctl", "-n", "hw.optional.arm64"], capture_output=True, text=True).stdout.strip() == "1"
    if apple_silicon and node_arch()[1] == "x64":
        say(f"Node.js on this Mac is the Intel (x64) build ({shutil.which('node')}), running through Rosetta.\n"
            "  It works, but the Apple Silicon build is faster and avoids mix-ups. To switch, install the macOS\n"
            "  installer for Apple Silicon (arm64) from https://nodejs.org, or Homebrew's Node in /opt/homebrew.", "warn")


WORKERD_PACKAGES = {  # (platform, processor) of Node.js → workerd's package with the program built for it
    ("darwin", "x64"): "darwin-64", ("darwin", "arm64"): "darwin-arm64",
    ("linux", "x64"): "linux-64", ("linux", "arm64"): "linux-arm64", ("win32", "x64"): "windows-64",
}


def npx_folders():
    """npx's downloaded copies of Wrangler (each in its own folder of npm's cache)."""
    cache = subprocess.run(["npm", "config", "get", "cache"], capture_output=True, text=True).stdout.strip()
    npx_dir = Path(cache or Path.home() / ".npm") / "_npx"
    return [f for f in npx_dir.glob("*") if (f / "node_modules" / "wrangler").exists() or (f / "node_modules" / "workerd").exists()]


def clear_wrangler_download():
    """Delete npx's downloaded copies of Wrangler so the next run fetches a fresh one. Only the cache is touched."""
    for folder in npx_folders():
        shutil.rmtree(folder, ignore_errors=True)


def install_workerd_directly(env):
    """npm treats workerd's program as optional, so when it can't save or unpack it, it drops it without a word.
    Clean npm's download cache, then install the program as a normal package so npm either succeeds or says why."""
    say("Cleaning npm's download cache (npm cache clean --force). It only holds downloads; they come back as needed.")
    subprocess.run(["npm", "cache", "clean", "--force"], env=env)
    target = WORKERD_PACKAGES.get(node_arch())
    for folder in npx_folders():
        meta = folder / "node_modules" / "workerd" / "package.json"
        if not (target and meta.is_file()):
            continue
        version = json.loads(meta.read_text(encoding="utf-8"))["version"]
        package = f"@cloudflare/workerd-{target}@{version}"
        say(f"Installing {package} into npx's copy of Wrangler…")
        subprocess.run(["npm", "install", "--no-save", "--no-package-lock", "--no-audit", "--no-fund",
                        "--prefix", str(folder), package], env=env)


def ensure_wrangler(env):
    """Make sure Wrangler starts. If its downloaded copy is missing the program built for this computer
    (workerd): first download Wrangler again; if that isn't enough, clean npm's cache and install the
    program directly, which also makes npm show the real error if it still fails."""
    for attempt in (1, 2, 3):
        result = wrangler(["--version"], env, capture=True)
        output = result.stdout + result.stderr
        if result.returncode == 0 and WORKERD_MISSING not in output:
            say("Wrangler is ready.", "ok")
            return
        if WORKERD_MISSING not in output:
            break
        if attempt == 1:
            say("Wrangler's downloaded copy is missing the program built for this computer (workerd).\n"
                "  Clearing npx's copy of Wrangler and downloading it again…", "warn")
            clear_wrangler_download()
        elif attempt == 2:
            say("npm downloaded Wrangler again but still dropped workerd's program. Repairing…", "warn")
            install_workerd_directly(env)
    platform, arch = node_arch()
    detail = output.strip().splitlines()[-12:]
    fail("Wrangler, Cloudflare's tool, couldn't start:\n    " + "\n    ".join(detail) + "\n"
         f"  Node.js here is built for {platform}-{arch}. If npm printed an error just above\n"
         "  (for example EACCES or EINTEGRITY), that is the real cause. Things to try:\n"
         "  - EACCES: npm's cache has files owned by another user. Run: sudo chown -R $(whoami) ~/.npm\n"
         "  - EINTEGRITY or a stopped download: security software or a network filter is changing large\n"
         "    downloads. Try from another network, or allow registry.npmjs.org in that software.\n"
         "  - Reinstall Node.js from https://nodejs.org (on an Apple Silicon Mac, the arm64 installer).")


def ensure_login(env):
    if env.get("CLOUDFLARE_API_TOKEN"):
        say("Using the Cloudflare API token from your environment.", "ok")
        return
    who = wrangler(["whoami"], env, capture=True)
    if who.returncode == 0 and "not authenticated" not in (who.stdout + who.stderr).lower():
        say("Already signed in to Cloudflare.", "ok")
        return
    say("Signing in to Cloudflare. A browser window will open; approve the request there.")
    if wrangler(["login"], env).returncode != 0:
        fail("Cloudflare sign-in didn't complete. Run the script again to retry.")


def deploy(project, workers, env):
    # Copy the site without macOS clutter so it never ends up online.
    staging = SITE_DIR.parent / ".deploy-staging"
    shutil.rmtree(staging, ignore_errors=True)
    shutil.copytree(SITE_DIR, staging,
                    ignore=shutil.ignore_patterns(".DS_Store", "Thumbs.db", "*.tmp"))
    try:
        if workers:
            args = ["deploy", "--assets", str(staging), "--name", project,
                    "--compatibility-date", "2026-09-01"]
        else:
            args = ["pages", "deploy", str(staging), "--project-name", project,
                    "--branch", "main", "--commit-dirty=true",
                    "--commit-message", "Website update"]
        say(f"Publishing to Cloudflare project '{project}'…")
        result = wrangler(args, env)
    finally:
        shutil.rmtree(staging, ignore_errors=True)

    if result.returncode != 0:
        hint = ("If the project name is different in your dashboard, run: "
                f"python3 scripts/deploy.py --project YOUR-NAME")
        if not workers:
            hint += ("\n  If your site shows under 'Workers' rather than 'Pages', add --workers.")
        fail("Cloudflare didn't accept the upload.\n  " + hint)
    say(f"Published. Live at {SITE_URL} and {SITE_URL}/es/ (allow a minute for the update to appear).", "ok")


def main():
    ap = argparse.ArgumentParser(description="Publish the website folder to Cloudflare.")
    ap.add_argument("--project", default=PROJECT_NAME, help=f"Cloudflare project name (default: {PROJECT_NAME})")
    ap.add_argument("--workers", action="store_true", help="deploy as a Worker with static assets instead of Pages")
    ap.add_argument("--check", action="store_true", help="only check the site, don't publish")
    ap.add_argument("--mads-ref", default="main", help="MADS branch, tag or commit to use (default: main, the latest)")
    ap.add_argument("--keep-mads", action="store_true", help="don't download MADS; use the copy already in website/assets")
    a = ap.parse_args()

    if a.keep_mads:
        say("Using the MADS copy already in website/assets (--keep-mads).", "warn")
    else:
        update_mads(a.mads_ref)
    build_pages()
    check_site()
    if a.check:
        return
    ensure_node()
    check_node_arch()
    env = dict(os.environ)
    env["npm_config_include"] = "optional"  # Wrangler's per-computer part is an optional package; never skip it
    ensure_wrangler(env)
    ensure_login(env)
    deploy(a.project, a.workers, env)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        fail("Stopped.")
