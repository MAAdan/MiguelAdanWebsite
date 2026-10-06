# miguel-adan.com

The source of [miguel-adan.com](https://miguel-adan.com), Miguel Adan's personal website. It is a single animated page that tells the story of a career that moved from engineering, to leading teams, to product management. The page is available in English and Spanish ([/es/](https://miguel-adan.com/es/)).

The site is plain HTML, CSS and JavaScript with no framework. A small Python script fills a page template with the text in each language, and a second script publishes the result to Cloudflare Pages.

## Folder structure

```
MiguelAdanWebsite/
├── src/
│   └── index.html          The page template: layout, styles, animations and code.
│                           Visible text is written as {{keys}}, not as words.
├── translations/
│   ├── en.json             English text for every key
│   └── es.json             Spanish text for every key
├── scripts/
│   ├── build.py            Builds the English and Spanish pages
│   └── deploy.py           Builds, checks and publishes the site to Cloudflare
├── website/                What gets published (the live site)
│   ├── index.html          English page   (generated, don't edit)
│   ├── es/index.html       Spanish page   (generated, don't edit)
│   ├── assets/             Images, videos, favicon and link-preview images
│   │   └── mads.css        The MADS design system (downloaded by deploy.py, don't edit)
│   ├── robots.txt          Tells search engines they may index the site
│   └── sitemap.xml         Lists both pages for search engines
└── source assets/          Original artwork (logo, palette, avatar images, résumé notes).
                            Kept on the Mac only: not published and not in Git.
```

Not in Git (see `.gitignore`): the original product recordings, the Wrangler cache (`.wrangler/`), the temporary deploy folder, Python caches, `_to_delete/` and `source assets/` (originals and personal notes stay off the public repository).

## Requirements

- **Python 3.** It's already installed on macOS. No extra packages are needed.
- **Internet access to GitHub**, only for publishing. The deploy script downloads the design system from [github.com/MAAdan/MADS](https://github.com/MAAdan/MADS).
- **Node.js**, only for publishing. Install it from [nodejs.org](https://nodejs.org) or run `brew install node`. The deploy script uses Cloudflare's own tool, Wrangler, through `npx`, so nothing else needs installing.
- **A Cloudflare account** with the Pages project `miguel-adan`.

## Everyday tasks

Run every command from the `MiguelAdanWebsite` folder.

### Change some text

1. Find the text in `translations/en.json`, change it, and make the matching change in `translations/es.json`.
2. Run `python3 scripts/build.py` to regenerate both pages.
3. Open `website/index.html` in a browser to check it.

The keys are grouped by section of the page, such as `hero.`, `evo.`, `pm.` and `toolkit.`. They're listed in the same order as they appear on the page. Some values contain HTML, for example coloured `<span>`s in headings. Keep those tags as they are.

### Add new text

1. In `src/index.html`, write a new key where the text should go, for example `{{contact.new_line}}`.
2. Add `"contact.new_line": "…"` to **both** `en.json` and `es.json`.
3. Run `python3 scripts/build.py`.

The build stops and lists any key that's missing from either language, so the site is never published with a `{{key}}` showing or half translated. It also warns about keys in the JSON files that the page no longer uses.

### Change the layout, styles or animations

Edit `src/index.html` only. Never edit `website/index.html` or `website/es/index.html`, because the build overwrites them. Then run `python3 scripts/build.py`.

Colours, fonts, type sizes, spacing, motion and most components come from the MA Design System (MADS), which lives in its own repository: [github.com/MAAdan/MADS](https://github.com/MAAdan/MADS). The page loads it from `website/assets/mads.css`. Don't edit that file: change MADS on GitHub, and the next deploy picks it up. `src/index.html` only holds what MADS doesn't cover, such as the page layout and the background animations.

### Add or replace an image

1. Keep the original in `source assets/` (it stays on your Mac; Git ignores it).
2. Save a web version in `website/assets/`. Use WebP at a sensible size; the avatars are 768 × 768.
3. Refer to it from `src/index.html` as `assets/file-name.webp`. The build fixes the path for the Spanish page automatically.

The deploy check fails if the page points to an image that doesn't exist. It also warns about files in `website/assets/` that nothing uses, since they'd be uploaded for no reason.

### Preview the site locally

Opening `website/index.html` directly in a browser works for most things. To preview it as a real web server would serve it:

```
cd website
python3 -m http.server 8000
```

Then open <http://localhost:8000>. The automatic switch to Spanish only runs on the live site and `*.pages.dev`, so locally use the flag button to change language.

## Publishing

```
python3 scripts/deploy.py
```

This does five things, and stops at the first problem:

1. Downloads the latest MADS stylesheet (`css/mads.css` on the `main` branch of [MAAdan/MADS](https://github.com/MAAdan/MADS)) into `website/assets/mads.css`. The first line of the copy says which MADS commit it came from.
2. Builds both pages from `src/` and `translations/`.
3. Checks every image, video and icon the pages use exists, and lists unused files.
4. Signs in to Cloudflare if needed. The first time, a browser window opens; after that the sign-in is remembered.
5. Uploads the `website/` folder (without `.DS_Store` files) to the `miguel-adan` Pages project. The live site updates within a minute.

Other options:

| Command | What it does |
|---|---|
| `python3 scripts/deploy.py --check` | Download MADS, build and check only; publish nothing |
| `python3 scripts/deploy.py --mads-ref NAME` | Use a MADS tag, branch or commit instead of the latest on `main` |
| `python3 scripts/deploy.py --keep-mads` | Don't download MADS; publish with the copy already in `website/assets` |
| `python3 scripts/deploy.py --project NAME` | Publish to a differently named Pages project |
| `python3 scripts/deploy.py --workers` | Publish as a Worker with static assets instead of Pages |

To publish without the browser sign-in, for example from another machine, create an API token with the **Cloudflare Pages: Edit** permission and set it before running the script:

```
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
```

Never commit a token. `.env` files are already ignored by Git.

## How the page works

- **Light and Dark Mode** follow the device setting. The toggle at the top right (styled like the bar of the "A" in the logo) overrides it, and the browser remembers the choice (`localStorage` key `ma-theme`).
- **Language.**
  - On a first visit, a Spanish-language browser is sent to `/es/`. Every other language stays on the English page.
  - The flag button switches language, and the choice is remembered (`ma-lang`).
  - Both pages tell search engines about each other (`hreflang`), so each searcher is shown the right one.
- **Logo.** The header logo morphs into a mouse pointer, a group of people and a Kanban board, one after another. This happens after 10 seconds without activity, holding each for 3 seconds before returning to "MA". The "One logo, three careers" section uses the same shapes.
- **Avatar.** The portrait at the top blinks at random intervals. In "The story", the avatar gets younger as you scroll back through each stage.
- **Backgrounds.** Each section has its own canvas animation: circuits for engineering, a people network for leadership, a Kanban board for product, and flights between cities.
  - Animations pause when they're off screen and run at a capped frame rate.
  - They are switched off when the device asks for reduced motion.
- **Link previews** (LinkedIn, WhatsApp, Slack) use `og-image.jpg` and `og-image-es.jpg` and the page title and description from the translation files.
- **Privacy.** The page has no contact email and no tracking cookies. The current employer and its brands are intentionally not named.

## Cloudflare setup (already done, for reference)

- **Hosting:** Cloudflare Pages project `miguel-adan`, production branch `main`. Also served at `miguel-adan.pages.dev`.
- **Domain:** `miguel-adan.com`, registered with Cloudflare and attached to the project as a custom domain.
- **Analytics:** Cloudflare Web Analytics, with automatic setup. Cloudflare adds its small script when it serves the page, so it isn't in the source files. Visitor numbers are under **Analytics & Logs → Web Analytics**. The zone's **Traffic** view also counts bots, so it's much higher.
- **Search:** Google Search Console (Domain property `miguel-adan.com`) with `sitemap.xml` submitted. If a new page is ever added, add it to `website/sitemap.xml` as well.

## Troubleshooting

| Problem | What to do |
|---|---|
| `Couldn't download MADS …` | Check your internet connection and that the MADS repository is still public. To publish anyway with the copy you have, add `--keep-mads`. |
| `Missing translation …` when building | Add the listed keys to the JSON file named in the message. |
| `The pages refer to files that are missing` | Add the file to `website/assets/`, or fix its name in `src/index.html`. |
| `Node.js isn't installed` | Install it from nodejs.org or with `brew install node`. |
| `Cloudflare didn't accept the upload` | Check the project name in the Cloudflare dashboard and use `--project NAME`. If the site shows under Workers rather than Pages, use `--workers`. |
| A change doesn't show on the live site | Wait a minute and reload with Cmd + Shift + R to skip the browser cache. |
| Site blocked on a company network | Some security filters block newly registered domains for a while. Check from another network, or ask IT to review the domain. |
