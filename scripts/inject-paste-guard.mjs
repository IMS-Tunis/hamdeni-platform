import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const TARGET_TAGS = [
  '<script src="/assets/js/storage-fallback.js"></script>',
  '<script defer src="/assets/js/paste-guard.js"></script>'
];
const HEAD_CLOSE_REGEX = /([ \t]*)<\/head\s*>/i;
const IGNORED_DIRS = new Set(['node_modules', '.git', 'tests']);

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function injectIntoFile(filePath) {
  const original = await readFile(filePath, 'utf8');
  const missingTags = TARGET_TAGS.filter(tag => !original.includes(tag));
  if (missingTags.length === 0) {
    return false;
  }

  const match = original.match(HEAD_CLOSE_REGEX);
  if (!match) {
    return false;
  }

  const indent = match[1] ?? '';
  const injectionTags = missingTags.map(tag => `${indent}${tag}`).join('\n');
  const injection = `${injectionTags}\n${indent}</head>`;
  const updated = original.replace(HEAD_CLOSE_REGEX, injection);
  if (updated === original) {
    return false;
  }

  await writeFile(filePath, updated, 'utf8');
  return true;
}

async function main() {
  const htmlFiles = await collectHtmlFiles(ROOT_DIR);
  const modified = [];
  for (const file of htmlFiles) {
    const didModify = await injectIntoFile(file);
    if (didModify) {
      modified.push(path.relative(ROOT_DIR, file));
    }
  }

  if (modified.length) {
    console.log('Injected required scripts into:');
    for (const file of modified) {
      console.log(` - ${file}`);
    }
  } else {
    console.log('No files required paste guard injection.');
  }
}

main().catch(error => {
  console.error('Failed to inject paste guard script:', error);
  process.exitCode = 1;
});
