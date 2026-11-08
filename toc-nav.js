(function () {
  var toc = document.querySelector(".toc-sticky");
  var stickyLinks = document.querySelectorAll('.toc-sticky a[href^="#"]');
  var folds = document.querySelectorAll("details.fold");
  var ids = [];
  var sections = [];
  stickyLinks.forEach(function (a) {
    var id = (a.getAttribute("href") || "").slice(1);
    var el = id ? document.getElementById(id) : null;
    if (!el) return;
    ids.push(id);
    sections.push(el);
  });
  var locking = false;
  var clickLock = false;
  var clickTimer = 0;

  function pad() {
    if (!toc) return;
    document.documentElement.style.setProperty("--toc-h", toc.offsetHeight + 16 + "px");
  }

  function mark(id) {
    stickyLinks.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-on", on);
      if (on) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
    sections.forEach(function (el) {
      el.classList.toggle("is-here", el.id === id);
    });
  }

  function closeFolds(keep) {
    locking = true;
    folds.forEach(function (d) {
      if (d !== keep) d.removeAttribute("open");
    });
    locking = false;
  }

  function go(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var isFold = el.tagName === "DETAILS";
    closeFolds(isFold ? el : null);
    if (isFold) el.setAttribute("open", "");
    mark(id);
    pad();
    clickLock = true;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(function () { clickLock = false; }, 500);
    el.scrollIntoView({ block: "start" });
  }

  function spy() {
    if (clickLock || !toc) return;
    var cutoff = toc.getBoundingClientRect().bottom + 10;
    var pick = ids[0];
    sections.forEach(function (el) {
      if (el.getBoundingClientRect().top <= cutoff) pick = el.id;
    });
    if (pick) mark(pick);
  }

  var topBtn = document.querySelector(".to-top");
  function showTop() {
    if (!topBtn) return;
    topBtn.classList.toggle("is-show", window.scrollY > 280);
  }
  if (topBtn) {
    topBtn.addEventListener("click", function () {
      closeFolds(null);
      mark("map");
      if (history.replaceState) history.replaceState(null, "", "#map");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  pad();
  window.addEventListener("resize", function () {
    pad();
    spy();
  });
  window.addEventListener("scroll", function () {
    spy();
    showTop();
  }, { passive: true });
  showTop();

  folds.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (locking || !d.open) return;
      closeFolds(d);
      if (d.id) mark(d.id);
    });
  });

  stickyLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = (a.getAttribute("href") || "").slice(1);
      if (!id) return;
      e.preventDefault();
      a.classList.add("is-press");
      setTimeout(function () { a.classList.remove("is-press"); }, 160);
      if (history.replaceState) history.replaceState(null, "", "#" + id);
      go(id);
    });
  });

  if (location.hash) go(location.hash.slice(1));
  else {
    closeFolds(null);
    mark("map");
  }
  spy();
})();
