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
  // English display headline falls back to the English title.
  meta.displayTitle = meta.displayTitle || meta.title;
  // Chinese fields fall back to their English counterparts so the page is never blank.
  meta.titleZh = meta.titleZh || meta.title;
  meta.excerptZh = meta.excerptZh || meta.excerpt;
  meta.displayTitleZh = meta.displayTitleZh || meta.titleZh;

  return { meta, body: match[2].trim() };
}

// Split the markdown body into { en, zh } using `<!-- lang: en -->` / `<!-- lang: zh -->`
// markers. A file with no markers is treated as Chinese-only (legacy), so the English
// version falls back to the Chinese text.
function splitLanguageBody(body) {
  const sections = { en: null, zh: null };
  const markerRegex = /^[ \t]*<!--\s*lang:\s*(en|zh)\s*-->[ \t]*$/gm;
  const matches = [...body.matchAll(markerRegex)];

  if (matches.length === 0) {
    sections.zh = body.trim();
    return sections;
  }

  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const lang = current[1];
    const start = current.index + current[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : body.length;
    const segment = body.slice(start, end).trim();
    if (segment) {
      sections[lang] = segment;
    }
  }

  return sections;
}

function renderInline(source) {
  const tokens = [];
  let text = escapeHtml(source);

  text = text.replace(/\*\*(.+?)\*\*/g, (_, content) => {
    const token = `@@BOLD_${tokens.length}@@`;
    tokens.push(`<strong>${content}</strong>`);
    return token;
  });

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
    const kind = token.startsWith('<strong') ? 'BOLD' : token.startsWith('<code') ? 'CODE' : 'LINK';
    return html.replace(`@@${kind}_${index}@@`, token);
  }, text);
}

function renderChart(source, filePath) {
  let chart;
  try {
    chart = JSON.parse(source);
  } catch (error) {
    throw new Error(`Invalid chart JSON in ${filePath}: ${error.message}`);
  }

  if (!chart.title || !Array.isArray(chart.items) || chart.items.length === 0) {
    throw new Error(`Chart in ${filePath} requires a title and at least one item`);
  }

  const values = chart.items.map((item) => Number(item.value));
  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new Error(`Chart values in ${filePath} must be non-negative numbers`);
  }

  const maxValue = Number(chart.max) || Math.max(...values, 1);
  const allowedTones = new Set(['blue', 'slate', 'orange', 'red', 'green']);
  const items = chart.items.map((item, index) => {
    const width = Math.min(100, (Number(item.value) / maxValue) * 100);
    const tone = allowedTones.has(item.tone)
      ? item.tone
      : ['blue', 'slate', 'orange'][index % 3];
    return `<div class="chart-row">
    <div class="chart-row-header">
        <span class="chart-label">${escapeHtml(item.label)}</span>
        <span class="chart-value">${escapeHtml(item.display ?? item.value)}${chart.unit ? ` ${escapeHtml(chart.unit)}` : ''}</span>
    </div>
    <div class="chart-track" aria-hidden="true">
        <span class="chart-bar chart-bar-${tone}" style="width: ${width.toFixed(2)}%"></span>
    </div>
</div>`;
  });

  const caption = chart.caption
    ? `<figcaption>${renderInline(chart.caption)}</figcaption>`
    : '';

  return `<figure class="article-chart">
    <div class="chart-title">${escapeHtml(chart.title)}</div>
    <div class="chart-rows">
${items.join('\n')}
    </div>
    ${caption}
</figure>`;
}

function isTableRow(line) {
  return line.trimStart().startsWith('|') && line.trimEnd().endsWith('|');
}

function isTableSeparator(line) {
  return /^\|[\s:-]+\|/.test(line.trim()) && /^[|\s:-]+$/.test(line.trim());
}

function parseTableAlignments(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => {
      const trimmed = cell.trim();
      if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
      if (trimmed.endsWith(':')) return 'right';
      return 'left';
    });
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());
}

