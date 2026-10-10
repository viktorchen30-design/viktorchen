(function () {
  var PASS = '11223456';

  var css = document.createElement('style');
  css.textContent =
    'html[data-gate="1"] body > *:not(#portfolio-gate){display:none!important}' +
    '#portfolio-gate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;' +
    'background:#f7f9fb;font-family:"Microsoft YaHei","PingFang SC",sans-serif}' +
    '#portfolio-gate .box{width:min(360px,92vw);background:#fff;border:1px solid #d5e2ee;padding:28px 24px}' +
    '#portfolio-gate h1{margin:0 0 8px;font-size:20px;color:#16324f}' +
    '#portfolio-gate p{margin:0 0 16px;color:#5b6573;font-size:14px}' +
    '#portfolio-gate input{width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #d5e2ee;font-size:15px}' +
    '#portfolio-gate button{margin-top:12px;width:100%;padding:10px;border:0;background:#1f4e79;color:#fff;font-size:14px;cursor:pointer}' +
    '#portfolio-gate .err{color:#a33;font-size:13px;margin-top:8px;min-height:18px}';
  document.documentElement.setAttribute('data-gate', '1');
  document.head.appendChild(css);

  function unlock() {
    document.documentElement.removeAttribute('data-gate');
    var el = document.getElementById('portfolio-gate');
    if (el) el.remove();
  }

  function mount() {
    if (document.getElementById('portfolio-gate')) return;
    var wrap = document.createElement('div');
    wrap.id = 'portfolio-gate';
    wrap.innerHTML =
      '<div class="box">' +
      '<h1>Viktor 作品集</h1>' +
      '<p>请输入访问密码</p>' +
      '<input id="portfolio-gate-input" type="password" autocomplete="off" />' +
      '<button type="button" id="portfolio-gate-btn">进入</button>' +
      '<div class="err" id="portfolio-gate-err"></div>' +
      '</div>';
    document.body.appendChild(wrap);
    var input = document.getElementById('portfolio-gate-input');
    var err = document.getElementById('portfolio-gate-err');
    function tryUnlock() {
      if (input.value === PASS) unlock();
      else {
        err.textContent = '密码错误';
        input.select();
      }
    }
    document.getElementById('portfolio-gate-btn').onclick = tryUnlock;
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryUnlock();
    });
    input.focus();
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
