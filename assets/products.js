/* MI CELL — datos de productos, carrito y analíticas (localStorage) */
(function (global) {
  "use strict";

  var PRODUCTS_KEY = "micell_products";
  var CART_KEY = "micell_cart";
  var ORDERS_KEY = "micell_orders";
  var ANALYTICS_KEY = "micell_analytics";
  var SEED_KEY = "micell_seeded_v1";
  var SETTINGS_KEY = "micell_settings";
  var DEFAULT_SETTINGS = { priceFilterMin: 4000, priceFilterMax: 60000 };

  var CATEGORIES = [
    { id: "fundas", name: "Fundas y Carcasas", icon: "case" },
    { id: "protectores", name: "Protectores de Pantalla", icon: "shield" },
    { id: "cargadores", name: "Cargadores", icon: "plug" },
    { id: "cables", name: "Cables", icon: "cable" },
    { id: "auriculares", name: "Auriculares", icon: "headphones" },
    { id: "parlantes", name: "Parlantes", icon: "speaker" },
    { id: "powerbank", name: "Power Banks", icon: "battery" },
    { id: "soportes", name: "Soportes y Accesorios", icon: "stand" }
  ];

  function cat(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i];
    return null;
  }

  var DEFAULT_PRODUCTS = [
    { id: "p01", name: "Funda Silicone Case", model: "iPhone 15 Pro", category: "fundas", price: 14500, oldPrice: null, stock: 28, badge: "mas-vendido", rating: 4.8, palette: 0, desc: "Funda de silicona suave con forro de microfibra interior, bordes reforzados anti-golpe y botones de metal con respuesta táctil precisa." },
    { id: "p02", name: "Funda Antigolpe MagSafe", model: "iPhone 14", category: "fundas", price: 16900, oldPrice: 19900, stock: 14, badge: "oferta", rating: 4.6, palette: 1, desc: "Carcasa híbrida con esquinas de absorción de impacto certificada y anillos magnéticos compatibles con cargadores MagSafe." },
    { id: "p03", name: "Funda Transparente Anti-Yellow", model: "Samsung Galaxy S23", category: "fundas", price: 9800, oldPrice: null, stock: 32, badge: null, rating: 4.4, palette: 2, desc: "Funda cristal con tratamiento anti-amarillamiento, cámara protegida con relieve y textura antideslizante en los laterales." },
    { id: "p04", name: "Funda Leather Vegan", model: "iPhone 13", category: "fundas", price: 18500, oldPrice: null, stock: 9, badge: "nuevo", rating: 4.9, palette: 3, desc: "Cuero vegano premium cosido a mano, interior acolchado y acabado mate que no se resbala de la mano." },
    { id: "p05", name: "Funda Anillo Soporte", model: "Xiaomi Redmi Note 12", category: "fundas", price: 8900, oldPrice: null, stock: 21, badge: null, rating: 4.3, palette: 4, desc: "Incluye anillo giratorio 360° que funciona como soporte de mesa y agarre antideslizante para una mano." },
    { id: "p06", name: "Vidrio Templado 9H", model: "Universal 6.1\"", category: "protectores", price: 5200, oldPrice: null, stock: 65, badge: "mas-vendido", rating: 4.7, palette: 0, desc: "Dureza 9H, oleofóbico anti-huellas, instalación sin burbujas con kit de alineación incluido." },
    { id: "p07", name: "Protector de Privacidad", model: "iPhone 15", category: "protectores", price: 8700, oldPrice: null, stock: 17, badge: null, rating: 4.5, palette: 1, desc: "Filtro de privacidad anti-espía: la pantalla solo se ve con claridad de frente, ideal para uso en espacios públicos." },
    { id: "p08", name: "Mica Hidrogel Full Cover", model: "Samsung A54", category: "protectores", price: 6300, oldPrice: 7900, stock: 24, badge: "oferta", rating: 4.2, palette: 2, desc: "Lámina hidrogel autorreparable que cubre toda la pantalla incluyendo bordes curvos." },
    { id: "p09", name: "Vidrio Cámara Trasera", model: "iPhone 14 Pro", category: "protectores", price: 4500, oldPrice: null, stock: 38, badge: null, rating: 4.1, palette: 3, desc: "Protege los lentes traseros de rayones y golpes sin alterar la calidad de las fotos." },
    { id: "p10", name: "Cargador Rápido 33W", model: "USB-C Power Delivery", category: "cargadores", price: 12900, oldPrice: null, stock: 19, badge: "mas-vendido", rating: 4.8, palette: 0, desc: "Carga hasta 3 veces más rápido que un cargador estándar, compatible con la mayoría de celulares Android e iPhone." },
    { id: "p11", name: "Cargador Inalámbrico MagSafe", model: "15W", category: "cargadores", price: 17800, oldPrice: null, stock: 11, badge: "nuevo", rating: 4.6, palette: 1, desc: "Carga inalámbrica magnética de alineación automática, base antideslizante y luz indicadora LED." },
    { id: "p12", name: "Cargador Doble Puerto", model: "20W USB-C + USB-A", category: "cargadores", price: 9400, oldPrice: null, stock: 26, badge: null, rating: 4.3, palette: 2, desc: "Dos puertos de carga simultánea, carcasa compacta ideal para viajar." },
    { id: "p13", name: "Cargador para Auto", model: "USB-C PD 30W", category: "cargadores", price: 10800, oldPrice: 12500, stock: 15, badge: "oferta", rating: 4.4, palette: 3, desc: "Se conecta al encendedor del auto, carga rápida para dos dispositivos a la vez con indicador LED." },
    { id: "p14", name: "Cable USB-C a Lightning", model: "1 metro", category: "cables", price: 7200, oldPrice: null, stock: 44, badge: "mas-vendido", rating: 4.7, palette: 0, desc: "Cable certificado de carga y transferencia de datos, conector reforzado para mayor durabilidad." },
    { id: "p15", name: "Cable Trenzado USB-C", model: "2 metros", category: "cables", price: 6800, oldPrice: null, stock: 37, badge: null, rating: 4.5, palette: 1, desc: "Recubrimiento de nylon trenzado resistente a torceduras, ideal para uso diario intensivo." },
    { id: "p16", name: "Cable Micro USB Reforzado", model: "1.2 metros", category: "cables", price: 4900, oldPrice: null, stock: 51, badge: null, rating: 4.0, palette: 2, desc: "Conector de aluminio y núcleo de cobre puro para una carga estable y duradera." },
    { id: "p17", name: "Cable Magnético 3 en 1", model: "USB-C / Lightning / Micro USB", category: "cables", price: 8900, oldPrice: 10900, stock: 20, badge: "oferta", rating: 4.3, palette: 3, desc: "Un solo cable con puntas magnéticas intercambiables para cualquier dispositivo." },
    { id: "p18", name: "Auriculares TWS Pro", model: "Bluetooth 5.3", category: "auriculares", price: 32900, oldPrice: null, stock: 16, badge: "mas-vendido", rating: 4.9, palette: 0, desc: "Sonido estéreo de alta fidelidad, estuche de carga compacto y hasta 24 horas de batería total." },
    { id: "p19", name: "Auriculares In-Ear ANC", model: "Cancelación de ruido", category: "auriculares", price: 45500, oldPrice: null, stock: 8, badge: "nuevo", rating: 4.8, palette: 1, desc: "Cancelación activa de ruido, modo transparencia y controles táctiles intuitivos." },
    { id: "p20", name: "Auriculares Deportivos", model: "Bluetooth IPX7", category: "auriculares", price: 21900, oldPrice: null, stock: 23, badge: null, rating: 4.4, palette: 2, desc: "Resistentes al sudor y al agua, ganchos auriculares ergonómicos para entrenamientos intensos." },
    { id: "p21", name: "Vincha Gamer RGB", model: "Bluetooth + 3.5mm", category: "auriculares", price: 27800, oldPrice: 32900, stock: 12, badge: "oferta", rating: 4.5, palette: 3, desc: "Sonido envolvente, micrófono retráctil y luces RGB personalizables, ideal para gaming." },
    { id: "p22", name: "Parlante Bluetooth Portátil", model: "20W", category: "parlantes", price: 38900, oldPrice: null, stock: 13, badge: "mas-vendido", rating: 4.7, palette: 0, desc: "Graves potentes, resistencia al agua IPX5 y hasta 12 horas de reproducción continua." },
    { id: "p23", name: "Mini Parlante Waterproof", model: "Bluetooth 5.0", category: "parlantes", price: 19900, oldPrice: null, stock: 27, badge: null, rating: 4.3, palette: 1, desc: "Tamaño compacto para llevar a todas partes, resistente a salpicaduras y con correa de sujeción." },
    { id: "p24", name: "Parlante RGB Gamer", model: "USB / Escritorio", category: "parlantes", price: 24500, oldPrice: null, stock: 18, badge: "nuevo", rating: 4.2, palette: 2, desc: "Iluminación RGB sincronizable, sonido envolvente para escritorio y conexión USB plug and play." },
    { id: "p25", name: "Power Bank 10000mAh", model: "Carga rápida 22.5W", category: "powerbank", price: 23900, oldPrice: null, stock: 22, badge: "mas-vendido", rating: 4.8, palette: 0, desc: "Batería externa compacta con carga rápida bidireccional y pantalla digital de porcentaje." },
    { id: "p26", name: "Power Bank 20000mAh", model: "Doble salida USB", category: "powerbank", price: 34900, oldPrice: 39900, stock: 10, badge: "oferta", rating: 4.6, palette: 1, desc: "Gran capacidad para cargar dos dispositivos a la vez, ideal para viajes largos." },
    { id: "p27", name: "Power Bank MagSafe", model: "5000mAh magnético", category: "powerbank", price: 28700, oldPrice: null, stock: 7, badge: "nuevo", rating: 4.5, palette: 2, desc: "Se adhiere magnéticamente a la parte trasera del celular para una carga inalámbrica sobre la marcha." },
    { id: "p28", name: "Soporte Auto Magnético", model: "Ventilación", category: "soportes", price: 8400, oldPrice: null, stock: 34, badge: null, rating: 4.4, palette: 0, desc: "Sujeción magnética de alta resistencia para rejilla de ventilación, instalación en segundos." },
    { id: "p29", name: "Soporte de Escritorio", model: "Ajustable", category: "soportes", price: 7600, oldPrice: null, stock: 29, badge: null, rating: 4.3, palette: 1, desc: "Múltiples ángulos de inclinación, base antideslizante de aluminio, compatible con tablets." },
    { id: "p30", name: "Popsocket Diseño Premium", model: "Universal", category: "soportes", price: 5400, oldPrice: null, stock: 40, badge: null, rating: 4.1, palette: 2, desc: "Agarre extensible y soporte plegable, se adhiere a cualquier funda o celular." },
    { id: "p31", name: "Trípode Selfie Bluetooth", model: "Control remoto incluido", category: "soportes", price: 13900, oldPrice: null, stock: 16, badge: "nuevo", rating: 4.6, palette: 3, desc: "Trípode extensible con control bluetooth remoto, ideal para fotos y videos estables." }
  ];

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function read(key, fallback) {
    try {
      var raw = global.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { global.localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function seedHistory() {
    if (read(SEED_KEY, null)) return;
    var products = read(PRODUCTS_KEY, null) || clone(DEFAULT_PRODUCTS);
    var analytics = { views: {}, sold: {}, categoryViews: {}, salesByDay: {}, revenueByDay: {} };
    var days = 14;
    var now = Date.now();
    var dayMs = 86400000;

    products.forEach(function (p, idx) {
      var weight = p.badge === "mas-vendido" ? 3 : p.badge === "oferta" ? 2 : 1;
      var baseViews = 40 + (idx % 7) * 15;
      var baseSold = 6 + (idx % 5) * 4;
      analytics.views[p.id] = Math.round(baseViews * weight * 0.6);
      analytics.sold[p.id] = Math.round(baseSold * weight * 0.5);
      analytics.categoryViews[p.category] = (analytics.categoryViews[p.category] || 0) + analytics.views[p.id];
    });

    for (var d = days - 1; d >= 0; d--) {
      var dateKey = new Date(now - d * dayMs).toISOString().slice(0, 10);
      var dayOrders = 2 + ((days - d) % 5);
      var dayRevenue = dayOrders * (9000 + ((days - d) * 1300) % 18000);
      analytics.salesByDay[dateKey] = dayOrders;
      analytics.revenueByDay[dateKey] = dayRevenue;
    }

    write(PRODUCTS_KEY, products);
    write(ANALYTICS_KEY, analytics);
    write(SEED_KEY, true);
  }

  seedHistory();

  var Store = {
    CATEGORIES: CATEGORIES,
    categoryById: cat,

    getProducts: function () {
      return read(PRODUCTS_KEY, clone(DEFAULT_PRODUCTS));
    },
    saveProducts: function (list) {
      write(PRODUCTS_KEY, list);
    },
    getProduct: function (id) {
      var list = this.getProducts();
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return null;
    },
    addProduct: function (p) {
      var list = this.getProducts();
      p.id = "p" + Date.now().toString(36);
      list.unshift(p);
      this.saveProducts(list);
      return p;
    },
    updateProduct: function (id, patch) {
      var list = this.getProducts();
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) { list[i] = Object.assign({}, list[i], patch); break; }
      }
      this.saveProducts(list);
    },
    deleteProduct: function (id) {
      var list = this.getProducts().filter(function (p) { return p.id !== id; });
      this.saveProducts(list);
    },

    getCart: function () { return read(CART_KEY, []); },
    saveCart: function (cart) { write(CART_KEY, cart); },
    addToCart: function (id, qty) {
      qty = qty || 1;
      var cart = this.getCart();
      var line = cart.find(function (l) { return l.id === id; });
      if (line) line.qty += qty; else cart.push({ id: id, qty: qty });
      this.saveCart(cart);
      return cart;
    },
    setQty: function (id, qty) {
      var cart = this.getCart();
      if (qty <= 0) cart = cart.filter(function (l) { return l.id !== id; });
      else cart.forEach(function (l) { if (l.id === id) l.qty = qty; });
      this.saveCart(cart);
      return cart;
    },
    removeFromCart: function (id) {
      var cart = this.getCart().filter(function (l) { return l.id !== id; });
      this.saveCart(cart);
      return cart;
    },
    clearCart: function () { this.saveCart([]); },
    getCartLines: function () {
      var self = this;
      return this.getCart().map(function (l) {
        var product = self.getProduct(l.id);
        return product ? { product: product, qty: l.qty, lineTotal: product.price * l.qty } : null;
      }).filter(Boolean);
    },
    getCartCount: function () {
      return this.getCart().reduce(function (sum, l) { return sum + l.qty; }, 0);
    },
    getCartTotal: function () {
      return this.getCartLines().reduce(function (sum, l) { return sum + l.lineTotal; }, 0);
    },

    getAnalytics: function () { return read(ANALYTICS_KEY, { views: {}, sold: {}, categoryViews: {}, salesByDay: {}, revenueByDay: {} }); },
    saveAnalytics: function (a) { write(ANALYTICS_KEY, a); },
    recordView: function (id) {
      var product = this.getProduct(id);
      if (!product) return;
      var a = this.getAnalytics();
      a.views[id] = (a.views[id] || 0) + 1;
      a.categoryViews[product.category] = (a.categoryViews[product.category] || 0) + 1;
      this.saveAnalytics(a);
    },
    recordPurchase: function (id, qty) {
      var a = this.getAnalytics();
      a.sold[id] = (a.sold[id] || 0) + qty;
      var dateKey = new Date().toISOString().slice(0, 10);
      a.salesByDay[dateKey] = (a.salesByDay[dateKey] || 0) + 1;
      var product = this.getProduct(id);
      if (product) a.revenueByDay[dateKey] = (a.revenueByDay[dateKey] || 0) + product.price * qty;
      this.saveAnalytics(a);
    },

    getSettings: function () { return Object.assign({}, DEFAULT_SETTINGS, read(SETTINGS_KEY, {})); },
    saveSettings: function (s) { write(SETTINGS_KEY, s); },

    getOrders: function () { return read(ORDERS_KEY, []); },
    addOrder: function (order) {
      var orders = this.getOrders();
      order.id = "ord" + Date.now().toString(36);
      order.date = new Date().toISOString();
      orders.unshift(order);
      write(ORDERS_KEY, orders);
      var self = this;
      var list = self.getProducts();
      order.items.forEach(function (item) {
        self.recordPurchase(item.id, item.qty);
        list.forEach(function (p) { if (p.id === item.id) p.stock = Math.max(0, p.stock - item.qty); });
      });
      self.saveProducts(list);
      return order;
    },

    topSellingProducts: function (n) {
      var a = this.getAnalytics();
      var self = this;
      return Object.keys(a.sold)
        .map(function (id) { return { product: self.getProduct(id), sold: a.sold[id] }; })
        .filter(function (x) { return x.product; })
        .sort(function (x, y) { return y.sold - x.sold; })
        .slice(0, n || 5);
    },
    topViewedCategories: function () {
      var a = this.getAnalytics();
      return Object.keys(a.categoryViews)
        .map(function (id) { return { category: cat(id), views: a.categoryViews[id] }; })
        .filter(function (x) { return x.category; })
        .sort(function (x, y) { return y.views - x.views; });
    },
    salesSeries: function (days) {
      days = days || 14;
      var a = this.getAnalytics();
      var out = [];
      var now = Date.now();
      var dayMs = 86400000;
      for (var d = days - 1; d >= 0; d--) {
        var key = new Date(now - d * dayMs).toISOString().slice(0, 10);
        out.push({ date: key, orders: a.salesByDay[key] || 0, revenue: a.revenueByDay[key] || 0 });
      }
      return out;
    },
    totals: function () {
      var products = this.getProducts();
      var orders = this.getOrders();
      var a = this.getAnalytics();
      var revenue = orders.reduce(function (sum, o) { return sum + o.total; }, 0);
      var unitsSold = Object.keys(a.sold).reduce(function (sum, id) { return sum + a.sold[id]; }, 0);
      var lowStock = products.filter(function (p) { return p.stock <= 10; }).length;
      return { revenue: revenue, orders: orders.length, unitsSold: unitsSold, lowStock: lowStock, products: products.length };
    }
  };

  global.MiCellStore = Store;
})(window);
