(() => {
  const { $ } = App.utils;
  const { FAMILIAS } = App.data;
  const { careerById } = App.catalog;

  function set(id) {
    App.state.selectedCareer = id;
    const career = id ? careerById[id] : null;
    const color = career ? FAMILIAS[career.familia].cor : "";

    document.documentElement.style.setProperty("--path", color || "var(--accent)");
    App.board.highlight(career);

    $("#pathBanner").hidden = !career;
    if (career) {
      $("#pathName").textContent = career.nome;
      $("#pathDot").style.background = color;
    }
    App.window.renderStatus();
  }

  function init() {
    $("#pathClear").addEventListener("click", () => set(null));
    $("#pathDetails").addEventListener("click", (e) => {
      const id = App.state.selectedCareer;
      if (id) App.window.open(`carreira:${id}`, { trigger: e.currentTarget });
    });
  }

  App.path = { init, set };
})();
