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
  charge:       -160,   // many-body repulsion
  centering:    0.025,  // forceX/Y strength (pull toward center)
  collide:      32,    // collision radius
  alphaDecay:   0.01,
  alphaIdle:    0,      // keep-alive target (0 = stop when settled)
  alphaWake:    0.3,   // energy on resize / drag wake-up

  // ─── Per-mode overrides ────────────────────────────────
  hira: { withinDist: 70, charge: -150 },
  kata: { withinDist: 70, charge: -160 },
  cross: { withinDist: 60, crossDist: 60, charge: -175 },

  // ─── Color ────────────────────────────────────────────
  nodeH:        '#d63d3d',
  nodeK:        '#3d7bd6',
  linkVisual:   '#c7c7cc',
  linkOpacity:  0.5,
};
