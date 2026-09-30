// Panel temporal de pruebas. Borrar este archivo (y su import en main.js) al integrar.
const FIELDS = [
  ['trackScreens', 'Recorrido (pantallas)', 2, 12, 0.5],
  ['maxRotation', 'Rotación máx (°)', 90, 720, 5],
  ['scaleStart', 'Escala inicial', 0.3, 1.6, 0.01],
  ['scaleEnd', 'Escala final', 0.02, 1, 0.01],
  ['endX', 'Posición final X', -15, 15, 0.1],
  ['endY', 'Posición final Y', -15, 15, 0.1],
  ['endZ', 'Posición final Z', -20, 5, 0.1],
  ['lightIntensity', 'Intensidad de luces', 0, 3, 0.05],
  ['smoothing', 'Suavizado (inercia)', 0.03, 1, 0.01],
];

export function mountDevPanel(el, config, { onChange, onReset }) {
  el.innerHTML = `<div class="dev-head"><span>⚙ DEV</span><span class="dev-toggle">＋</span></div><div class="dev-body"></div>`;
  const body = el.querySelector('.dev-body');
  FIELDS.forEach(([key, label, min, max, step]) => {
    const l = document.createElement('label');
    l.innerHTML = `<span>${label}</span><b>${config[key]}</b><input type="range" min="${min}" max="${max}" step="${step}" value="${config[key]}">`;
    l.querySelector('input').addEventListener('input', (e) => {
      config[key] = +e.target.value; l.querySelector('b').textContent = config[key]; onChange(key);
    });
    body.appendChild(l);
  });
  body.insertAdjacentHTML('beforeend', `<div class="dev-progress">progreso: <span id="dev-p">0.000</span> · rot: <span id="dev-r">0°</span></div><button type="button">Reiniciar animación</button>`);
  body.querySelector('button').addEventListener('click', onReset);
  el.querySelector('.dev-head').addEventListener('click', () => {
    el.classList.toggle('collapsed');
    el.querySelector('.dev-toggle').textContent = el.classList.contains('collapsed') ? '＋' : '－';
  });
  return (p, rotY) => {
    body.querySelector('#dev-p').textContent = p.toFixed(3);
    body.querySelector('#dev-r').textContent = Math.round(rotY * 180 / Math.PI) + '°';
  };
}
