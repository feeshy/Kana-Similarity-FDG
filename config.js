// Kana Similarity FDG — display & force layout parameters
const FORCE = {
  // ─── Display ──────────────────────────────────────────
  nodeRadius:    22,   // circle radius (px)
  nodeFontSize:  28,   // kana character inside circle (px)

  // ─── Force layout (shared defaults) ──────────────────
  link: {
    distScale:   2,  // distance = rawDist * distScale (px)
    strength:    1.0,  // attraction = strength / (dist/50)
  },
  charge:       -20,   // many-body repulsion
  collide:      32,    // collision radius
  alphaDecay:   0.02,
  alphaIdle:    0.005, // keep-alive target (prevents sim from stopping)
  alphaWake:    0.3,   // energy on resize / drag wake-up

  // ─── Per-mode overrides (optional) ─────────────────────
  // uncomment & adjust to tune a specific mode
  // hira: { charge: -50, collide: 30 },
  // kata: { charge: -30, collide: 35 },
  // cross: { charge: -60, link: { distScale: 2.0, strength: 0.4 } },

  // ─── Color ────────────────────────────────────────────
  nodeH:        '#d63d3d', // hiragana fill
  nodeK:        '#3d7bd6', // katakana fill
  linkVisual:   '#c7c7cc', // visual-similarity link stroke
  linkOpacity:  0.5,      // visual link opacity

  // ─── Per-mode link thresholds ──────────────────────────
  // max perceptual distance for showing connections in each mode
  hira: { withinDist: 70 },
  kata: { withinDist: 70 },
  cross: { withinDist: 60, crossDist: 60 },
};
