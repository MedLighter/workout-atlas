import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const indexPath = join(distDir, 'index.html');

if (!existsSync(indexPath)) {
  console.error('dist/index.html not found. Run expo export first.');
  process.exit(1);
}

copyFileSync(indexPath, join(distDir, '404.html'));
writeFileSync(join(distDir, '.nojekyll'), '');

if (existsSync(join(process.cwd(), 'public', '_redirects'))) {
  copyFileSync(join(process.cwd(), 'public', '_redirects'), join(distDir, '_redirects'));
}

const basePath = process.env.EXPO_BASE_PATH
  ? `/${process.env.EXPO_BASE_PATH.replace(/^\/+|\/+$/g, '')}/`
  : process.env.GITHUB_PAGES === 'true'
    ? '/workout-atlas/'
    : '';

if (basePath) {
  const manifestPath = join(distDir, 'manifest.json');
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    manifest.start_url = basePath;
    manifest.scope = basePath;
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }
}

console.log(`Prepared dist/ for GitHub Pages${basePath ? ` (${basePath})` : ''}.`);