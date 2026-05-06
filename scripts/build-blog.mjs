#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(rootDir, 'blog', 'posts');
const templatePath = path.join(rootDir, 'blog', 'templates', 'article.html');
const configPath = path.join(rootDir, 'config.json');
const configVersionPattern = /const CONFIG_VERSION = '([^']+)'/;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function parseFrontMatter(source, filePath) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`${filePath} is missing front matter`);
  }

  const meta = {};
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const separator = line.indexOf(':');
    if (separator === -1) {
      throw new Error(`Invalid front matter line in ${filePath}: ${rawLine}`);
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    meta[key] = value.replace(/^['"]|['"]$/g, '');
  }

  if (!meta.title || !meta.date || !meta.excerpt) {
    throw new Error(`${filePath} requires title, date, and excerpt`);
  }

  meta.tags = meta.tags ? meta.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [];
  meta.displayTitle = meta.displayTitle || meta.title;

  return { meta, body: match[2].trim() };
}

function renderInline(source) {
  const tokens = [];
  let text = escapeHtml(source);

  text = text.replace(/`([^`]+)`/g, (_, code) => {
    const token = `@@CODE_${tokens.length}@@`;
    tokens.push(`<code>${code}</code>`);
    return token;
  });

  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const token = `@@LINK_${tokens.length}@@`;
    tokens.push(`<a href="${href}">${label}</a>`);
    return token;
  });

  return tokens.reduce((html, token, index) => {
    return html.replace(`@@${token.startsWith('<code') ? 'CODE' : 'LINK'}_${index}@@`, token);
  }, text);
}

function isBlockStart(line) {
  return (
    line === '' ||
    line.startsWith('# ') ||
    line.startsWith('## ') ||
    line.startsWith('### ') ||
    line.startsWith('- ') ||
    line.startsWith('> ') ||
    line.startsWith('```')
  );
}

function renderMarkdown(markdown) {
  const lines = markdown.split('\n');
  const html = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      index += 1;
      const codeLines = [];
      while (index < lines.length && !lines[index].startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    if (line.startsWith('### ')) {
      html.push(`<h3>${renderInline(line.slice(4).trim())}</h3>`);
      index += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      html.push(`<h2>${renderInline(line.slice(3).trim())}</h2>`);
      index += 1;
      continue;
    }

    if (line.startsWith('# ')) {
      html.push(`<h1>${renderInline(line.slice(2).trim())}</h1>`);
      index += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      const items = [];
      while (index < lines.length && lines[index].startsWith('- ')) {
        items.push(`<li>${renderInline(lines[index].slice(2).trim())}</li>`);
        index += 1;
      }
      html.push(`<ul>\n${items.join('\n')}\n</ul>`);
      continue;
    }

    if (line.startsWith('> ')) {
      const quoteLines = [];
      while (index < lines.length && lines[index].startsWith('> ')) {
        quoteLines.push(lines[index].slice(2).trim());
        index += 1;
      }
      html.push(`<blockquote>\n<p>${renderInline(quoteLines.join(' '))}</p>\n</blockquote>`);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && !isBlockStart(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    html.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
  }

  return html.join('\n\n');
}

function renderArticle(post, template) {
  const tags = post.meta.tags
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join('\n                        ');

  return template
    .replaceAll('{{title}}', escapeHtml(post.meta.title))
    .replaceAll('{{displayTitle}}', escapeHtml(post.meta.displayTitle))
    .replaceAll('{{date}}', escapeHtml(post.meta.date))
    .replaceAll('{{tagLine}}', escapeHtml(post.meta.tags.join(' / ')))
    .replaceAll('{{tags}}', tags)
    .replaceAll('{{body}}', renderMarkdown(post.body));
}

function renderBlogIndex(posts) {
  const latest = posts[0];
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Abelliuxl Macintosh</title>
    <meta http-equiv="refresh" content="0; url=${latest.link}">
    <link rel="canonical" href="${latest.link}">
</head>
<body>
    <p><a href="${latest.link}">Open latest post</a></p>
</body>
</html>
`;
}

function updateConfig(posts) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.blogPosts = posts.map((post) => ({
    title: post.meta.title,
    date: post.meta.date,
    excerpt: post.meta.excerpt,
    link: post.link,
    tags: post.meta.tags,
  }));
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

function bumpConfigVersion() {
  const indexPath = path.join(rootDir, 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const now = new Date();
  const version = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '-',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
  ].join('');

  if (!configVersionPattern.test(indexHtml)) {
    throw new Error('Could not find CONFIG_VERSION in index.html');
  }

  fs.writeFileSync(indexPath, indexHtml.replace(configVersionPattern, `const CONFIG_VERSION = '${version}'`));
}

function main() {
  const template = fs.readFileSync(templatePath, 'utf8');
  const posts = fs
    .readdirSync(postsDir)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const filePath = path.join(postsDir, fileName);
      const slug = path.basename(fileName, '.md');
      const { meta, body } = parseFrontMatter(fs.readFileSync(filePath, 'utf8'), filePath);
      return {
        slug,
        meta,
        body,
        link: `/blog/${slug}.html`,
        outputPath: path.join(rootDir, 'blog', `${slug}.html`),
      };
    })
    .sort((left, right) => right.meta.date.localeCompare(left.meta.date));

  if (posts.length === 0) {
    throw new Error(`No markdown posts found in ${postsDir}`);
  }

  for (const post of posts) {
    fs.writeFileSync(post.outputPath, renderArticle(post, template));
  }

  fs.writeFileSync(path.join(rootDir, 'blog', 'index.html'), renderBlogIndex(posts));
  updateConfig(posts);
  bumpConfigVersion();

  console.log(`Built ${posts.length} blog post(s).`);
}

main();
