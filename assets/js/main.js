(() => {
  App.board.init();
  App.window.init();
  App.path.init();

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-view]");
    if (opener) {
      App.window.open(opener.dataset.openView, { trigger: opener });
      return;
    }
    if (e.target.closest("[data-close]")) App.window.close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && App.window.isOpen()) {
      App.window.close();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 8) App.window.open(`periodo:${n}`, { trigger: App.board.pressPeriod(n) });
  });
})();
