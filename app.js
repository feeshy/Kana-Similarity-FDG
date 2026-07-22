if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
var ttsKanaFix = {'は':'ハ','へ':'ヘ'};
var ttsJV = null;

function ttsLoadJV() {
  if (ttsJV) return;
  var vs = speechSynthesis.getVoices();
  if (vs.length) { ttsJV = vs.find(function(v){ return v.lang.startsWith('ja'); }) || true; }
}

if ('speechSynthesis' in window) {
  ttsLoadJV();
  speechSynthesis.addEventListener('voiceschanged', function(){ ttsLoadJV(); });
}

var ttsOn = localStorage.getItem('kana-tts') !== 'off';

var ttsLabels = {
  en: ['TTS', 'Muted'],
  ja: ['発音', 'ミュート'],
  zh: ['发音', '静音']
};

function setTTS(v, showTip) {
  ttsOn = v;
  localStorage.setItem('kana-tts', v ? 'on' : 'off');
  var btn = document.getElementById('ttsBtn');
  if (btn) {
    btn.innerHTML = v
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'
      : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    btn.classList.toggle('active', v);
    btn.classList.toggle('muted', !v);
    if (showTip) {
      var lang = (document.documentElement.lang || 'en').slice(0,2);
      var labels = ttsLabels[lang] || ttsLabels.en;
      var tip = document.getElementById('fontTip');
      tip.textContent = v ? labels[0] : labels[1];
      tip.classList.add('show');
      if (tip._t) clearTimeout(tip._t);
      tip._t = setTimeout(function(){ tip.classList.remove('show'); }, 2000);
    }
  }
}

var ttsBtn = null;

function speakKana(text, el) {
  if (!ttsOn || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  text = ttsKanaFix[text] || text;
  if (el) {
    el.classList.add('speaking');
    if (el._st) clearTimeout(el._st);
    el._st = setTimeout(function(){ el.classList.remove('speaking'); }, text.length * 180 + 300);
  }
  var u = new SpeechSynthesisUtterance(text);
  if (ttsJV && ttsJV !== true) { u.voice = ttsJV; u.lang = ttsJV.lang; }
  else { u.lang = 'ja-JP'; ttsLoadJV(); }
  window.speechSynthesis.speak(u);
}

document.addEventListener('DOMContentLoaded', function(){
  ttsBtn = document.getElementById('ttsBtn');
  if (ttsBtn) {
    setTTS(ttsOn);
    ttsBtn.addEventListener('click', function(){ setTTS(!ttsOn, true); });
  }
});

(function(){
  var saved = localStorage.getItem('kana-font') || 'connected';
  document.querySelectorAll('.font-a-btn').forEach(function(btn){
    if (btn.dataset.font === saved) {
      btn.classList.add('active');
      if (saved === 'disconnected') document.body.classList.add('font-disconnected');
    }
    btn.addEventListener('click', function(){
      document.querySelectorAll('.font-a-btn').forEach(function(b){ b.classList.remove('active'); });
      this.classList.add('active');
      var f = this.dataset.font;
      document.body.classList.toggle('font-disconnected', f === 'disconnected');
      localStorage.setItem('kana-font', f);
      var tip = document.getElementById('fontTip');
      tip.textContent = f === 'connected' ? 'Zen Kaku Gothic New' : 'Klee One';
      tip.classList.add('show');
      if (tip._t) clearTimeout(tip._t);
      tip._t = setTimeout(function(){ tip.classList.remove('show'); }, 2000);
    });
  });
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .catch(err => console.error('SW registration failed:', err));
  });
}
