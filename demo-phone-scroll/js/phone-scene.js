// Escena reutilizable: createPhoneScene({canvas, modelUrl, config}) -> { setProgress, reset, dispose, lights }
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { loadPhone } from './phone-model.js';
import { computePose } from './scroll-timeline.js';

export async function createPhoneScene({ canvas, modelUrl, config, onPose }) {
  const isMobile = matchMedia('(max-width: 768px)').matches || matchMedia('(pointer: coarse)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  // Luces: principal, bordes (rim) y relleno
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 4, 6);
  const rimA = new THREE.DirectionalLight(0x7f9bff, 3.0); rimA.position.set(-6, 1, -3);
  const rimB = new THREE.DirectionalLight(0xff9ad5, 2.4); rimB.position.set(6, -1, -4);
  const fill = new THREE.PointLight(0xffffff, 8, 20); fill.position.set(0, -3, 5);
  const lights = [[key, 2.2], [rimA, 3.0], [rimB, 2.4], [fill, 8]];
  scene.add(key, rimA, rimB, fill);

  // Partículas ambientales
  const N = isMobile ? 90 : 260, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i*3] = (Math.random()-.5)*16; pos[i*3+1] = (Math.random()-.5)*10; pos[i*3+2] = -6 + Math.random()*10; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x9fb0ff, size: 0.03, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(particles);

  const pivot = new THREE.Group(); scene.add(pivot);
  const phone = await loadPhone(modelUrl); pivot.add(phone);

  let target = 0, current = 0, raf = 0, baseScale = 1, dirty = true;
  const applyLights = () => lights.forEach(([l, i]) => (l.intensity = i * config.lightIntensity));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Móvil vertical: cámara algo más lejos para que el teléfono nunca se recorte
    camera.position.z = camera.aspect < 0.7 ? 10 : 9;
    baseScale = camera.aspect < 0.7 ? 0.95 : 1;
    camera.updateProjectionMatrix(); dirty = true;
  }
  addEventListener('resize', resize); resize();

  function frame() {
    raf = requestAnimationFrame(frame);
    const k = config.smoothing;
    const delta = target - current;
    if (Math.abs(delta) > 1e-5) { current += delta * k; dirty = true; } else current = target;
    if (!dirty) return; dirty = false;

    const p = computePose(current, config);
    pivot.position.set(p.x, p.y, p.z);
    pivot.rotation.set(p.rotX, p.rotY, p.rotZ);
    pivot.scale.setScalar(p.scale * baseScale);
    particles.position.y = current * 2.5; particles.rotation.y = current * 0.6;
    applyLights();
    renderer.render(scene, camera);
    onPose?.(p, current);
  }
  frame();

  return {
    setProgress(v) { target = v; },
    forceRender() { dirty = true; },
    reset() { target = current = 0; dirty = true; },
    dispose() { cancelAnimationFrame(raf); removeEventListener('resize', resize); renderer.dispose(); },
  };
}
