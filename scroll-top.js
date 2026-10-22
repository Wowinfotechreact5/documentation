// Always start a new page at the top (footer Previous/Next, sidebar links, etc.)
(function () {
  if (window.__wowScrollTopInit) return;
  window.__wowScrollTopInit = true;

  try { history.scrollRestoration = "manual"; } catch (e) {}

  var lastPath = location.pathname;

  function resetScroll() {
    window.scrollTo(0, 0);
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Also reset any scrollable page containers
    ["#content-area", "#body-content", "#content", "main"].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el && el.scrollTop) el.scrollTop = 0;
    });
  }

  function burst() {
    // Repeat for ~1s to beat any scroll restoration after the new page renders
    var times = [0, 50, 100, 200, 350, 500, 750, 1000];
    times.forEach(function (t) { setTimeout(resetScroll, t); });
  }

  function check() {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      if (!location.hash) burst();
    }
  }

  // Detect route changes in three independent ways
  ["pushState", "replaceState"].forEach(function (fn) {
    var orig = history[fn];
    history[fn] = function () {
      var r = orig.apply(this, arguments);
      setTimeout(check, 0);
      return r;
    };
  });
  window.addEventListener("popstate", function () { setTimeout(check, 0); });

  new MutationObserver(check).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-current-path"]
  });

  setInterval(check, 200);

  // Footer pagination click: scroll up after navigation
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("#pagination a, .pagination-prev, .pagination-next, a[class*='pagination']");
    if (a) burst();
  }, true);
})();
