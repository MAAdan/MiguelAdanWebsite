/* The page text in each language. src/template/* and src/layouts/Home.astro write text as {{keys}} or T('key');
   translations/en.json and es.json hold the text for every key. Values are HTML.
   The build stops and lists any key that's missing from either language, so a page is never published with a key
   showing or half translated. */
import en from '../translations/en.json';
import es from '../translations/es.json';

const ALL = { en, es };
const KEY = /\{\{([a-z0-9_.]+)\}\}/g;

export function texts(lang) {
  const data = ALL[lang];
  if (!data) throw new Error(`No translations for "${lang}". Add translations/${lang}.json and import it in src/i18n.js.`);
  const words = Object.fromEntries(Object.entries(data).filter(([k]) => !k.startsWith('_')));
  const T = key => {
    if (!(key in words)) throw new Error(`translations/${lang}.json has no text for: ${key}`);
    return words[key];
  };
  // for attributes and plain-text props, which Astro escapes itself: turn the HTML entities in a value back into characters
  const A = key => T(key).replace(/&(amp|lt|gt|quot|#39);/g, (m, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" })[e]);
  return { words, T, A };
}

/* Replace every {{key}} in a template with its text. Inside <script> the text sits in JavaScript strings, so quotes
   and backslashes are escaped there. Pages in a subfolder (/es/) get their links to shared files pointed back to the root. */
export function fill(template, lang, { up = '' } = {}) {
  const { words } = texts(lang);
  const missing = new Set();
  const parts = template.split(/(<script\b[\s\S]*?<\/script>)/);
  let html = parts.map((part, i) => part.replace(KEY, (m, key) => {
    if (!(key in words)) { missing.add(key); return m; }
    const v = words[key];
    return i % 2 === 1 ? v.replaceAll('\\', '\\\\').replaceAll("'", "\\'") : v;
  })).join('');
  if (missing.size) throw new Error(`translations/${lang}.json has no text for: ${[...missing].sort().join(', ')}`);
  if (up) {
    for (const attr of ['src', 'href', 'poster']) html = html.replaceAll(`${attr}="assets/`, `${attr}="${up}assets/`);
    html = html.replaceAll("'assets/'+", `'${up}assets/'+`);
  }
  return html;
}

/* Wraps code in a script tag for set:html. It lives here, in a .js file, on purpose: Vite scans the text of .astro
   files for script tags before it starts, so a tag written inside an expression there is mistaken for real code. */
export const inlineScript = code => '<' + 'script>\n' + code + '\n</' + 'script>';
