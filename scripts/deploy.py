#!/usr/bin/env python3
"""
Deploy the website folder to Cloudflare.

Usage (from the MiguelAdanWebsite folder):
    python3 scripts/deploy.py                 # build both pages from src/ and translations/, check, publish
    python3 scripts/deploy.py --check         # build and check only, publish nothing
    python3 scripts/deploy.py --project NAME  # use a different Cloudflare project name
    python3 scripts/deploy.py --workers       # the site lives in a Worker instead of Pages

It uses Wrangler, Cloudflare's official command-line tool, through `npx`, so the
only requirement is Node.js (https://nodejs.org, or `brew install node`).

Sign-in: the first time, Wrangler opens your browser to log in to Cloudflare and
remembers it afterwards. If you would rather use an API token (for example on a
machine without a browser), set these before running the script:
    export CLOUDFLARE_API_TOKEN=...   # token with "Cloudflare Pages: Edit"
    export CLOUDFLARE_ACCOUNT_ID=...  # shown in the Cloudflare dashboard sidebar
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

PROJECT_NAME = "miguel-adan"          # the Cloudflare Pages project name
SITE_URL = "https://miguel-adan.com"
SCRIPTS_DIR = Path(__file__).resolve().parent       # this folder (scripts/)
SITE_DIR = SCRIPTS_DIR.parent / "website"           # MiguelAdanWebsite/website
WRANGLER = ["npx", "--yes", "wrangler@4"]


def say(msg, kind="info"):
    marks = {"info": "•", "ok": "✓", "warn": "!", "err": "✗"}
    print(f"{marks[kind]} {msg}", flush=True)


def fail(msg):
    say(msg, "err")
    sys.exit(1)


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
    a = ap.parse_args()

    build_pages()
    check_site()
    if a.check:
        return
    ensure_node()
    env = dict(os.environ)
    ensure_login(env)
    deploy(a.project, a.workers, env)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        fail("Stopped.")
