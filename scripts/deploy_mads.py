#!/usr/bin/env python3
"""
Publish the MA Design System (MADS) reference at https://www.miguel-adan.com/mads/index.html

Usage (from the MiguelAdanWebsite folder):
    python3 scripts/deploy_mads.py                 # download the latest MADS, check, publish
    python3 scripts/deploy_mads.py --check         # download and check only, publish nothing
    python3 scripts/deploy_mads.py --mads-ref v1.2 # publish a MADS tag, branch or commit instead of the latest
    python3 scripts/deploy_mads.py --keep-mads     # don't download, publish the copy already in website/mads
    python3 scripts/deploy_mads.py --project NAME  # use a different Cloudflare project name
    python3 scripts/deploy_mads.py --workers       # the site lives in a Worker instead of Pages

It downloads the MADS repository (https://github.com/MAAdan/MADS: index.html, css/,
icons/, tokens/ …) into website/mads/, then publishes the website folder to the same
Cloudflare project as the rest of the site. Don't edit website/mads/: change MADS on
GitHub instead and run this again.

Why the whole website folder: Cloudflare Pages replaces the entire site on every
upload, so uploading only MADS would take the homepage offline. Because the MADS copy
lives inside website/, scripts/deploy.py publishes it too and never removes it.

This script doesn't rebuild the homepage: it publishes website/index.html and es/ as
they are (the last build). Use scripts/deploy.py for homepage changes.

It reuses the Cloudflare sign-in and Wrangler setup from scripts/deploy.py, so the
requirements are the same: Node.js, and a Cloudflare sign-in or API token.
"""

import argparse
import io
import json
import os
import re
import shutil
import sys
import tarfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
try:
    from deploy import (PROJECT_NAME, SITE_DIR, MADS_REPO, MADS_API, say, fail, download,
                        ensure_node, check_node_arch, ensure_wrangler, ensure_login, wrangler)
except ImportError as e:
    print(f"✗ deploy_mads.py needs deploy.py in the same scripts folder ({e}).")
    sys.exit(1)

MADS_DIR = SITE_DIR / "mads"                                   # website/mads → /mads/ online
MADS_URL = "https://www.miguel-adan.com/mads/index.html"
MADS_TARBALL = "https://codeload.github.com/{repo}/tar.gz/{ref}"
SKIP = {"README.md", ".DS_Store", "Thumbs.db"}                 # in the repository but not published
STAMP = ".mads-version"                                        # records which MADS commit the copy is


def update_mads_folder(ref):
    """Replace website/mads with the MADS repository at one exact commit."""
    try:
        sha = json.loads(download(MADS_API.format(repo=MADS_REPO, ref=ref)))["sha"]
    except Exception:
        sha = None  # GitHub's API can be rate limited; the download itself still works
    version = sha or ref
    url = MADS_TARBALL.format(repo=MADS_REPO, ref=version)
    try:
        data = download(url)
    except Exception as e:
        fail(f"Couldn't download MADS from {url}\n  ({e})\n"
             "  Check your internet connection and that the repository is still public.\n"
             "  To publish the copy already in website/mads, run again with --keep-mads.")

    # Unpack into a new folder first, so a broken download never replaces a good copy.
    fresh = SITE_DIR / ".mads-download"
    shutil.rmtree(fresh, ignore_errors=True)
    try:
        with tarfile.open(fileobj=io.BytesIO(data), mode="r:gz") as tar:
            for m in tar.getmembers():
                parts = Path(m.name).parts[1:]          # drop GitHub's "MADS-<commit>/" top folder
                if not m.isfile() or not parts or ".." in parts or parts[-1] in SKIP \
                        or any(p.startswith(".") for p in parts):
                    continue
                target = fresh.joinpath(*parts)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(tar.extractfile(m).read())
    except (tarfile.TarError, OSError) as e:
        shutil.rmtree(fresh, ignore_errors=True)
        fail(f"The MADS download couldn't be unpacked ({e}). Nothing was changed.")

    page = fresh / "index.html"
    if not page.is_file() or "mads" not in page.read_text(encoding="utf-8", errors="replace").lower():
        shutil.rmtree(fresh, ignore_errors=True)
        fail(f"The download from {url} has no MADS index.html. Nothing was changed.")

    (fresh / STAMP).write_text(
        f"MADS from https://github.com/{MADS_REPO} at {version}.\n"
        "Downloaded by scripts/deploy_mads.py: don't edit this folder, change MADS instead.\n",
        encoding="utf-8")
    old = (MADS_DIR / STAMP).read_text(encoding="utf-8") if (MADS_DIR / STAMP).is_file() else ""
    shutil.rmtree(MADS_DIR, ignore_errors=True)
    fresh.rename(MADS_DIR)
    where = f"{MADS_REPO}@{sha[:7]}" if sha else f"{MADS_REPO} ({ref})"
    say(f"MADS is up to date ({where})." if sha and sha in old else f"MADS updated from {where}.", "ok")


