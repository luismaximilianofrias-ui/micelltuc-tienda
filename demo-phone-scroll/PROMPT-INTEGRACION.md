# Instrucción para el chat del proyecto de la tienda (copiar y pegar)

> Antes de pegar: copiá la carpeta `demo-phone-scroll/` dentro de tu proyecto (o pedile al chat que la tome de
> la rama `claude/stoic-dirac-sj2tf0` del repo `luismaximilianofrias-ui/micelltuc-tienda`). Después pegá esto:

---

Quiero integrar en esta tienda una animación 3D de un smartphone controlada por scroll, que **reemplace el hero actual** del `index.html`.
Ya existe una demo funcionando en la carpeta `demo-phone-scroll/` (Three.js, sin build). Léela primero: `README.md`, `js/scroll-timeline.js`,
`js/phone-scene.js`, `js/phone-model.js`, `js/main.js`, `css/styles.css` y `index.html`. No modifiques la carpeta de la demo; extraé de ella.

## Qué construir
Una sección `#home` nueva (reemplaza el hero actual) con esta estructura:

    <section id="home">
      <div id="phone-track">            <!-- alto = trackScreens * 100svh -->
        <div class="phone-stage">       <!-- sticky, 100svh menos la altura del header fijo -->
          <canvas id="phone-canvas">
          <div class="phone-copy">…pasos de texto y botones…</div>
        </div>
      </div>
    </section>

### Comportamiento
- La animación depende SOLO del scroll (sin autoplay) y es reversible, igual que la demo: de frente → gira → lateral → trasera → se aleja, se achica y sale de la pantalla en diagonal.
- **PC (ancho > 900px):** el celular queda a la **derecha** de la pantalla; a la **izquierda** aparecen textos y botones por pasos a medida que se hace scroll (cada paso con su tramo de progreso: entra con fade + leve desplazamiento y sale al terminar su tramo).
- **Celular/tablet vertical:** el celular queda **centrado**, como fondo, y los textos/botones van encima, centrados. Agregá un degradado/oscurecimiento suave detrás del texto para que se lea, o reducí levemente la escala del modelo.
- Implementá esto con una opción de posición horizontal (`anchorX`) calculada según el aspect ratio en `phone-scene.js`/`scroll-timeline.js` (no duplicar la escena).
- Pasos de texto de ejemplo (dejalos fáciles de editar, en un array o en el HTML): 1) “Tu celular, protegido” + botón “Ver fundas”; 2) “Carga rápida” + botón “Ver cargadores”; 3) “Todo para tu equipo” + botón “Ver catálogo” (`#catalogo`). Los botones usan las clases `.btn .btn-primary/.btn-outline` que ya existen.
- El contenido del hero anterior (stats, eyebrow, etc.) no se pierde: si tiene sentido, movelo a una franja debajo de la sección 3D. No borres nada más de la tienda.

### Estilo
- Respetar la identidad de la tienda (variables CSS, tipografías Plus Jakarta Sans/Inter, naranja de acento). La sección 3D puede tener fondo oscuro, pero cuidá la transición visual hacia la siguiente sección y el header fijo (`#siteHeader`, más la barra `#announce`).

### Requisitos técnicos
- Sitio estático: poné los archivos en `assets/phone/` (timeline, scene, model, three vendorizado y `models/iphone_14_pro.glb`). Sin panel DEV ni sliders.
- Usar el GLB tal como está en la demo (ya optimizado; el material se fuerza a opaco y hay un entorno de estudio para los reflejos). El modelo mira hacia -Z y se gira 180° en `phone-model.js`.
- Cargar el modelo diferido (no bloquear la carga de la tienda). Si no hay WebGL, si falla el GLB o si el usuario tiene `prefers-reduced-motion`, mostrar un hero estático alternativo (imagen o el hero anterior simplificado) en vez de una pantalla vacía.
- Pausar el render cuando la sección no está visible (IntersectionObserver) y limitar el pixel ratio en móvil.
- Sin scroll horizontal. Respetar `100svh` en móviles.
- Ojo: los módulos ES y `fetch` del GLB no funcionan con `file://`. Para probar en local levantá un servidor estático (`python -m http.server` o `npx serve`) y avisame si preferís empaquetar todo en un solo JS.

### Cómo entregarlo
1. Hacé los cambios en una rama nueva o dejá el commit separado para poder revertir.
2. Probá en 1440×900, 768×1024 y 390×844 (capturas a 0%, 25%, 50%, 75% y 100% del recorrido) y decime qué encontraste.
3. Explicame qué archivos tocaste y cómo cambiar textos, botones y velocidad del recorrido.
