# MI CELL — Tienda de Accesorios Tecnológicos

Tienda online y panel de administración para un negocio de venta de accesorios para celulares (fundas, protectores, cargadores, cables, auriculares, parlantes, power banks y soportes).

## Estructura

- `index.html` — Tienda online: catálogo con filtros y búsqueda, modal de producto, carrito funcional y checkout, totalmente responsive.
- `admin.html` — Panel de administración: estadísticas, gráficas (productos más vendidos, categorías más vistas, ventas e ingresos) y gestión (alta/edición/baja) de productos y pedidos.
- `assets/products.js` — Catálogo de productos, lógica de carrito, pedidos y analíticas, persistidos en `localStorage`.
- `assets/icons.js` — Ilustraciones SVG generadas para cada producto/categoría (no se usan fotos externas).
- `assets/chart.umd.js` — Chart.js (vendorizado localmente) para las gráficas del panel.

## Uso

Es un sitio estático, sin backend: abrir `index.html` directamente en el navegador o servirlo con cualquier servidor estático. Todos los datos (carrito, pedidos, vistas de producto) se guardan en `localStorage` del navegador.