def check_mads():
    """Make sure the MADS page and every local file it uses are there, and the homepage still is."""
    page = MADS_DIR / "index.html"
    if not page.is_file():
        fail("website/mads/index.html is missing. Run without --keep-mads to download MADS.")
    for home in (SITE_DIR / "index.html", SITE_DIR / "es" / "index.html"):
        if not home.is_file():
            fail(f"Can't find {home}. Publishing without it would take that page offline.\n"
                 "  Run python3 scripts/deploy.py --check first to build the homepage.")

    html = page.read_text(encoding="utf-8")
    refs = re.findall(r'(?:href|src)="([^"#?]+)', html)
    local = [r for r in refs if not re.match(r"^(?:[a-z]+:|//|\$\{|/)", r, re.I)]
    missing = [r for r in local if not (MADS_DIR / r).is_file()]
    if missing:
        fail("The MADS page refers to files that are missing:\n    " + "\n    ".join(sorted(set(missing))))

    files = [p for p in MADS_DIR.rglob("*") if p.is_file() and p.name not in SKIP | {STAMP}]
    size = sum(p.stat().st_size for p in files) / 1_000_000
    say(f"MADS checked: {len(files)} files, {size:.1f} MB, nothing missing.", "ok")


def publish(project, workers, env):
    # Copy the whole site (homepage + MADS) without macOS clutter, then upload it in one go.
    staging = SITE_DIR.parent / ".deploy-staging"
    shutil.rmtree(staging, ignore_errors=True)
    shutil.copytree(SITE_DIR, staging,
                    ignore=shutil.ignore_patterns(".DS_Store", "Thumbs.db", "*.tmp", ".mads-download", STAMP))
    try:
        if workers:
            args = ["deploy", "--assets", str(staging), "--name", project,
                    "--compatibility-date", "2026-09-01"]
        else:
            args = ["pages", "deploy", str(staging), "--project-name", project,
                    "--branch", "main", "--commit-dirty=true",
                    "--commit-message", "MADS update"]
        say(f"Publishing MADS (with the current homepage) to Cloudflare project '{project}'…")
        result = wrangler(args, env)
    finally:
        shutil.rmtree(staging, ignore_errors=True)

    if result.returncode != 0:
        hint = f"If the project name is different in your dashboard, run: python3 scripts/deploy_mads.py --project YOUR-NAME"
        if not workers:
            hint += "\n  If your site shows under 'Workers' rather than 'Pages', add --workers."
        fail("Cloudflare didn't accept the upload.\n  " + hint)
    say(f"Published. MADS is live at {MADS_URL} (allow a minute for the update to appear).", "ok")


def main():
    ap = argparse.ArgumentParser(description="Publish the MADS reference to miguel-adan.com/mads/.")
    ap.add_argument("--project", default=PROJECT_NAME, help=f"Cloudflare project name (default: {PROJECT_NAME})")
    ap.add_argument("--workers", action="store_true", help="deploy as a Worker with static assets instead of Pages")
    ap.add_argument("--check", action="store_true", help="only download and check, don't publish")
    ap.add_argument("--mads-ref", default="main", help="MADS branch, tag or commit to publish (default: main, the latest)")
    ap.add_argument("--keep-mads", action="store_true", help="don't download MADS; publish the copy already in website/mads")
    a = ap.parse_args()

    if a.keep_mads:
        say("Using the MADS copy already in website/mads (--keep-mads).", "warn")
    else:
        update_mads_folder(a.mads_ref)
    check_mads()
    if a.check:
        return
    ensure_node()
    check_node_arch()
    env = dict(os.environ)
    env["npm_config_include"] = "optional"  # Wrangler's per-computer part is an optional package; never skip it
    ensure_wrangler(env)
    ensure_login(env)
    publish(a.project, a.workers, env)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        fail("Stopped.")
