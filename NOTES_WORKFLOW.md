# Notes and X Workflow

This site is static and public. Do not add any public note composer, comment box, or browser-side posting UI.

## Notes

Notes are tweet-style public updates rendered from `config.json`.

Edit the top-level `notes` array:

```json
{
  "id": "short-stable-slug",
  "author": "Abelliuxl",
  "handle": "@thunderbloo",
  "date": "2026-05-07",
  "content": "One concise update, written like an X post.",
  "tags": ["AI", "Automation"]
}
```

Guidelines:

- Keep each note under 280 characters unless there is a strong reason not to.
- Write one clear thought per note.
- Use `tags` without `#`; the page and X composer add the hashtag formatting.
- Put newest notes first.
- Use a stable lowercase `id` so agents can target a note later.
- Do not store drafts in browser `localStorage`; notes should live in the repo.

After editing:

```bash
node scripts/build-blog.mjs
python3 -m http.server 8000
```

Verify:

- `http://127.0.0.1:8000/`
- Open the Notes window.
- Check mobile width for no horizontal overflow.

## Agent-assisted X Posting

The webpage uses X Web Intent links, so posting still requires opening X and confirming the post.

To generate a compose URL for an existing note:

```bash
node scripts/x-compose.mjs note current-focus
```

To generate a compose URL for ad hoc text:

```bash
node scripts/x-compose.mjs text "Your post text here"
```

An agent may draft or update `config.json`, run the build, and return the compose URL. It must not invent a hidden public posting endpoint.

## Blog Sharing

Blog posts live in `blog/posts/*.md` and are built by `scripts/build-blog.mjs`.

To generate a compose URL for a blog article:

```bash
node scripts/x-compose.mjs blog sideclick-cgevent-control-arrow
```

The blog compose text should include the article title and excerpt; the URL should be the public article URL from `config.site.url`.

## Deploy

After local verification:

```bash
./scripts/deploy-server94.sh
```
