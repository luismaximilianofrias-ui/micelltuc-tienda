import { DEFAULT_CONFIG, getTrackProgress } from './scroll-timeline.js';
import { createPhoneScene } from './phone-scene.js';
import { mountDevPanel } from './dev-panel.js'; // ← temporal

const config = { ...DEFAULT_CONFIG };
const track = document.getElementById('phone-track');
const title = document.querySelector('.hero-title');
const glow = document.querySelector('.phone-glow');
// Modelo por defecto: iPhone 14 Pro. ?model=otro.glb cambia de modelo, ?model=procedural usa el teléfono generado, ?rot=0 ajusta giro inicial (grados)
const q = new URLSearchParams(location.search);
const DEFAULT_MODEL = 'models/iphone_14_pro.glb';
const m = q.get('model');
const modelUrl = window.__PHONE_GLB__ || (m === 'procedural' ? null : m || DEFAULT_MODEL); // __PHONE_GLB__: build standalone
const modelRotationY = (+(q.get('rot') ?? 180)) * Math.PI / 180;

const applyTrack = () => track.style.setProperty('--track-screens', config.trackScreens);
applyTrack();

let updateDev = () => {};
const scene = await createPhoneScene({
  canvas: document.getElementById('phone-canvas'),
  modelUrl, modelRotationY, config,
  onPose(p, cur) {
    title.style.opacity = p.textOpacity;
    title.style.transform = `translateY(${(1 - p.textOpacity) * -30}px)`;
    glow.style.opacity = p.glowOpacity;
    updateDev(cur, p.rotY);
  },
});

const sync = () => scene.setProgress(getTrackProgress(track));
addEventListener('scroll', sync, { passive: true });
addEventListener('resize', sync);
sync();

updateDev = mountDevPanel(document.getElementById('dev-panel'), config, {
  onChange(key) { if (key === 'trackScreens') { applyTrack(); sync(); } scene.forceRender(); },
  onReset() { scrollTo({ top: 0, behavior: 'instant' }); scene.reset(); sync(); },
});
