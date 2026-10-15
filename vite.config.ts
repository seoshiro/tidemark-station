import { defineConfig } from 'vite';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const source = process.env.GITHUB_SHA || process.env.SOURCE_SHA || (existsSync('.git') ? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() + (execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim() ? '-dirty' : '') : 'local-development');
const version = { app: 'Tidemark Station', version: '2.0.0', source, builtAt: new Date().toISOString() };
export default defineConfig({ base: '/tidemark-station/', build: { target: 'es2022' }, plugins: [{ name: 'station-version', transformIndexHtml(html) { return html.replace('</head>', `<meta name="tidemark-build" content="${source}"></head>`); }, generateBundle() { this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify(version, null, 2) }); } }] });
