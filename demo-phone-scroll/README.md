# Demo · Smartphone 3D controlado por scroll

Prototipo independiente (no toca la tienda). Three.js + JS puro, sin build.

## Ejecutar (la forma más fácil)
Abrir **`demo-standalone.html`** con doble clic en Chrome/Edge. Es un solo archivo, sin servidor ni internet.
Se regenera con `node build-standalone.mjs` (requiere `npm i esbuild`).

## Ejecutar la versión modular (para desarrollo)
Los módulos ES requieren servidor local (no funciona con doble clic):

    cd demo-phone-scroll
    python3 -m http.server 8080      # o: npx serve

Abrir http://localhost:8080 (Three.js r160 va incluido en `vendor/`, funciona sin internet).

## Estructura
| Archivo | Rol |
|---|---|
| `js/scroll-timeline.js` | Config + función pura `computePose(progreso)` con todos los tramos. **Aquí se ajusta la coreografía.** |
| `js/phone-scene.js` | Escena, luces, partículas, render loop (rAF). `createPhoneScene()` |
| `js/phone-model.js` | Teléfono procedural o carga de GLB (`loadPhone(url)`) |
| `js/dev-panel.js` | Panel temporal de pruebas (borrar luego) |
| `js/main.js` | Cableado de la demo |

## Cambiar el modelo por un .glb
Colocar el archivo en `models/` y abrir `?model=models/tu-telefono.glb`. Se centra y escala automáticamente; debe mirar hacia +Z.

## Integrar en la tienda
Copiar `#phone-track` (HTML), el CSS de `#phone-track/.phone-stage/.hero-title`, y `scroll-timeline.js`, `phone-scene.js`, `phone-model.js`. Omitir `dev-panel.js`.
