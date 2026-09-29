(() => {
  const { FAMILIAS, CARREIRAS } = App.data;
  const { dotTitle } = App.ui;

  const careerCard = (c, f) => `
    <button class="career-card" style="--c:${f.cor}" data-open-view="carreira:${c.id}">
      <strong>${c.nome}</strong>
      <span>${c.desc}</span>
      ${c.ppc ? `<span class="ppc-badge">citada no PPC</span>` : ""}
    </button>`;

  function render() {
    const groups = Object.entries(FAMILIAS).map(([fid, f]) => {
      const list = CARREIRAS.filter((c) => c.familia === fid);
      return `
        <div>
          ${dotTitle(f.cor, f.nome)}
          <div class="career-grid">${list.map((c) => careerCard(c, f)).join("")}</div>
        </div>`;
    });
    return {
      html: `
        <div class="view-head">
          <p class="eyebrow">Chegada</p>
          <h3>${CARREIRAS.length} caminhos possíveis</h3>
          <p>Todas as carreiras que o curso prepara. As marcadas como <span class="ppc-badge">citada no PPC</span> aparecem no perfil do egresso; as demais são sustentadas pelas ementas das disciplinas. Escolha uma para ver a trilha e acender o tabuleiro.</p>
        </div>
        ${groups.join("")}`,
    };
  }

  App.views.carreiras = {
    info: () => ({ title: "Carreiras", icon: "★", path: [{ label: "carreiras" }] }),
    render,
  };
})();
