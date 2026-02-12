#!/usr/bin/env node
/**
 * Copies client/dist to server/public for production deploy.
 * Run from repo root after building client.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'client', 'dist');
const dest = path.join(root, 'server', 'public');

if (!fs.existsSync(src)) {
  console.warn('scripts/copy-client-dist.mjs: client/dist not found, skipping');
  process.exit(0);
}
fs.mkdirSync(dest, { recursive: true });
for (const name of fs.readdirSync(src)) {
  const srcPath = path.join(src, name);
  const destPath = path.join(dest, name);
  fs.cpSync(srcPath, destPath, { recursive: true });
}
console.log('Copied client/dist to server/public');
