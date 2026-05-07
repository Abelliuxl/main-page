#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(fs.readFileSync(path.join(rootDir, 'config.json'), 'utf8'));
const [, , type, ...args] = process.argv;

function siteBaseUrl() {
  return config.site?.url || 'https://liuxl.com.cn';
}

function absoluteSiteUrl(pathOrUrl) {
  return new URL(pathOrUrl || '/', siteBaseUrl()).href;
}

function normalizeTags(tags = []) {
  return tags
    .map((tag) => String(tag).replace(/^#/, '').replace(/[^\w\u4e00-\u9fa5]/g, ''))
    .filter(Boolean);
}

function buildIntent({ text, url = '', hashtags = [] }) {
  const intent = new URL('https://twitter.com/intent/tweet');
  if (text) intent.searchParams.set('text', text);
  if (url) intent.searchParams.set('url', url);
  if (hashtags.length > 0) intent.searchParams.set('hashtags', hashtags.join(','));
  return intent.href;
}

function findBlogPost(query) {
  return (config.blogPosts || []).find((post) => {
    const slug = post.link?.split('/').pop()?.replace(/\.html$/, '');
    return slug === query || post.title === query;
  });
}

function findNote(query) {
  return (config.notes || []).find((note) => note.id === query || note.content === query);
}

function usage() {
  console.error(`Usage:
  node scripts/x-compose.mjs blog <slug-or-title>
  node scripts/x-compose.mjs note <note-id>
  node scripts/x-compose.mjs text <post text>`);
  process.exit(1);
}

if (!type || args.length === 0) {
  usage();
}

if (type === 'blog') {
  const post = findBlogPost(args.join(' '));
  if (!post) {
    throw new Error('Blog post not found');
  }
  console.log(buildIntent({
    text: `${post.title}${post.excerpt ? ` - ${post.excerpt}` : ''}`,
    url: absoluteSiteUrl(post.link),
    hashtags: normalizeTags(post.tags),
  }));
} else if (type === 'note') {
  const note = findNote(args.join(' '));
  if (!note) {
    throw new Error('Note not found');
  }
  console.log(buildIntent({
    text: note.content,
    hashtags: normalizeTags(note.tags),
  }));
} else if (type === 'text') {
  console.log(buildIntent({ text: args.join(' ') }));
} else {
  usage();
}
