#!/usr/bin/env python3
"""
Build the English and Spanish pages from the template and the translation files.

    python3 scripts/build.py      (from the MiguelAdanWebsite folder)

  src/index.html          the page, with {{keys}} where the text goes (edit layout, styles and code here)
  translations/en.json    English text for every key
  translations/es.json    Spanish text for every key
  website/index.html      generated English page (don't edit, it's overwritten)
  website/es/index.html   generated Spanish page (don't edit, it's overwritten)

To add new text: put a new {{section.name}} key in src/index.html and add it to BOTH
translation files. The build stops and lists anything missing, so a page is never
published with a key showing or half translated. deploy.py runs this automatically.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # the MiguelAdanWebsite folder (this file is in scripts/)
TEMPLATE = ROOT / "src" / "index.html"
LANGS = {                      # language: (output page, path back to the site root)
    "en": ("website/index.html", ""),
    "es": ("website/es/index.html", "../"),
}
KEY = re.compile(r"\{\{([a-z0-9_.]+)\}\}")


def load(lang):
    data = json.loads((ROOT / "translations" / f"{lang}.json").read_text(encoding="utf-8"))
    return {k: v for k, v in data.items() if not k.startswith("_")}


def fill(template, words):
    # inside <script> the text sits in JavaScript strings, so quotes are escaped there
    parts = re.split(r"(<script\b[\s\S]*?</script>)", template)
    for i, part in enumerate(parts):
        in_script = i % 2 == 1
        def value(m):
            v = words[m.group(1)]
            return v.replace("\\", "\\\\").replace("'", "\\'") if in_script else v
        parts[i] = KEY.sub(value, part)
    return "".join(parts)


def build():
    template = TEMPLATE.read_text(encoding="utf-8")
    used = set(KEY.findall(template))
    texts = {lang: load(lang) for lang in LANGS}
    problems = []
    for lang, words in texts.items():
        missing = sorted(used - words.keys())
        if missing:
            problems.append(f"translations/{lang}.json has no text for: " + ", ".join(missing))
        unused = sorted(words.keys() - used)
        if unused:
            print(f"! translations/{lang}.json has keys the page doesn't use (ignored): " + ", ".join(unused))
    if problems:
        print("✗ Pages not built:\n  - " + "\n  - ".join(problems))
        sys.exit(1)

    for lang, (out, up) in LANGS.items():
        html = fill(template, texts[lang])
        if up:  # page sits in a subfolder: point shared files back to the root
            for attr in ("src", "href", "poster"):
                html = html.replace(f'{attr}="assets/', f'{attr}="{up}assets/')
            html = html.replace("'assets/'+", f"'{up}assets/'+")
        path = ROOT / out
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(html, encoding="utf-8")
    print(f"✓ Pages built from src/index.html: English and Spanish ({len(used)} texts each)")


if __name__ == "__main__":
    build()
