// ─── Force layout & rendering ──────────────────────────
const FORCE = {
  display: {
    nodeRadius:    22,        // circle radius (px)
    nodeFontSize:  28,        // kana glyph inside circle (px)
    nodeH:        '#d63d3d',  // hiragana circle fill
    nodeK:        '#3d7bd6',  // katakana circle fill
    linkVisual:   '#c7c7cc',  // link colour (when not highlighted)
    linkOpacity:  0.5,        // link opacity (when not highlighted)
  },

  // ─── Link spring ───────────────────────────────────
  link: {
    distScale:   2,       // perceptual-distance → screen-pixel: dist * distScale
    strength:    1.0,     // base attraction = strength / (dist / strengthDiv)
    strengthDiv: 50,      // normalises dist in attraction denominator
  },

  // ─── Forces ────────────────────────────────────────
  centering:    0.025,   // strength of forceX/Y pulling nodes toward viewport centre
  collide:      32,      // collision radius – prevents node overlap
  alphaDecay:   0.01,    // energy lost per tick (lower = sim settles slower)
  alphaIdle:    0,       // target alpha when idle – 0 means sim stops fully
  alphaWake:    0.3,     // energy on resize / filter switch / drag wake-up

  // ─── Interaction ──────────────────────────────────
  zoomMin:      0.2,     // minimum zoom factor (0.2 = zoomed out 5×)
  zoomMax:      6,       // maximum zoom factor (6 = zoomed in 6×)
  nodeSpread:   40,      // random ±px initial position when nodes first appear

  // ─── Per-mode init ────────────────────────────────
  // These are overridden immediately by the slider on 1st load.
  // The values here serve as fallback before the slider JS runs.
  hira: { withinDist: 65, charge: -150 },
  kata: { withinDist: 65, charge: -160 },
  cross: { withinDist: 65, crossDist: 65, charge: -175 },
};

// ─── Distance-slider calibration ──────────────────────
// charge formula: charge = -(threshold * chargeA - chargeB)
const SLIDER = {
  distMin: 50,         // slider minimum (perceptual distance)
  distMax: 80,         // slider maximum
  distDefault: 65,     // initial slider position
  chargeA: 4,          // multiplier  →  charge = -(th × chargeA – chargeB)
  chargeB: 100,        // offset       (negative = repulsion)
  centering: 0.025,    // forceX/Y strength (fixed, independent of threshold)
};

// ─── Node highlight calibration ──────────────────────
// When a node is clicked, connected links glow.
// opacity = max(0, min(1, (maxDist - dist) / falloff))
const HIGHLIGHT = {
  maxDist: 90,     // distances ≥ this get zero glow
  falloff: 50,     // larger = glow fades more gradually with distance
};
