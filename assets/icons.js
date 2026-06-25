/* MI CELL — ilustraciones SVG de productos ficticios (sin fotos externas) */
(function (global) {
  "use strict";

  var PALETTES = [
    { from: "#FF7A1A", to: "#FF9A4D", ic: "#1A1006" },
    { from: "#1B1B1F", to: "#34343B", ic: "#FF8C2E" },
    { from: "#FFE3C2", to: "#FFC98A", ic: "#1A1006" },
    { from: "#E8540C", to: "#FF8A3D", ic: "#FFFFFF" },
    { from: "#F1F1F3", to: "#E2E2E6", ic: "#FF7A1A" }
  ];

  var SHAPES = {
    case: '<rect x="34" y="14" width="32" height="56" rx="9" fill="none" stroke="ICON" stroke-width="3"/><circle cx="50" cy="22" r="1.6" fill="ICON"/><rect x="42" y="58" width="16" height="3" rx="1.5" fill="ICON"/>',
    shield: '<path d="M50 14 L72 22 V46 C72 60 62 68 50 72 C38 68 28 60 28 46 V22 Z" fill="none" stroke="ICON" stroke-width="3"/><path d="M40 44 L47 51 L61 35" fill="none" stroke="ICON" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    plug: '<rect x="38" y="40" width="24" height="16" rx="3" fill="none" stroke="ICON" stroke-width="3"/><path d="M44 40 V30 M56 40 V30" stroke="ICON" stroke-width="3" stroke-linecap="round"/><path d="M50 56 V66" stroke="ICON" stroke-width="3" stroke-linecap="round"/><path d="M44 30 h12" stroke="ICON" stroke-width="3" stroke-linecap="round"/>',
    cable: '<path d="M30 30 C30 44 70 30 70 44 C70 58 50 50 50 64" fill="none" stroke="ICON" stroke-width="3.2" stroke-linecap="round"/><rect x="24" y="24" width="10" height="10" rx="2" fill="ICON"/><rect x="64" y="58" width="10" height="10" rx="2" fill="ICON"/>',
    headphones: '<path d="M30 50 V44 C30 28 70 28 70 44 V50" fill="none" stroke="ICON" stroke-width="3.2" stroke-linecap="round"/><rect x="24" y="48" width="12" height="20" rx="5" fill="none" stroke="ICON" stroke-width="3"/><rect x="64" y="48" width="12" height="20" rx="5" fill="none" stroke="ICON" stroke-width="3"/>',
    speaker: '<rect x="32" y="20" width="36" height="56" rx="10" fill="none" stroke="ICON" stroke-width="3"/><circle cx="50" cy="38" r="7" fill="none" stroke="ICON" stroke-width="3"/><circle cx="50" cy="60" r="11" fill="none" stroke="ICON" stroke-width="3"/><circle cx="50" cy="60" r="4" fill="ICON"/>',
    battery: '<rect x="22" y="36" width="48" height="26" rx="5" fill="none" stroke="ICON" stroke-width="3"/><rect x="71" y="44" width="6" height="10" rx="2" fill="ICON"/><path d="M44 40 L36 50 H44 L40 58 L52 46 H44 Z" fill="ICON"/>',
    stand: '<path d="M30 64 H70" stroke="ICON" stroke-width="3.4" stroke-linecap="round"/><path d="M36 64 L46 34 H58 L66 64" fill="none" stroke="ICON" stroke-width="3.2" stroke-linejoin="round"/><rect x="44" y="20" width="16" height="20" rx="3" fill="none" stroke="ICON" stroke-width="3"/>'
  };

  function svgFor(iconKey, paletteIdx) {
    var p = PALETTES[paletteIdx % PALETTES.length];
    var shape = (SHAPES[iconKey] || SHAPES.case).split("ICON").join(p.ic);
    return (
      '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + p.from + '"/><stop offset="1" stop-color="' + p.to + '"/>' +
      "</linearGradient></defs>" +
      '<circle cx="50" cy="50" r="48" fill="url(#g)"/>' +
      shape +
      "</svg>"
    );
  }

  global.MiCellIcons = { svgFor: svgFor, PALETTES: PALETTES };
})(window);
