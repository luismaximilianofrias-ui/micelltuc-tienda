// Mapea progreso de scroll (0..1) -> transformación del teléfono. Función PURA:
// mismo progreso => misma pose, por eso la animación es 100% reversible.

export const DEFAULT_CONFIG = {
  trackScreens: 5,     // recorrido vertical de la animación (en alturas de pantalla)
  maxRotation: 360,    // grados de giro total sobre el eje Y
  scaleStart: 1,
  scaleEnd: 0.25,
  endX: 11,            // posición final (sale de pantalla en diagonal)
  endY: -6.5,
  endZ: -6,
  lightIntensity: 1,
  smoothing: 0.14,     // 0..1, inercia visual (0.14 = suave; 1 = sin inercia)
};

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const seg = (p, a, b) => clamp01((p - a) / (b - a));
const ease = (t) => t * t * (3 - 2 * t);                 // smoothstep
const easeIn = (t) => t * t;                             // acelera al salir
const lerp = (a, b, t) => a + (b - a) * t;

// Tramos: [0–.33] gira a 90° y se desliza · [.33–.66] 180° y se aleja · [.66–1] ~360° y sale
export function computePose(p, cfg) {
  const t1 = seg(p, 0, 0.33), t2 = seg(p, 0.33, 0.66), t3 = seg(p, 0.66, 1);
  const rot = cfg.maxRotation * (Math.PI / 180);

  // Ángulo por keyframes: 0 → 25% → 50% → 100% del giro máximo (90°, 180°, 360° con 360)
  let a;
  if (p < 0.33) a = lerp(0, 0.25, ease(t1));
  else if (p < 0.66) a = lerp(0.25, 0.5, lerp(t2, ease(t2), 0.5));
  else a = lerp(0.5, 1, lerp(t3, ease(t3), 0.5));

  const midScale = lerp(cfg.scaleStart, cfg.scaleEnd, 0.28) ; // ≈ 0.75 con valores por defecto
  const scale = p < 0.66
    ? lerp(cfg.scaleStart, midScale, ease(t2))
    : lerp(midScale, cfg.scaleEnd, ease(t3));

  return {
    rotY: rot * a,
    rotX: 0.12 * Math.sin(p * Math.PI * 2),               // leve inclinación cinematográfica
    rotZ: -0.06 * Math.sin(p * Math.PI),
    x: 0.7 * ease(t1) + (cfg.endX - 0.7) * easeIn(t3),
    y: cfg.endY * easeIn(t3),
    z: cfg.endZ * 0.3 * ease(t2) + cfg.endZ * 0.7 * ease(t3),
    scale,
    textOpacity: 1 - seg(p, 0.02, 0.16),
    glowOpacity: 1 - seg(p, 0.55, 0.85),
  };
}

// Progreso 0..1 del scroll dentro de un elemento "track"
export function getTrackProgress(track) {
  const r = track.getBoundingClientRect();
  const total = r.height - window.innerHeight;
  return total > 0 ? clamp01(-r.top / total) : 0;
}
