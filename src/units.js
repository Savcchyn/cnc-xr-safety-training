// Weltmaßstab: 1 Meter = 455 Szenen-Einheiten (≈ CSS-Pixel).
// Dadurch haben die CSS3D-Panels einen Matrix-Scale von ~1 — wichtig für
// Firefox: Gecko verrechnet border-radius/box-shadow mit dem Element-Scale,
// bei winzigen Scales (0.0022) kollabieren Rundungen und Schatten zu Subpixeln.
export const U = 455
