import { promises as fs } from 'fs';
import path from 'path';

const root = path.resolve(process.argv[2] || '.');

const urls = [
  'https://hamdeni-cs.tn/',
  'https://hamdeni-cs.tn/igcse/computer-science-0478/',
  'https://hamdeni-cs.tn/as-level/computer-science-9618/',
  'https://hamdeni-cs.tn/a-level/computer-science-9618/'
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(u => `  <url><loc>${u}</loc></url>`),
  '</urlset>',
  ''
].join('\n');

await fs.writeFile(path.join(root, 'sitemap.xml'), xml);

