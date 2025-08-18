import { promises as fs } from 'fs';
import path from 'path';

const BASE_URL = 'https://hamdeni-cs.tn';
const root = path.resolve(process.argv[2] || '.');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const urls = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      urls.push(...await walk(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      if (entry.name === '404.html' || entry.name.startsWith('google')) continue;
      const rel = path.relative(root, full).replace(/\\/g, '/');
      let urlPath;
      if (entry.name === 'index.html') {
        let dir = path.dirname(rel).replace(/\\/g, '/');
        if (dir === '.') dir = '';
        urlPath = '/' + dir;
        if (!urlPath.endsWith('/')) urlPath += '/';
      } else {
        urlPath = '/' + rel;
      }
      urls.push(BASE_URL + urlPath);
    }
  }
  return urls;
}

const urls = (await walk(root)).sort();
const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls.map(u => `  <url><loc>${u}</loc></url>`), '</urlset>', ''].join('\n');
await fs.writeFile(path.join(root, 'sitemap.xml'), xml);

