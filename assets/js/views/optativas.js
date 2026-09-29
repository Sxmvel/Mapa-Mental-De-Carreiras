(() => {
  const { AREAS } = App.data;
  const { optativas } = App.catalog;
  const { discCard, dotTitle } = App.ui;

  function render() {
    const byArea = Object.entries(AREAS)
      .map(([aid, a]) => ({ a, list: optativas.filter((d) => d.area === aid) }))
      .filter((g) => g.list.length);
    return {
      html: `
        <div class="view-head">
          <p class="eyebrow">5º ao 8º período</p>
          <h3>${optativas.length} optativas para personalizar o curso</h3>
          <p>São 4 optativas (256 h no total). Escolha pensando na carreira: cada uma mostra os caminhos que reforça.</p>
        </div>
        ${byArea.map((g) => `
          <div>
            ${dotTitle(g.a.cor, g.a.nome)}
            <div class="stack">${g.list.map(discCard).join("")}</div>
          </div>`).join("")}`,
    };
  }

  App.views.optativas = {
    info: () => ({ title: "Optativas", icon: "+", path: [{ label: "optativas" }] }),
    render,
  };
})();
