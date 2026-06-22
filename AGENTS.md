# Agent Notes

This is a static Mac OS X Aqua-style personal homepage. Keep the existing
desktop, window, and mobile navigation language intact.

## Blog Workflow

Each blog article has bilingual (English + Chinese) content. Every article URL
renders both languages; a menu-bar EN/中文 switcher toggles them and shares its
state with the homepage via `localStorage['homepage-language']`.

1. Add a Markdown file under `blog/posts/`.
2. Use the file name as the URL slug, for example `blog/posts/my-note.md` becomes `/blog/my-note.html`.
3. Include bilingual front matter:

```markdown
---
title: English Title
titleZh: 中文标题
excerpt: One short English sentence for the desktop Blog window list.
excerptZh: 一句中文摘要，用于桌面 Blog 窗口列表。
date: 2026-05-07
tags: macOS, Swift, Debugging
---
```

Front matter fields:

| Field | Required | Purpose | Fallback if missing |
|---|---|---|---|
| `title` | yes | `<title>` tag + homepage English list title + browser/X-share text | — |
| `excerpt` | yes | homepage English list excerpt | — |
| `date` | yes | publish date, `YYYY-MM-DD` (shared by both languages — write it once) | — |
| `tags` | no | comma-separated, shared by both languages (write once) | empty |
| `titleZh` | no | Chinese title (homepage 中文 list + article `<title>` in zh mode) | falls back to `title` |
| `excerptZh` | no | Chinese excerpt (homepage 中文 list) | falls back to `excerpt` |
| `displayTitle` | no | English `<h1>` headline if it should differ from `title` | falls back to `title` |
| `displayTitleZh` | no | Chinese `<h1>` headline if it should differ from `titleZh` | falls back to `titleZh` |

`date` and `tags` are shared between both languages — write them exactly once.
Never duplicate them.

4. Write the article body in plain Markdown, split into two language sections with
   `<!-- lang: en -->` and `<!-- lang: zh -->` markers:

```markdown
<!-- lang: en -->
English body in plain Markdown. Supports paragraphs, `##`/`###` headings,
unordered lists, blockquotes, fenced code blocks, inline `code`, `[links](url)`,
and fenced ```chart blocks containing chart JSON.

<!-- lang: zh -->
中文正文，同样的 Markdown 语法。支持段落、`##`/`###` 标题、无序列表、
引用、围栏代码块、行内 `代码`、`[链接](url)`，以及 ```chart 数据图块。
```

Body rules:

- Each `<!-- lang: en -->` / `<!-- lang: zh -->` marker must be on its own line.
  The section runs from the marker to the next marker (or end of file).
- Supported Markdown: paragraphs, `##`/`###` headings, unordered lists (`- `),
  blockquotes (`> `), fenced code blocks (```` ``` ````), inline `` `code` ``,
  `[label](href)` links, and fenced `chart` blocks containing chart JSON.
- **Fallback:** if one language section is missing, that language renders the
  other language's body. If there are no `<!-- lang -->` markers at all, the
  entire body is treated as Chinese. So you can ship a single-language draft and
  fill in the other language later.
- Chart JSON: `{ "title", "unit"?, "max"?, "caption"?, "items": [ { "label", "value", "display"?, "tone" } ] }`.
  Allowed `tone` values: `blue`, `slate`, `orange`, `red`, `green`.

5. Run:

```bash
node scripts/build-blog.mjs
```

The script generates `blog/*.html` (each containing both languages plus a
switcher), updates `blog/index.html`, **auto-syncs both `config.json.blogPosts`
(English base) and `config.json.i18n.zh.blogPosts` (Chinese overrides) from the
front matter** (do not hand-edit these — they are rewritten every build), and
bumps the `CONFIG_VERSION` in `index.html`.

## Local Verification

Run a local static server from the repo root:

```bash
python3 -m http.server 8000
```

Check:

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/blog/<slug>.html`

For mobile layout, ensure code blocks wrap and there is no horizontal page overflow.

## Deploy

The production website is published directly to server94. After building and
verifying the site, deploy with:

```bash
./scripts/deploy-server94.sh
```

The deploy script builds the blog first, then rsyncs the static site to `/home/ubuntu/main-page` on `server94`.

Do not run `git commit`, `git push`, create pull requests, or otherwise manage
GitHub unless the user explicitly asks for that separate task. GitHub repository
maintenance is handled by the user and is not part of publishing this website.
For normal content updates, "publish", "push", or "deploy" means running the
server94 deploy script above.

## Style Rules

- Do not introduce a new framework or build pipeline for normal blog updates.
- Keep the desktop Blog entry as a window and as a mobile nav section.
- Keep article pages visually aligned with `blog/templates/article.html`.
- Avoid gradients, cards inside cards, and colorful UI decoration.
