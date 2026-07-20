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
