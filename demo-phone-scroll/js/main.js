import { DEFAULT_CONFIG, getTrackProgress } from './scroll-timeline.js';
import { createPhoneScene } from './phone-scene.js';
import { mountDevPanel } from './dev-panel.js'; // ← temporal

const config = { ...DEFAULT_CONFIG };
const track = document.getElementById('phone-track');
const title = document.querySelector('.hero-title');
const glow = document.querySelector('.phone-glow');
const modelUrl = new URLSearchParams(location.search).get('model') || null; // ej: ?model=models/phone.glb

const applyTrack = () => track.style.setProperty('--track-screens', config.trackScreens);
applyTrack();

let updateDev = () => {};
const scene = await createPhoneScene({
  canvas: document.getElementById('phone-canvas'),
  modelUrl, config,
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
