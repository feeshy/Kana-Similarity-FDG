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


// ─── FDG Module (Force-Directed Graph) ────────────────
async function main() {

  // ─── Data ────────────────────────────────────────────────
  const HIRAGANA = [
    { id: 'h-a', kana: 'あ', romaji: 'a', origin: '安' }, { id: 'h-i', kana: 'い', romaji: 'i', origin: '以' },
    { id: 'h-u', kana: 'う', romaji: 'u', origin: '宇' }, { id: 'h-e', kana: 'え', romaji: 'e', origin: '衣' },
    { id: 'h-o', kana: 'お', romaji: 'o', origin: '於' }, { id: 'h-ka', kana: 'か', romaji: 'ka', origin: '加' },
    { id: 'h-ki', kana: 'き', romaji: 'ki', origin: '幾' }, { id: 'h-ku', kana: 'く', romaji: 'ku', origin: '久' },
    { id: 'h-ke', kana: 'け', romaji: 'ke', origin: '計' }, { id: 'h-ko', kana: 'こ', romaji: 'ko', origin: '己' },
    { id: 'h-sa', kana: 'さ', romaji: 'sa', origin: '左' }, { id: 'h-shi', kana: 'し', romaji: 'shi', origin: '之' },
    { id: 'h-su', kana: 'す', romaji: 'su', origin: '寸' }, { id: 'h-se', kana: 'せ', romaji: 'se', origin: '世' },
    { id: 'h-so', kana: 'そ', romaji: 'so', origin: '曾' }, { id: 'h-ta', kana: 'た', romaji: 'ta', origin: '太' },
    { id: 'h-chi', kana: 'ち', romaji: 'chi', origin: '知' }, { id: 'h-tsu', kana: 'つ', romaji: 'tsu', origin: '川' },
    { id: 'h-te', kana: 'て', romaji: 'te', origin: '天' }, { id: 'h-to', kana: 'と', romaji: 'to', origin: '止' },
    { id: 'h-na', kana: 'な', romaji: 'na', origin: '奈' }, { id: 'h-ni', kana: 'に', romaji: 'ni', origin: '仁' },
    { id: 'h-nu', kana: 'ぬ', romaji: 'nu', origin: '奴' }, { id: 'h-ne', kana: 'ね', romaji: 'ne', origin: '祢' },
    { id: 'h-no', kana: 'の', romaji: 'no', origin: '乃' }, { id: 'h-ha', kana: 'は', romaji: 'ha', origin: '波' },
    { id: 'h-hi', kana: 'ひ', romaji: 'hi', origin: '比' }, { id: 'h-fu', kana: 'ふ', romaji: 'fu', origin: '不' },
    { id: 'h-he', kana: 'へ', romaji: 'he', origin: '部' }, { id: 'h-ho', kana: 'ほ', romaji: 'ho', origin: '保' },
    { id: 'h-ma', kana: 'ま', romaji: 'ma', origin: '末' }, { id: 'h-mi', kana: 'み', romaji: 'mi', origin: '美' },
    { id: 'h-mu', kana: 'む', romaji: 'mu', origin: '武' }, { id: 'h-me', kana: 'め', romaji: 'me', origin: '女' },
    { id: 'h-mo', kana: 'も', romaji: 'mo', origin: '毛' }, { id: 'h-ya', kana: 'や', romaji: 'ya', origin: '也' },
    { id: 'h-yu', kana: 'ゆ', romaji: 'yu', origin: '由' }, { id: 'h-yo', kana: 'よ', romaji: 'yo', origin: '与' },
    { id: 'h-ra', kana: 'ら', romaji: 'ra', origin: '良' }, { id: 'h-ri', kana: 'り', romaji: 'ri', origin: '利' },
    { id: 'h-ru', kana: 'る', romaji: 'ru', origin: '留' }, { id: 'h-re', kana: 'れ', romaji: 're', origin: '礼' },
    { id: 'h-ro', kana: 'ろ', romaji: 'ro', origin: '呂' }, { id: 'h-wa', kana: 'わ', romaji: 'wa', origin: '和' },
    { id: 'h-wo', kana: 'を', romaji: 'wo', origin: '遠' }, { id: 'h-n', kana: 'ん', romaji: 'n', origin: '无' },
  ];
  const KATAKANA = [
    { id: 'k-a', kana: 'ア', romaji: 'a', origin: '阿' }, { id: 'k-i', kana: 'イ', romaji: 'i', origin: '伊' },
    { id: 'k-u', kana: 'ウ', romaji: 'u', origin: '宇' }, { id: 'k-e', kana: 'エ', romaji: 'e', origin: '江' },
    { id: 'k-o', kana: 'オ', romaji: 'o', origin: '於' }, { id: 'k-ka', kana: 'カ', romaji: 'ka', origin: '加' },
    { id: 'k-ki', kana: 'キ', romaji: 'ki', origin: '幾' }, { id: 'k-ku', kana: 'ク', romaji: 'ku', origin: '久' },
    { id: 'k-ke', kana: 'ケ', romaji: 'ke', origin: '計' }, { id: 'k-ko', kana: 'コ', romaji: 'ko', origin: '己' },
    { id: 'k-sa', kana: 'サ', romaji: 'sa', origin: '散' }, { id: 'k-shi', kana: 'シ', romaji: 'shi', origin: '之' },
    { id: 'k-su', kana: 'ス', romaji: 'su', origin: '須' }, { id: 'k-se', kana: 'セ', romaji: 'se', origin: '世' },
    { id: 'k-so', kana: 'ソ', romaji: 'so', origin: '曾' }, { id: 'k-ta', kana: 'タ', romaji: 'ta', origin: '多' },
    { id: 'k-chi', kana: 'チ', romaji: 'chi', origin: '知' }, { id: 'k-tsu', kana: 'ツ', romaji: 'tsu', origin: '川' },
    { id: 'k-te', kana: 'テ', romaji: 'te', origin: '天' }, { id: 'k-to', kana: 'ト', romaji: 'to', origin: '止' },
    { id: 'k-na', kana: 'ナ', romaji: 'na', origin: '奈' }, { id: 'k-ni', kana: 'ニ', romaji: 'ni', origin: '二' },
    { id: 'k-nu', kana: 'ヌ', romaji: 'nu', origin: '奴' }, { id: 'k-ne', kana: 'ネ', romaji: 'ne', origin: '祢' },
    { id: 'k-no', kana: 'ノ', romaji: 'no', origin: '乃' }, { id: 'k-ha', kana: 'ハ', romaji: 'ha', origin: '八' },
    { id: 'k-hi', kana: 'ヒ', romaji: 'hi', origin: '比' }, { id: 'k-fu', kana: 'フ', romaji: 'fu', origin: '不' },
    { id: 'k-he', kana: 'ヘ', romaji: 'he', origin: '部' }, { id: 'k-ho', kana: 'ホ', romaji: 'ho', origin: '保' },
    { id: 'k-ma', kana: 'マ', romaji: 'ma', origin: '万' }, { id: 'k-mi', kana: 'ミ', romaji: 'mi', origin: '三' },
    { id: 'k-mu', kana: 'ム', romaji: 'mu', origin: '牟' }, { id: 'k-me', kana: 'メ', romaji: 'me', origin: '女' },
    { id: 'k-mo', kana: 'モ', romaji: 'mo', origin: '毛' }, { id: 'k-ya', kana: 'ヤ', romaji: 'ya', origin: '也' },
    { id: 'k-yu', kana: 'ユ', romaji: 'yu', origin: '由' }, { id: 'k-yo', kana: 'ヨ', romaji: 'yo', origin: '与' },
    { id: 'k-ra', kana: 'ラ', romaji: 'ra', origin: '良' }, { id: 'k-ri', kana: 'リ', romaji: 'ri', origin: '利' },
    { id: 'k-ru', kana: 'ル', romaji: 'ru', origin: '流' }, { id: 'k-re', kana: 'レ', romaji: 're', origin: '礼' },
    { id: 'k-ro', kana: 'ロ', romaji: 'ro', origin: '呂' }, { id: 'k-wa', kana: 'ワ', romaji: 'wa', origin: '和' },
    { id: 'k-wo', kana: 'ヲ', romaji: 'wo', origin: '乎' }, { id: 'k-n', kana: 'ン', romaji: 'n', origin: '尓' },
  ];

  const allNodes = [...HIRAGANA.map(d => ({ ...d, type: 'hiragana' })),
  ...KATAKANA.map(d => ({ ...d, type: 'katakana' }))];
  const nodeMap = Object.fromEntries(allNodes.map(d => [d.id, d]));

  // kana → ID lookup for matrix parsing
  const kanaToId = {};
  for (const d of HIRAGANA) kanaToId[d.kana] = d.id;
  for (const d of KATAKANA) kanaToId[d.kana] = d.id;

  // ─── Load & parse perceptual distance matrix ────────────
  const csv = await fetch('/assets/data.csv').then(r => r.text());
  const rows = csv.split('\n').map(r => r.split(','));
  const colIds = rows[1].slice(2).map(k => kanaToId[k.trim()]);

  const allRaw = [];  // all pairs [source,target,distance]

  for (let ri = 2; ri < rows.length; ri++) {
    const r = rows[ri], rid = kanaToId[r[1].trim()];
    if (!rid) continue;
    for (let ci = 2; ci < r.length; ci++) {
      const v = r[ci].trim();
      if (!v) continue;
      const cid = colIds[ci - 2];
      if (!cid) continue;
      allRaw.push([rid, cid, parseInt(v)]);
    }
  }

  // build per-mode link sets with independent thresholds
  function mkLS(filter, raw, mode) {
    return raw.filter(([s, t, d]) => {
      const sn = nodeMap[s], tn = nodeMap[t];
      if (!sn || !tn) return false;
      const same = sn.type === tn.type;
      if (mode === 'hira') return same && sn.type === 'hiragana' && d <= (filter.withinDist ?? 99);
      if (mode === 'kata') return same && sn.type === 'katakana' && d <= (filter.withinDist ?? 99);
      // cross: all pairs (within-script + across) within threshold
      if (mode === 'cross') return (same ? d <= (filter.withinDist ?? 99) : d <= (filter.crossDist ?? 99));
      return false;
    }).map(([s, t, d]) => ({ source: s, target: t, dist: d }));
  }

  const hLinks = mkLS(FORCE.hira, allRaw, 'hira');
  const kLinks = mkLS(FORCE.kata, allRaw, 'kata');
  const aLinks = mkLS(FORCE.cross, allRaw, 'cross');

  const visualLinks = [...hLinks, ...kLinks, ...aLinks];

  const aNodeIds = new Set();
  aLinks.forEach(l => { aNodeIds.add(l.source); aNodeIds.add(l.target); });
  const aNodes = allNodes.filter(d => aNodeIds.has(d.id));

  const hNodes = allNodes.filter(d => d.type === 'hiragana');
  const kNodes = allNodes.filter(d => d.type === 'katakana');

  // IDs of nodes with at least one connection (for filtering)
  const hNodeIds = new Set(); hLinks.forEach(l => { hNodeIds.add(l.source); hNodeIds.add(l.target) });
  const kNodeIds = new Set(); kLinks.forEach(l => { kNodeIds.add(l.source); kNodeIds.add(l.target) });

  const romajiToKana = {};
  for (const n of allNodes) {
    if (!romajiToKana[n.romaji]) romajiToKana[n.romaji] = {};
    romajiToKana[n.romaji][n.type] = n;
  }

  // ─── SVG setup ───────────────────────────────────────────
  const svg = d3.select('#graph');
  let width = window.innerWidth;
  let height = window.innerHeight;
  svg.attr('viewBox', [0, 0, width, height]);

  const g = svg.append('g').attr('will-change', 'transform');
  const linkG = g.append('g').attr('class', 'links');
  const nodeG = g.append('g').attr('class', 'nodes');

  // ─── Zoom ────────────────────────────────────────────────
  const zoom = d3.zoom()
    .scaleExtent([FORCE.zoomMin, FORCE.zoomMax])
    .on('zoom', (e) => g.attr('transform', e.transform));
  svg.call(zoom);

  // ─── Deep-cloned data per simulation ─────────────────────
  function makeSimData(nodes) {
    const data = nodes.map(d => ({ ...d, x: undefined, y: undefined, vx: undefined, vy: undefined, fx: undefined, fy: undefined }));
    const map = Object.fromEntries(data.map(d => [d.id, d]));
    return { data, map };
  }
  const { data: hData, map: hMap } = makeSimData(hNodes);
  const { data: kData, map: kMap } = makeSimData(kNodes);
  const { data: aData, map: aMap } = makeSimData(aNodes);

  // ─── Simulation ──────────────────────────────────────────
  function cfg(mode) {
    const ov = FORCE[mode]; // mode-specific overrides (e.g. FORCE.hira)
    if (!ov) return FORCE;
    const m = Object.assign({}, FORCE, ov);
    m.link = Object.assign({}, FORCE.link, ov.link);
    return m;
  }

  function mkLink(ls, c) {
    return d3.forceLink(ls).id(d => d.id)
      .distance(l => l.dist * c.link.distScale)
      .strength(l => c.link.strength / Math.max(1, l.dist / c.link.strengthDiv));
  }
  function mkForces(c) {
    var w = width, h = height;
    return [
      d3.forceManyBody().strength(c.charge),
      d3.forceX(w / 2).strength(c.centering),
      d3.forceY(h / 2).strength(c.centering),
      d3.forceCenter(w / 2, h / 2),
      d3.forceCollide().radius(c.collide)
    ];
  }

  const cH = cfg('hira'); const cK = cfg('kata'); const cX = cfg('cross');

  function assignForces(sim, links, cfg, data) {
    var f = mkForces(cfg);
    sim.force('link', mkLink(links, cfg))
      .force('charge', f[0]).force('x', f[1]).force('y', f[2])
      .force('center', f[3]).force('collide', f[4])
      .alphaDecay(cfg.alphaDecay).alphaTarget(cfg.alphaIdle).nodes(data).stop();
  }

  const simH = d3.forceSimulation(hData);
  assignForces(simH, hLinks, cH, hData);
  const simK = d3.forceSimulation(kData);
  assignForces(simK, kLinks, cK, kData);
  const simA = d3.forceSimulation(aData);
  assignForces(simA, aLinks, cX, aData);

  let activeFilter = localStorage.getItem('kana-filter') || 'cross';

  // ─── Tick ────────────────────────────────────────────────
  function tickDOM(map) {
    linkEls.each(function (l) {
      const sid = l.source.id || l.source;
      const tid = l.target.id || l.target;
      const s = map[sid];
      const t = map[tid];
      if (s && t) d3.select(this).attr('x1', s.x).attr('y1', s.y).attr('x2', t.x).attr('y2', t.y);
    });
    linkLabel.each(function (l) {
      const sid = l.source.id || l.source;
      const tid = l.target.id || l.target;
      const s = map[sid];
      const t = map[tid];
      if (s && t) d3.select(this).attr('x', (s.x + t.x) / 2).attr('y', (s.y + t.y) / 2);
    });
    nodeEls.each(function (d) {
      const nd = map[d.id];
      if (nd) d3.select(this).attr('transform', `translate(${nd.x},${nd.y})`);
    });
  }
  simH.on('tick', () => { if (activeFilter === 'hiragana') tickDOM(hMap); });
  simK.on('tick', () => { if (activeFilter === 'katakana') tickDOM(kMap); });
  simA.on('tick', () => { if (activeFilter === 'cross') tickDOM(aMap); });

  // ─── Draw links ──────────────────────────────────────────
  let linkEls = linkG.selectAll('line')
    .data(visualLinks).join('line')
    .attr('class', 'link')
    .attr('stroke', FORCE.display.linkVisual)
    .attr('opacity', FORCE.display.linkOpacity);

  // link distance labels (hidden by default)
  let linkLabel = linkG.selectAll('.link-label')
    .data(visualLinks).join('text')
    .attr('class', 'link-label')
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .attr('dy', '-.3em')
    .text(l => l.dist != null ? l.dist : '')
    .style('display', 'none');

  // ─── Draw nodes ──────────────────────────────────────────
  const nodeEls = nodeG.selectAll('g')
    .data(allNodes).join('g')
    .attr('class', 'node');

  nodeEls.append('circle')
    .attr('r', FORCE.display.nodeRadius)
    .attr('fill', d => d.type === 'hiragana' ? FORCE.display.nodeH : FORCE.display.nodeK);

  nodeEls.append('text')
    .text(d => d.kana)
    .attr('font-size', FORCE.display.nodeFontSize)
    .attr('dy', '.35em');

  // ─── Drag ────────────────────────────────────────────────
  function getAM() {
    if (activeFilter === 'hiragana') return hMap;
    if (activeFilter === 'katakana') return kMap;
    return aMap;
  }
  const drag = d3.drag()
    .on('start', (e, d) => {
      const a = getAM()[d.id];
      if (a) { a.fx = a.x; a.fy = a.y; }
      const s = activeFilter === 'hiragana' ? simH : activeFilter === 'katakana' ? simK : simA;
      if (!e.active) s.alphaTarget(cfg(activeFilter).alphaWake).restart();
    })
    .on('drag', (e, d) => {
      const a = getAM()[d.id];
      if (a) { a.fx = e.x; a.fy = e.y; }
    })
    .on('end', (e, d) => {
      const a = getAM()[d.id];
      if (a) { a.fx = null; a.fy = null; }
      const s = activeFilter === 'hiragana' ? simH : activeFilter === 'katakana' ? simK : simA;
      if (!e.active) s.alphaTarget(cfg(activeFilter).alphaIdle);
    });
  nodeEls.call(drag);

  // ─── Card ────────────────────────────────────────────────
  const card = d3.select('#infoCard');
  const closeBtn = d3.select('#closeCard');
  const cardKana = d3.select('#cardKana');
  const cardRomaji = d3.select('#cardRomaji');

  let selectedNode = null;

  function showCard(d) {
    selectedNode = d;
    var labels = LABELS || { hira: 'HIRA', kata: 'KATA' };
    const hNode = d.type === 'hiragana' ? d : romajiToKana[d.romaji]?.hiragana;
    const kNode = d.type === 'katakana' ? d : romajiToKana[d.romaji]?.katakana;
    if (hNode && kNode) {
      cardKana.html(
        `<span class="ku"><span class="ku-l">${labels.hira}</span><span class="ku-c">${hNode.kana}</span><span class="ku-o">${hNode.origin}</span></span>` +
        `<span class="ku-r">${d.romaji}</span>` +
        `<span class="ku"><span class="ku-l">${labels.kata}</span><span class="ku-c">${kNode.kana}</span><span class="ku-o">${kNode.origin}</span></span>`);
    } else {
      const label = d.type === 'hiragana' ? labels.hira : labels.kata;
      cardKana.html(
        `<span class="ku"><span class="ku-l">${label}</span><span class="ku-c">${d.kana}</span></span>`);
      cardRomaji.text(d.romaji);
    }
    card.classed('visible', true);
  }

  function hideCard() {
    selectedNode = null;
    linkEls.classed('hl', false).style('opacity', null);
    card.classed('visible', false);
  }

  closeBtn.on('click', hideCard);

  // auto-hide hint
  setTimeout(() => {
    d3.select('#navHint').style('opacity', 0);
  }, 6000);

  nodeEls.on('click', (e, d) => {
    e.stopPropagation();
    if (selectedNode?.id === d.id) { hideCard(); return; }
    showCard(d);
    speakKana(d.kana, d3.select(e.currentTarget).node());
    var nd = getAM()[d.id];
    if (nd) svg.transition().duration(600)
      .call(zoom.transform, d3.zoomIdentity.translate(width / 2 - nd.x, height / 2 - nd.y));
    // highlight connected links with distance-based glow
    linkEls.classed('hl', function(l) {
      var sid = l.source.id || l.source, tid = l.target.id || l.target;
      var on = sid === d.id || tid === d.id;
      if (on) {
        var intensity = Math.max(0, Math.min(1, (HIGHLIGHT.maxDist - l.dist) / HIGHLIGHT.falloff));
        d3.select(this).style('opacity', intensity);
      }
      return on;
    });
  });

  function resetZoom() {
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    linkEls.classed('hl', false);
  }

  svg.on('click', () => { hideCard(); resetZoom() });

  // ─── Filter ──────────────────────────────────────────────
  function showFilter(filter) {
    nodeEls.each(function (d) {
      let show;
      if (filter === 'cross') show = aNodeIds.has(d.id);
      else if (filter === 'hiragana') show = hNodeIds.has(d.id);
      else show = kNodeIds.has(d.id);
      d3.select(this).style('display', show ? null : 'none');
    });
    function linkVisible(l) {
      const sid = l.source.id || l.source;
      const tid = l.target.id || l.target;
      const sn = nodeMap[sid];
      const tn = nodeMap[tid];
      if (filter === 'cross') return sn && tn && aNodeIds.has(sid) && aNodeIds.has(tid);
      return sn && tn && sn.type === filter && tn.type === filter;
    }
    linkEls.each(function (l) {
      d3.select(this).style('display', linkVisible(l) ? null : 'none');
    });
    linkLabel.each(function (l) {
      d3.select(this).style('display', linkVisible(l) && d3.select('#distToggle').classed('on') ? null : 'none');
    });
  }

  function restartSim(filter) {
    simH.stop(); simK.stop(); simA.stop();
    if (filter === 'hiragana') simH.alpha(cfg('hira').alphaWake).restart();
    else if (filter === 'katakana') simK.alpha(cfg('kata').alphaWake).restart();
    else simA.alpha(cfg('cross').alphaWake).restart();
  }

  const filterBtns = d3.selectAll('.filter-btn');
  filterBtns.on('click', (e, d) => {
    const btn = d3.select(e.currentTarget);
    filterBtns.classed('active', false);
    btn.classed('active', true);
    const f = btn.attr('data-filter');
    activeFilter = f;
    showFilter(f);
    restartSim(f);
    if (selectedNode) {
      const hide = f === 'cross' ? !aNodeIds.has(selectedNode.id)
        : f === 'hiragana' ? !hNodeIds.has(selectedNode.id)
          : !kNodeIds.has(selectedNode.id);
      if (hide) hideCard();
    }
    resetZoom();
    localStorage.setItem('kana-filter', f);
    var tip = document.getElementById('fontTip');
    tip.textContent = btn.attr('data-label');
    tip.classList.add('show');
    if (tip._t) clearTimeout(tip._t);
    tip._t = setTimeout(function(){ tip.classList.remove('show'); }, 2000);
  });

  function showTooltip() {
    var info = d3.select('#distInfo');
    info.classed('visible', true);
    if (info._hideTimer) clearTimeout(info._hideTimer);
    info._hideTimer = setTimeout(function(){ info.classed('visible', false); }, 5000);
  }

  // dist toggle
  d3.select('#distToggle').on('click', function () {
    var btn = d3.select(this);
    var on = btn.classed('on');
    btn.classed('on', !on);
    showFilter(activeFilter);
    localStorage.setItem('kana-dist-label', !on ? 'on' : 'off');
    showTooltip();
  });

  if (localStorage.getItem('kana-dist-label') === 'on') {
    d3.select('#distToggle').classed('on', true);
  }
  filterBtns.classed('active', false);
  filterBtns.filter(`[data-filter="${activeFilter}"]`).classed('active', true);
  restartSim(activeFilter);
  showFilter(activeFilter);

  // ─── Resize ──────────────────────────────────────────────
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    svg.attr('viewBox', [0, 0, width, height]);
    [[simH, cH], [simK, cK], [simA, cX]].forEach(([s, c]) => {
      s.force('x').x(width / 2); s.force('y').y(height / 2);
      s.force('center', d3.forceCenter(width / 2, height / 2)).alpha(c.alphaWake).restart();
    });
  });

  // ─── Distance slider ─────────────────────────────────────
  var slider = document.getElementById('distSlider');
  var sliderVal = document.getElementById('distSliderVal');

  function rebuildGraph(threshold) {
    FORCE.hira.withinDist = threshold;
    FORCE.kata.withinDist = threshold;
    FORCE.cross.withinDist = threshold;
    FORCE.cross.crossDist = threshold;

    var charge = -(threshold * SLIDER.chargeA - SLIDER.chargeB);
    FORCE.hira.charge = charge;
    FORCE.kata.charge = charge;
    FORCE.cross.charge = charge;

    simH.stop(); simK.stop(); simA.stop();

    hLinks.splice(0, hLinks.length, ...mkLS(FORCE.hira, allRaw, 'hira'));
    kLinks.splice(0, kLinks.length, ...mkLS(FORCE.kata, allRaw, 'kata'));
    aLinks.splice(0, aLinks.length, ...mkLS(FORCE.cross, allRaw, 'cross'));
    visualLinks.splice(0, visualLinks.length, ...hLinks, ...kLinks, ...aLinks);

    aNodeIds.clear(); hNodeIds.clear(); kNodeIds.clear();
    aLinks.forEach(l => { aNodeIds.add(l.source); aNodeIds.add(l.target); });
    hLinks.forEach(l => { hNodeIds.add(l.source); hNodeIds.add(l.target); });
    kLinks.forEach(l => { kNodeIds.add(l.source); kNodeIds.add(l.target); });

    var newANodes = allNodes.filter(function(d){ return aNodeIds.has(d.id); });
    var oldAMap = Object.fromEntries(aData.map(function(d){ return [d.id, d]; }));
    aData.splice(0, aData.length, ...newANodes.map(function(d){
      return       oldAMap[d.id] || { ...d, x: width/2 + (Math.random()-0.5)*FORCE.nodeSpread, y: height/2 + (Math.random()-0.5)*FORCE.nodeSpread, vx: 0, vy: 0, fx: undefined, fy: undefined };
    }));
    for (var k in aMap) delete aMap[k];
    aData.forEach(function(d){ aMap[d.id] = d; });

    var linkKey = function(d){ return d.source + '-' + d.target; };
    linkEls = linkG.selectAll('line')
      .data(visualLinks, linkKey).join('line')
      .attr('class', 'link').attr('stroke', FORCE.display.linkVisual).attr('opacity', FORCE.display.linkOpacity);
    linkLabel = linkG.selectAll('.link-label')
      .data(visualLinks, linkKey).join('text')
      .attr('class', 'link-label').attr('font-size', 12).attr('text-anchor', 'middle').attr('dy', '-.3em')
      .text(function(l){ return l.dist != null ? l.dist : ''; }).style('display', 'none');

    simH.nodes(hData);
    simH.force('link', mkLink(hLinks, cH));
    simH.force('charge').strength(charge);
    simK.nodes(kData);
    simK.force('link', mkLink(kLinks, cK));
    simK.force('charge').strength(charge);
    simA.nodes(aData);
    simA.force('link', mkLink(aLinks, cX));
    simA.force('charge').strength(charge);

    showFilter(activeFilter);
    restartSim(activeFilter);
  }

  if (slider) {
    var savedT = localStorage.getItem('kana-threshold');
    if (savedT) slider.value = savedT;
    var t0 = parseInt(slider.value);
    sliderVal.textContent = t0;
    rebuildGraph(t0);
    slider.addEventListener('input', function () {
      var t = parseInt(this.value);
      sliderVal.textContent = t;
      rebuildGraph(t);
      localStorage.setItem('kana-threshold', t);
      showTooltip();
    });
  }
}


// ─── PWA Service Worker Registration ────────────────
if (typeof main === 'function' && document.getElementById('graph')) {
  main().catch(e => { document.body.textContent = 'Error: ' + e.message; });
}