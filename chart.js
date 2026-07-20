// ─── Chart Module (Gojūon Table) ──────────────────────
if (document.getElementById('chartWrap')) {
  (function () {
    var RL = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'];
    function se(ri, ci) { return (ri === 7 && (ci === 1 || ci === 3)) || (ri === 9 && ci >= 1 && ci <= 3) }

    var S = [
      [['あ', 'ア', 'a', '安', '阿'], ['い', 'イ', 'i', '以', '伊'], ['う', 'ウ', 'u', '宇', '宇'], ['え', 'エ', 'e', '衣', '江'], ['お', 'オ', 'o', '於', '於']],
      [['か', 'カ', 'ka', '加', '加'], ['き', 'キ', 'ki', '幾', '幾'], ['く', 'ク', 'ku', '久', '久'], ['け', 'ケ', 'ke', '計', '計'], ['こ', 'コ', 'ko', '己', '己']],
      [['さ', 'サ', 'sa', '左', '散'], ['し', 'シ', 'shi', '之', '之'], ['す', 'ス', 'su', '寸', '須'], ['せ', 'セ', 'se', '世', '世'], ['そ', 'ソ', 'so', '曾', '曾']],
      [['た', 'タ', 'ta', '太', '多'], ['ち', 'チ', 'chi', '知', '知'], ['つ', 'ツ', 'tsu', '川', '川'], ['て', 'テ', 'te', '天', '天'], ['と', 'ト', 'to', '止', '止']],
      [['な', 'ナ', 'na', '奈', '奈'], ['に', 'ニ', 'ni', '仁', '二'], ['ぬ', 'ヌ', 'nu', '奴', '奴'], ['ね', 'ネ', 'ne', '祢', '祢'], ['の', 'ノ', 'no', '乃', '乃']],
      [['は', 'ハ', 'ha', '波', '八'], ['ひ', 'ヒ', 'hi', '比', '比'], ['ふ', 'フ', 'fu', '不', '不'], ['へ', 'ヘ', 'he', '部', '部'], ['ほ', 'ホ', 'ho', '保', '保']],
      [['ま', 'マ', 'ma', '末', '万'], ['み', 'ミ', 'mi', '美', '三'], ['む', 'ム', 'mu', '武', '牟'], ['め', 'メ', 'me', '女', '女'], ['も', 'モ', 'mo', '毛', '毛']],
      [['や', 'ヤ', 'ya', '也', '也'], null, ['ゆ', 'ユ', 'yu', '由', '由'], null, ['よ', 'ヨ', 'yo', '与', '与']],
      [['ら', 'ラ', 'ra', '良', '良'], ['り', 'リ', 'ri', '利', '利'], ['る', 'ル', 'ru', '留', '流'], ['れ', 'レ', 're', '礼', '礼'], ['ろ', 'ロ', 'ro', '呂', '呂']],
      [['わ', 'ワ', 'wa', '和', '和'], null, null, null, ['を', 'ヲ', 'wo', '遠', '乎']]
    ];

    var BA = [['ば', 'バ', 'ba', '波', '八'], ['び', 'ビ', 'bi', '比', '比'], ['ぶ', 'ブ', 'bu', '不', '不'], ['べ', 'ベ', 'be', '部', '部'], ['ぼ', 'ボ', 'bo', '保', '保']];
    var PA = [['ぱ', 'パ', 'pa', '波', '八'], ['ぴ', 'ピ', 'pi', '比', '比'], ['ぷ', 'プ', 'pu', '不', '不'], ['ぺ', 'ペ', 'pe', '部', '部'], ['ぽ', 'ポ', 'po', '保', '保']];
    var isPA = false;

    var D = {
      1: [['が', 'ガ', 'ga', '加', '加'], ['ぎ', 'ギ', 'gi', '幾', '幾'], ['ぐ', 'グ', 'gu', '久', '久'], ['げ', 'ゲ', 'ge', '計', '計'], ['ご', 'ゴ', 'go', '己', '己']],
      2: [['ざ', 'ザ', 'za', '左', '散'], ['じ', 'ジ', 'ji', '之', '之'], ['ず', 'ズ', 'zu', '寸', '須'], ['ぜ', 'ゼ', 'ze', '世', '世'], ['ぞ', 'ゾ', 'zo', '曾', '曾']],
      3: [['だ', 'ダ', 'da', '太', '多'], ['ぢ', 'ヂ', 'ji', '知', '知'], ['づ', 'ヅ', 'zu', '川', '川'], ['で', 'デ', 'de', '天', '天'], ['ど', 'ド', 'do', '止', '止']]
    };

    var Y = {
      1: { b: ['き', 'キ', 'ki', '幾', '幾'], y: ['きゃ', 'キャ', 'kya'], u: ['きゅ', 'キュ', 'kyu'], o: ['きょ', 'キョ', 'kyo'] },
      2: { b: ['し', 'シ', 'shi', '之', '之'], y: ['しゃ', 'シャ', 'sha'], u: ['しゅ', 'シュ', 'shu'], o: ['しょ', 'ショ', 'sho'] },
      3: { b: ['ち', 'チ', 'chi', '知', '知'], y: ['ちゃ', 'チャ', 'cha'], u: ['ちゅ', 'チュ', 'chu'], o: ['ちょ', 'チョ', 'cho'] },
      4: { b: ['に', 'ニ', 'ni', '仁', '二'], y: ['にゃ', 'ニャ', 'nya'], u: ['にゅ', 'ニュ', 'nyu'], o: ['にょ', 'ニョ', 'nyo'] },
      5: { b: ['ひ', 'ヒ', 'hi', '比', '比'], y: ['ひゃ', 'ヒャ', 'hya'], u: ['ひゅ', 'ヒュ', 'hyu'], o: ['ひょ', 'ヒョ', 'hyo'] },
      6: { b: ['み', 'ミ', 'mi', '美', '三'], y: ['みゃ', 'ミャ', 'mya'], u: ['みゅ', 'ミュ', 'myu'], o: ['みょ', 'ミョ', 'myo'] },
      8: { b: ['り', 'リ', 'ri', '利', '利'], y: ['りゃ', 'リャ', 'rya'], u: ['りゅ', 'リュ', 'ryu'], o: ['りょ', 'リョ', 'ryo'] }
    };

    var K = {
      1: [['っか', 'ッカ', 'kka'], ['っき', 'ッキ', 'kki'], ['っく', 'ック', 'kku'], ['っけ', 'ッケ', 'kke'], ['っこ', 'ッコ', 'kko']],
      2: [['っさ', 'ッサ', 'ssa'], ['っし', 'ッシ', 'sshi'], ['っす', 'ッス', 'ssu'], ['っせ', 'ッセ', 'sse'], ['っそ', 'ッソ', 'sso']],
      3: [['った', 'ッタ', 'tta'], ['っち', 'ッチ', 'tchi'], ['っつ', 'ッツ', 'ttsu'], ['って', 'ッテ', 'tte'], ['っと', 'ット', 'tto']],
      5: [['っぱ', 'ッパ', 'ppa'], ['っぴ', 'ッピ', 'ppi'], ['っぷ', 'ップ', 'ppu'], ['っぺ', 'ッペ', 'ppe'], ['っぽ', 'ッポ', 'ppo']]
    };

    var mode = 'seion';
    var ce = [], rh = [], ch = [];
    var gridEl;

    function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e }

    function buildGrid() {
      var g = el('div', 'kana-grid cols-5');
      gridEl = g;
      g.appendChild(el('div', 'col-header'));
      for (var ci = 0; ci < 5; ci++) { ch[ci] = el('div', 'col-header'); g.appendChild(ch[ci]) }
      for (var ri = 0; ri < 10; ri++) {
        rh[ri] = el('div', 'row-header'); g.appendChild(rh[ri]);
        ce[ri] = [];
        for (var ci = 0; ci < 5; ci++) { ce[ri][ci] = el('div', 'cell'); g.appendChild(ce[ri][ci]) }
      }
      rh[10] = el('div', 'row-header'); g.appendChild(rh[10]);
      ce[10] = []; ce[10][0] = el('div', 'cell n-cell'); g.appendChild(ce[10][0]);
      return g;
    }

    function fillN(c, d) {
      var p = el('div', 'kana-pair'); p.appendChild(el('span', 'hira', d[0])); p.appendChild(el('span', 'kata', d[1])); c.appendChild(p);
      c.appendChild(el('span', 'sub', d[2]));
    }



    function updateCell(ri, ci) {
      if (!ce[ri] || !ce[ri][ci]) return;
      var c = ce[ri][ci]; c.innerHTML = ''; c.className = 'cell';
      if (ri === 10) { if (ci === 0) { c.classList.add('n-cell'); fillN(c, ['ん', 'ン', 'n']) } return }
      if (se(ri, ci)) { c.classList.add('empty'); return }

      if (mode === 'seion') {
        var d = S[ri][ci];
        if (d) { fillN(c, d) } else c.classList.add('empty');
      } else if (mode === 'dakuon') {
        if (!D[ri] && ri !== 5) { c.classList.add('vacant'); return }
        if (ri === 5) { fillN(c, (isPA ? PA : BA)[ci]); return }
        var d = D[ri][ci];
        if (Array.isArray(d)) fillN(c, d); else c.classList.add('vacant');
      } else if (mode === 'yoon') {
        if (!Y[ri]) { c.classList.add('vacant'); return }
        var yd = Y[ri];
        if (ci === 0) { c.classList.add('ycell'); fillN(c, yd.y) } else if (ci === 1) { c.classList.add('ghost'); fillN(c, yd.b) } else if (ci === 2) { c.classList.add('ycell'); fillN(c, yd.u) } else if (ci === 3) { c.classList.add('vacant') } else { c.classList.add('ycell'); fillN(c, yd.o) }
      } else if (mode === 'sokuon') {
        if (!K[ri]) { c.classList.add('vacant'); return }
        var d = K[ri][ci];
        if (d) { c.classList.add('sokuon'); fillN(c, d) } else c.classList.add('vacant');
      }
    }

    function updateHeaders() {
      var v = ['あ', 'い', 'う', 'え', 'お'];
      if (mode === 'yoon') {
        var h2 = ['や', '', 'ゆ', '', 'よ'];
        for (var ci = 0; ci < 5; ci++) { ch[ci].innerHTML = '<span class="col-hint">' + h2[ci] + '</span>'; ch[ci].className = 'col-header yoon' }
      } else { for (var ci = 0; ci < 5; ci++) { ch[ci].innerHTML = v[ci]; ch[ci].className = 'col-header' } }
      for (var ri = 0; ri < 10; ri++) {
        rh[ri].className = 'row-header';
        if (mode === 'dakuon') {
          if (ri === 1) { rh[ri].innerHTML = 'が' } else if (ri === 2) { rh[ri].innerHTML = 'ざ' } else if (ri === 3) { rh[ri].innerHTML = 'だ' }
          else if (ri === 5) { rh[ri].innerHTML = '<span class="ba' + (isPA ? '' : ' active') + '">ば</span><span class="bp-sep">/</span><span class="pa' + (isPA ? ' active' : '') + '">ぱ</span>'; rh[ri].classList.add('toggle-rh'); rh[ri].classList.toggle('is-pa',isPA) }
          else { rh[ri].innerHTML = RL[ri]; rh[ri].classList.add('dimmed') }
        } else if (mode === 'yoon') {
          rh[ri].innerHTML = RL[ri]; if (!Y[ri]) rh[ri].classList.add('dimmed');
        } else if (mode === 'sokuon') {
          rh[ri].innerHTML = RL[ri]; if (!K[ri]) rh[ri].classList.add('dimmed');
        } else {
          rh[ri].innerHTML = RL[ri];
        }
      }
      rh[10].innerHTML = 'ん'; rh[10].className = 'row-header';
    }

    function updateAll() {
      updateHeaders();
      for (var ri = 0; ri < 11; ri++)for (var ci = 0; ci < 5; ci++)updateCell(ri, ci);
    }

    var w = document.getElementById('chartWrap');
    w.insertBefore(buildGrid(), w.querySelector('.chart-footer'));
    updateAll();

    document.querySelector('.mode-btn[data-mode="seion"]').classList.add('active');

    document.querySelectorAll('.mode-btn[data-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = btn.dataset.mode;
        if (m === mode) return;
        document.querySelectorAll('.mode-btn[data-mode]').forEach(function (b) { b.classList.remove('active') });
        btn.classList.add('active');
        mode = m;
        updateAll();
      });
    });

    gridEl.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== gridEl) {
        if (t.classList && t.classList.contains('toggle-rh')) { isPA = !isPA; updateAll(); return }
        t = t.parentElement;
      }
    });
  })();
}

