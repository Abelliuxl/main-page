# Agent Notes

This is a static Mac OS X Aqua-style personal homepage. Keep the existing
desktop, window, and mobile navigation language intact.

## Blog Workflow

1. Add a Markdown file under `blog/posts/`.
2. Use the file name as the URL slug, for example `blog/posts/my-note.md` becomes `/blog/my-note.html`.
3. Include front matter:

```markdown
---
title: English list title
displayTitle: 中文文章标题
date: 2026-05-07
excerpt: One short sentence for the desktop Blog window.
tags: macOS, Swift, Debugging
---
```

4. Write the article body in plain Markdown. Supported syntax: paragraphs, `##`/`###` headings, unordered lists, blockquotes, fenced code blocks, inline code, and links.
5. Run:

```bash
node scripts/build-blog.mjs
```

The script generates `blog/*.html`, updates `blog/index.html`, updates `config.json.blogPosts`, and bumps the `CONFIG_VERSION` in `index.html`.

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
