(function () {
  function init(root) {
    var track = root.querySelector(".phone-carousel-track");
    var tabs = Array.prototype.slice.call(root.querySelectorAll("[data-go]"));
    var prev = root.querySelector(".phone-carousel-btn.prev");
    var next = root.querySelector(".phone-carousel-btn.next");
    var step = root.querySelector("[data-step]");
    var label = root.querySelector("[data-label]");
    var panels = root.querySelectorAll(".phone-carousel-panel");
    if (!track || !panels.length) return;

    var total = panels.length;
    var index = 0;
    var startX = 0;

    function go(i) {
      index = (i + total) % total;
      track.style.transform = "translateX(" + -index * 100 + "%)";
      if (step) step.textContent = String(index + 1);
      tabs.forEach(function (tab, n) {
        var on = n === index;
        tab.classList.toggle("is-on", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
        if (on && label) label.textContent = tab.textContent.trim();
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        go(Number(tab.getAttribute("data-go")) || 0);
      });
    });
    if (prev) prev.addEventListener("click", function () { go(index - 1); });
    if (next) next.addEventListener("click", function () { go(index + 1); });

    track.addEventListener("touchstart", function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 40) return;
      go(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });

    go(0);
  }

  function initLightbox() {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "截图放大");
    box.innerHTML =
      '<div class="lightbox-inner">' +
      '<button type="button" class="lightbox-close" aria-label="关闭">×</button>' +
      '<img alt="" />' +
      '<p class="lightbox-cap"></p>' +
      "</div>";
    document.body.appendChild(box);

    var img = box.querySelector("img");
    var cap = box.querySelector(".lightbox-cap");
    var closeBtn = box.querySelector(".lightbox-close");

    function close() {
      box.classList.remove("is-open");
      img.removeAttribute("src");
      cap.textContent = "";
      document.body.style.overflow = "";
    }

    function open(src, alt, caption) {
      img.src = src;
      img.alt = alt || "";
      cap.textContent = caption || alt || "";
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || t.tagName !== "IMG" || !t.hasAttribute("data-lightbox")) return;
      e.preventDefault();
      var fig = t.closest("figure");
      var caption = fig && fig.querySelector("figcaption")
        ? fig.querySelector("figcaption").textContent.trim()
        : "";
      open(t.currentSrc || t.src, t.alt, caption);
    });

    closeBtn.addEventListener("click", close);
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target === img) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box.classList.contains("is-open")) close();
    });
  }

  document.querySelectorAll("[data-carousel]").forEach(init);
  initLightbox();
})();
