// Fábrica del modelo. Para cambiar de teléfono: loadPhone('models/mi-telefono.glb')
// (o abrir la demo con ?model=models/mi-telefono.glb). Debe mirar hacia +Z (si no, usar rotationY / ?rot=180). Las animaciones internas del GLB se ignoran.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const PHONE_HEIGHT = 3.2; // altura normalizada en unidades de escena
const BLACK_TINT = 0.3;    // 1 = colores originales del GLB, 0 = negro puro
const ENV_INTENSITY = 0.6; // reflejos del entorno sobre el modelo

export async function loadPhone(url, { rotationY = 0 } = {}) {
  if (!url) return createProceduralPhone();
  const gltf = await new GLTFLoader().loadAsync(url);
  const root = gltf.scene;
  // Look "negro espacial": oscurece la base y modera reflejos del entorno
  root.traverse((o) => {
    if (!o.isMesh) return;
    const m = o.material;
    m.color?.setScalar(BLACK_TINT);
    m.envMapIntensity = ENV_INTENSITY;
    m.needsUpdate = true;
  });
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);
  const wrapper = new THREE.Group();
  wrapper.add(root);
  wrapper.scale.setScalar(PHONE_HEIGHT / Math.max(size.x, size.y, size.z));
  wrapper.rotation.y = rotationY; // corrige modelos que miran hacia -Z
  const g = new THREE.Group(); g.add(wrapper);
  return g;
}

function roundedRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  return s;
}

function shapeGeo(w, h, r, seg = 24) {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), seg);
  const uv = g.attributes.uv, pos = g.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  return g;
}

function wallpaper() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 1024;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 512, 1024);
  grad.addColorStop(0, '#1b1e6b'); grad.addColorStop(.5, '#6a2bd9'); grad.addColorStop(1, '#ff5a8a');
  g.fillStyle = grad; g.fillRect(0, 0, 512, 1024);
  const rg = g.createRadialGradient(150, 300, 10, 150, 300, 420);
  rg.addColorStop(0, 'rgba(90,220,255,.55)'); rg.addColorStop(1, 'rgba(90,220,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 512, 1024);
  g.fillStyle = 'rgba(255,255,255,.92)'; g.textAlign = 'center';
  g.font = '600 150px sans-serif'; g.fillText('9:41', 256, 330);
  g.font = '500 34px sans-serif'; g.fillText('Miércoles 30', 256, 200);
  g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(186, 980, 140, 8);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

export function createProceduralPhone() {
  const W = 1.5, H = PHONE_HEIGHT, D = 0.1, R = 0.27, B = 0.03;
  const phone = new THREE.Group();

  const metal = new THREE.MeshPhysicalMaterial({ color: 0xb9bcc4, metalness: 1, roughness: 0.24, clearcoat: 0.3, clearcoatRoughness: 0.3 });
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(W - 2 * B, H - 2 * B, R), {
    depth: D, bevelEnabled: true, bevelThickness: B, bevelSize: B, bevelSegments: 8, curveSegments: 28,
  }), metal);
  body.geometry.translate(0, 0, -D / 2);
  phone.add(body);

  const zf = D / 2 + B + 0.0015;
  // Pantalla
  const screen = new THREE.Mesh(shapeGeo(W - 0.09, H - 0.09, R - 0.04),
    new THREE.MeshPhysicalMaterial({ map: wallpaper(), emissiveMap: null, roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05 }));
  screen.position.z = zf; phone.add(screen);
  // Isla dinámica
  const isl = new THREE.Mesh(shapeGeo(0.42, 0.12, 0.06, 12), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  isl.position.set(0, H / 2 - 0.19, zf + 0.001); phone.add(isl);

  // Trasera (vidrio satinado)
  const backMat = new THREE.MeshPhysicalMaterial({ color: 0x2a2d3a, metalness: 0.4, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  const back = new THREE.Mesh(shapeGeo(W - 0.09, H - 0.09, R - 0.04), backMat);
  back.rotation.y = Math.PI; back.position.z = -zf; phone.add(back);

  // Módulo de cámaras (visto desde atrás: esquina superior izquierda = +x local)
  const cam = new THREE.Group(); cam.position.set(0.31, H / 2 - 0.62, -zf - 0.001); cam.rotation.y = Math.PI;
  const plate = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(0.62, 0.62, 0.15), { depth: 0.035, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 4, curveSegments: 12 }),
    new THREE.MeshPhysicalMaterial({ color: 0x1a1c25, metalness: 0.6, roughness: 0.3, clearcoat: 1 }));
  cam.add(plate);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xc9ccd4, metalness: 1, roughness: 0.18 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x05060a, metalness: 0.2, roughness: 0.05, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.6 });
  [[-0.14, 0.14], [0.14, 0.14], [-0.14, -0.14]].forEach(([x, y]) => {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 40), ringMat);
    ring.rotation.x = Math.PI / 2; ring.position.set(x, y, 0.05); cam.add(ring);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.06, 32), glassMat);
    lens.rotation.x = Math.PI / 2; lens.position.set(x, y, 0.055); cam.add(lens);
  });
  const flash = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 20), new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0x554422, roughness: .4 }));
  flash.rotation.x = Math.PI / 2; flash.position.set(0.14, -0.14, 0.045); cam.add(flash);
  phone.add(cam);

  // Botones laterales
  const btn = (y, h, side) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.03, h, 0.05), metal); m.position.set(side * (W / 2 + 0.005), y, 0); phone.add(m); };
  btn(0.7, 0.42, 1); btn(0.75, 0.2, -1); btn(0.45, 0.2, -1); btn(1.0, 0.12, -1);
  return phone;
}
