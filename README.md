# miguel-adan.com

The source of [miguel-adan.com](https://miguel-adan.com), Miguel Adan's personal website. It is a single animated page that tells the story of a career that moved from engineering, to leading teams, to product management. The page is available in English and Spanish ([/es/](https://miguel-adan.com/es/)).

The site is built with [Astro](https://astro.build), which turns it into plain static HTML, CSS and JavaScript. The header is made of components from the MA Design System (MADS), the same ones the MADS reference uses, so a change to MADS reaches the site the next time it's built. The text of each language lives in two translation files. A Python script builds the site and publishes it to Cloudflare Pages.

## Folder structure

```
MiguelAdanWebsite/
├── src/
│   ├── pages/
│   │   ├── index.astro     English page  (/)
│   │   ├── es/index.astro  Spanish page  (/es/)
│   │   └── mads/index.astro The MADS reference (/mads/), straight from the MADS package
│   ├── layouts/
│   │   └── Home.astro      The home page: head, the header built from MADS components, and the template parts below
│   ├── template/           The rest of the page, with visible text written as {{keys}}, not as words
│   │   ├── head.html       Title, description and link previews
│   │   ├── top.html        The animated background layers
│   │   ├── main.html       Every section, from the hero to the footer
│   │   └── script.js       The animations and the rest of the page's code
│   ├── styles/
│   │   └── site.css        Layout, backgrounds and site-only components (what MADS doesn't cover)
│   └── i18n.js             Fills the {{keys}} with the text in each language
├── translations/
│   ├── en.json             English text for every key
│   └── es.json             Spanish text for every key
├── public/                 Copied to the site as it is
│   ├── assets/             Images, videos, favicon and link-preview images
│   ├── robots.txt          Tells search engines they may index the site
│   └── sitemap.xml         Lists both pages for search engines
├── scripts/
│   └── deploy.py           Builds, checks and publishes the site to Cloudflare
├── package.json            The packages the site is built with: Astro and MADS (@maadan/mads)
├── astro.config.mjs        Astro settings
└── source assets/          Original artwork (logo, palette, avatar images, résumé notes).
                            Kept on the Mac only: not published and not in Git.
```

`npm run build` writes the finished site to `dist/`, which is what gets published. Don't edit it; it's rebuilt every time.

Not in Git (see `.gitignore`): `node_modules/` and `dist/` (both recreated by npm), the original product recordings, the Wrangler cache (`.wrangler/`), the temporary deploy folder, Python caches, `_to_delete/` and `source assets/` (originals and personal notes stay off the public repository).

## Requirements

- **Node.js.** Install it from [nodejs.org](https://nodejs.org) or run `brew install node`. Astro, the design system and Cloudflare's tool, Wrangler, all run on it.
- **Python 3**, for the deploy script. It's already installed on macOS. No extra packages are needed.
- **Internet access to npm and GitHub** the first time and whenever the packages change: `npm install` downloads Astro from npm and MADS from [github.com/MAAdan/MADS](https://github.com/MAAdan/MADS).
- **A Cloudflare account** with the Pages project `miguel-adan`.

The first time, run this from the `MiguelAdanWebsite` folder:

```
npm install
```

## Everyday tasks

Run every command from the `MiguelAdanWebsite` folder.

### Preview the site while you work

```
npm run dev
```

Then open <http://localhost:4321>. The page reloads by itself when you save a change. The Spanish page is at `/es/` and the MADS reference at `/mads/`. The automatic switch to Spanish only runs on the live site and `*.pages.dev`, so locally use the flag button in the settings card to change language.

To see the finished site exactly as it will be published, run `npm run build` and then `npm run preview`.

### Change some text

1. Find the text in `translations/en.json`, change it, and make the matching change in `translations/es.json`.
2. Check it with `npm run dev`.

The keys are grouped by section of the page, such as `hero.`, `evo.`, `pm.` and `toolkit.`. They're listed in the same order as they appear on the page. Some values contain HTML, for example coloured `<span>`s in headings. Keep those tags as they are.

### Add new text

1. In `src/template/`, write a new key where the text should go, for example `{{contact.new_line}}`. In `src/layouts/Home.astro` (the header) write `T('contact.new_line')` instead, or `A('contact.new_line')` inside an attribute.
2. Add `"contact.new_line": "…"` to **both** `en.json` and `es.json`.

The build stops and names any key that's missing from either language, so the site is never published with a `{{key}}` showing or half translated.

### Change the layout, styles or animations

- **Styles:** `src/styles/site.css`.
- **The header:** `src/layouts/Home.astro`.
- **The sections:** `src/template/main.html`, and their code in `src/template/script.js`.

Colours, fonts, type sizes, spacing, motion and most components come from the MA Design System (MADS), which lives in its own repository: [github.com/MAAdan/MADS](https://github.com/MAAdan/MADS). The site gets it as the `@maadan/mads` package: the stylesheet and the components for the Ideas and Settings menus, the theme toggle, the language switch and the icons. Don't copy their code into this site: change MADS, publish a new version of it, and update the site to it (below). `site.css` only holds what MADS doesn't cover, such as the page layout and the background animations.

### Update the design system

`package.json` names the MADS version the site is built with. To move to a newer one (here, the tag `0.8.1`):

```
npm install github:MAAdan/MADS#0.8.1
```

Check the result with `npm run dev`, including the reference at `/mads/`, then publish.

### Add or replace an image

1. Keep the original in `source assets/` (it stays on your Mac; Git ignores it).
2. Save a web version in `public/assets/`. Use WebP at a sensible size; the avatars are 768 × 768.
3. Refer to it from the template as `assets/file-name.webp`. The build fixes the path for the Spanish page automatically.

The deploy check fails if the page points to an image that doesn't exist. It also warns about files in `public/assets/` that nothing uses, since they'd be uploaded for no reason.

## Publishing

```
python3 scripts/deploy.py
```

(or `npm run deploy`). This does four things, and stops at the first problem:

1. Runs `npm install` if the packages aren't installed yet or `package.json` changed, then builds the site into `dist/` with `npm run build`: the English and Spanish pages and the MADS reference at `/mads/`.
2. Checks every image, video and icon the pages use exists, and lists unused files.
3. Signs in to Cloudflare if needed. The first time, a browser window opens; after that the sign-in is remembered.
4. Uploads `dist/` (without `.DS_Store` files) to the `miguel-adan` Pages project. The live site updates within a minute.

Other options:

| Command | What it does |
|---|---|
| `python3 scripts/deploy.py --check` | Build and check only; publish nothing |
| `python3 scripts/deploy.py --project NAME` | Publish to a differently named Pages project |
| `python3 scripts/deploy.py --workers` | Publish as a Worker with static assets instead of Pages |

To publish without the browser sign-in, for example from another machine, create an API token with the **Cloudflare Pages: Edit** permission and set it before running the script:

```
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
```

Never commit a token. `.env` files are already ignored by Git.

The MADS reference at [www.miguel-adan.com/mads/](https://www.miguel-adan.com/mads/index.html) is part of every build, from the same MADS version as the rest of the site, so there's no separate step to publish it.

## How the page works

- **Settings.** The round gear button at the top right (the MADS `SettingsMenu` component: `mads.popover` with `mads.icon.settings`) opens a floating `mads.card` with two controls: "Toggle to dark or light mode" and "Change language". The card grows out of the button and its rows slide in. It closes when you press the button again, tap or click outside it, or press Esc. The labels are the `settings.*` keys in the translation files.
- **Ideas.** Left of the settings button is a second round button with the light bulb (the MADS `IdeasMenu` component: `mads.popover` with `mads.icon.ideas`). It opens the same kind of floating card, with one link per row: "MA Design System (MADS)" (`https://www.miguel-adan.com/mads/index.html`) and "Book gallery" (`https://www.miguel-adan.com/book-gallery/index.html`). The bulb lights up while the card is open, and opening one card closes the other. The labels are the `ideas.*` keys in the translation files; the links are in `src/layouts/Home.astro`.
- **Light and Dark Mode** follow the device setting. The toggle in the settings card (styled like the bar of the "A" in the logo) overrides it, and the browser remembers the choice (`localStorage` key `ma-theme`).
- **Language.**
  - On a first visit, a Spanish-language browser is sent to `/es/`. Every other language stays on the English page.
  - The flag button in the settings card switches language, and the choice is remembered (`ma-lang`).
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
- **Search:** Google Search Console (Domain property `miguel-adan.com`) with `sitemap.xml` submitted. If a new page is ever added, add it to `public/sitemap.xml` as well.

## Troubleshooting

| Problem | What to do |
|---|---|
| `npm install` fails to fetch `@maadan/mads` | Check your internet connection and that the MADS repository is still public, and that the tag or branch named in `package.json` exists on GitHub. |
| `translations/… has no text for: …` when building | Add the listed keys to the JSON file named in the message. |
| `The pages refer to files that are missing` | Add the file to `public/assets/`, or fix its name in `src/template/`. |
| `Node.js isn't installed` | Install it from nodejs.org or with `brew install node`. |
| `The package "@cloudflare/workerd-darwin-…" could not be found` | npm downloaded Wrangler but dropped its Mac program (workerd), usually because npm's download cache is damaged. The deploy script repairs this by itself: it downloads Wrangler again, then cleans npm's cache and installs the program directly. If it still fails, the npm error printed just above the message says why (for example `EACCES`: run `sudo chown -R $(whoami) ~/.npm`). |
| `Cloudflare didn't accept the upload` | Check the project name in the Cloudflare dashboard and use `--project NAME`. If the site shows under Workers rather than Pages, use `--workers`. |
| A change doesn't show on the live site | Wait a minute and reload with Cmd + Shift + R to skip the browser cache. |
| Site blocked on a company network | Some security filters block newly registered domains for a while. Check from another network, or ask IT to review the domain. |
