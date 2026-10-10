(function () {
  var KEY = "tsdd-feature-view-v1";
  var body = document.body;
  var buttons = Array.prototype.slice.call(
    document.querySelectorAll(".doc-view-switch [data-view]")
  );
  if (!buttons.length) return;

  function apply(mode) {
    var next = mode === "simple" ? "simple" : "pro";
    body.classList.remove("view-pro", "view-simple");
    body.classList.add("view-" + next);
    buttons.forEach(function (btn) {
      var on = btn.getAttribute("data-view") === next;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {}
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      apply(btn.getAttribute("data-view"));
      window.scrollTo(0, 0);
    });
  });

  var saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch (e) {}
  apply(saved === "simple" || saved === "pro" ? saved : "simple");
})();
