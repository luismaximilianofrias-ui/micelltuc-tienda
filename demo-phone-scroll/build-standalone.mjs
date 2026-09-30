// Genera demo-standalone.html (un solo archivo, abre con doble clic). Uso: node build-standalone.mjs
// Requiere: npm i esbuild (solo para generar; la demo en sí no lo necesita)
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
const r = await build({
  entryPoints: ['js/main.js'], bundle: true, minify: true, format: 'esm', write: false, target: 'es2022',
  alias: { three: './vendor/three/build/three.module.js', 'three/addons': './vendor/three/examples/jsm' },
});
const js = r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
let html = readFileSync('index.html', 'utf8');
html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/, '')
  .replace('<link rel="stylesheet" href="css/styles.css">', `<style>${readFileSync('css/styles.css', 'utf8')}</style>`)
  .replace('<script type="module" src="js/main.js"></script>', () => `<script type="module">${js}</script>`);
writeFileSync('demo-standalone.html', html);
console.log('demo-standalone.html', (html.length / 1024).toFixed(0) + ' KB');