function renderTable(headerCells, alignments, dataRows) {
  const headerHtml = headerCells
    .map(
      (cell, i) =>
        `<th style="text-align:${alignments[i] || 'left'}">${renderInline(cell)}</th>`
    )
    .join('');

  const bodyHtml = dataRows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (cell, i) =>
              `<td style="text-align:${alignments[i] || 'left'}">${renderInline(cell)}</td>`
          )
          .join('')}</tr>`
    )
    .join('\n');

  return `<table>\n<thead><tr>${headerHtml}</tr></thead>\n<tbody>\n${bodyHtml}\n</tbody>\n</table>`;
}

function isBlockStart(line) {
  return (
    line === '' ||
    line.startsWith('# ') ||
    line.startsWith('## ') ||
    line.startsWith('### ') ||
    line.startsWith('- ') ||
    line.startsWith('> ') ||
    line.startsWith('```') ||
    isTableRow(line)
  );
}

function renderMarkdown(markdown, filePath) {
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
      const language = line.slice(3).trim();
      index += 1;
      const codeLines = [];
      while (index < lines.length && !lines[index].startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      if (language === 'chart') {
        html.push(renderChart(codeLines.join('\n'), filePath));
      } else {
        html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      }
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

    if (isTableRow(line)) {
      // Collect all table rows
      const tableLines = [];
      while (index < lines.length && isTableRow(lines[index])) {
        tableLines.push(lines[index]);
        index += 1;
      }
      // First row is header, second row should be separator, rest are data
      if (tableLines.length >= 2 && isTableSeparator(tableLines[1])) {
        const headerCells = parseTableRow(tableLines[0]);
        const alignments = parseTableAlignments(tableLines[1]);
        const dataRows = tableLines.slice(2).map(parseTableRow);
        html.push(renderTable(headerCells, alignments, dataRows));
      } else {
        // Not a proper table — treat as paragraph text
        html.push(`<p>${renderInline(tableLines.join(' '))}</p>`);
      }
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

function renderLanguageBody(sections, lang, filePath) {
  const other = lang === 'en' ? 'zh' : 'en';
  const source = sections[lang] ?? sections[other];
  return source ? renderMarkdown(source, filePath) : '';
}

function renderArticle(post, template) {
  const tags = post.meta.tags
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join('\n                        ');

  const bodyEn = renderLanguageBody(post.bodies, 'en', post.filePath);
  const bodyZh = renderLanguageBody(post.bodies, 'zh', post.filePath);

  return template
    .replaceAll('{{titleEn}}', escapeHtml(post.meta.title))
    .replaceAll('{{titleZh}}', escapeHtml(post.meta.titleZh))
    .replaceAll('{{displayTitleEn}}', escapeHtml(post.meta.displayTitle))
    .replaceAll('{{displayTitleZh}}', escapeHtml(post.meta.displayTitleZh))
    .replaceAll('{{date}}', escapeHtml(post.meta.date))
    .replaceAll('{{tagLine}}', escapeHtml(post.meta.tags.join(' / ')))
    .replaceAll('{{tags}}', tags)
    .replaceAll('{{bodyEn}}', bodyEn)
    .replaceAll('{{bodyZh}}', bodyZh);
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
  // English base list consumed by the homepage Blog window.
  config.blogPosts = posts.map((post) => ({
    title: post.meta.title,
    date: post.meta.date,
    excerpt: post.meta.excerpt,
    link: post.link,
    tags: post.meta.tags,
  }));
  // Chinese overrides for the homepage. Written for every post so the list can never
  // drift out of sync with the articles (this is what previously had to be hand-edited).
  if (!config.i18n) config.i18n = {};
  if (!config.i18n.zh) config.i18n.zh = {};
  config.i18n.zh.blogPosts = {};
  for (const post of posts) {
    config.i18n.zh.blogPosts[post.link] = {
      title: post.meta.titleZh,
      excerpt: post.meta.excerptZh,
    };
  }
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
      const parsed = parseFrontMatter(fs.readFileSync(filePath, 'utf8'), filePath);
      return {
        slug,
        filePath,
        meta: parsed.meta,
        bodies: splitLanguageBody(parsed.body),
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
