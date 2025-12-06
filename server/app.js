import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyPasteFlags } from './paste-flags.js';

const ROOT_DIR = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const PUBLIC_DIR = ROOT_DIR;
const SCRIPT_TAGS = [
  '<script src="/assets/js/storage-fallback.js"></script>',
  '<script defer src="/assets/js/paste-guard.js"></script>'
];
const submissions = [];

function injectPasteGuard(html) {
  const missing = SCRIPT_TAGS.filter(tag => !html.includes(tag));
  if (!missing.length) return html;
  const closingHead = '</head>';
  if (html.includes(closingHead)) {
    const injection = missing.map(tag => `  ${tag}`).join('\n');
    return html.replace(closingHead, `${injection}\n${closingHead}`);
  }
  return `${SCRIPT_TAGS.join('\n')}\n${html}`;
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
    case '.htm':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

async function readStaticFile(resolvedPath) {
  const fileStat = await stat(resolvedPath);
  if (fileStat.isDirectory()) {
    const indexPath = path.join(resolvedPath, 'index.html');
    return readStaticFile(indexPath);
  }
  const body = await readFile(resolvedPath);
  return { body, path: resolvedPath };
}

function safeResolve(requestPath) {
  const normalized = path.normalize('.' + requestPath);
  const resolved = path.resolve(PUBLIC_DIR, normalized);
  if (!resolved.startsWith(PUBLIC_DIR)) {
    return null;
  }
  return resolved;
}

async function handleGet(req, res, url) {
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const resolved = safeResolve(pathname);
  if (!resolved) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  try {
    const { body, path: filePath } = await readStaticFile(resolved);
    const mime = getMimeType(filePath);
    if (mime.startsWith('text/html')) {
      const injected = injectPasteGuard(body.toString('utf8'));
      res.writeHead(200, { 'Content-Type': mime });
      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(injected);
      }
    } else {
      res.writeHead(200, { 'Content-Type': mime });
      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(body);
      }
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server Error');
    }
  }
}

function parseBody(raw, contentType) {
  if (!raw) return new Map();
  if (!contentType) return new Map();
  if (contentType.startsWith('application/json')) {
    try {
      const data = JSON.parse(raw || '{}');
      return new Map(Object.entries(data));
    } catch {
      return new Map();
    }
  }
  if (contentType.startsWith('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw);
    return new Map(params.entries());
  }
  return new Map();
}

async function handlePost(req, res, url) {
  if (url.pathname !== '/submissions') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  const contentType = req.headers['content-type'] || '';
  const entries = parseBody(raw, contentType);
  const { data, flags, attempted } = applyPasteFlags(entries);
  const record = { data, flags, attempted, receivedAt: new Date().toISOString() };
  submissions.push(record);
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(record));
}

export function createServer() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (req.method === 'GET' || req.method === 'HEAD') {
      await handleGet(req, res, url);
      return;
    }
    if (req.method === 'POST') {
      await handlePost(req, res, url);
      return;
    }
    res.writeHead(405, { 'Allow': 'GET, HEAD, POST' });
    res.end();
  });
  server.submissions = submissions;
  return server;
}

export { submissions };
