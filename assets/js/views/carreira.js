(() => {
  const { ordinal, slug } = App.utils;
  const { FAMILIAS, PERIODOS } = App.data;
  const { discById, careerById } = App.catalog;
  const { discTag, areaChip } = App.ui;

  function timelineRow(p, discs) {
    const inP = discs.filter((d) => d.periodo === p.n);
    return `
      <div class="tl-row">
        <button class="mini-key ${inP.length ? "is-lit" : "is-empty"}" data-open-view="periodo:${p.n}" aria-label="Abrir ${ordinal(p.n)} período">${p.n}</button>
        <div class="tl-items">${inP.length ? inP.map((d) => discTag(d)).join("") : `<span class="tl-empty">Nenhuma disciplina específica, mas a formação geral continua.</span>`}</div>
      </div>`;
  }

  function render(id) {
    const c = careerById[id];
    const f = FAMILIAS[c.familia];
    App.path.set(id);
    const discs = c.disciplinas.map((d) => discById[d]);
    const opt = discs.filter((d) => d.periodo === null);
    const areas = [...new Set(discs.map((d) => d.area))];
    return {
      html: `
        <div class="view-head">
          <p class="eyebrow" style="color:${f.cor}">${f.nome}</p>
          <h3>${c.nome}</h3>
          <p>${c.desc}</p>
          <div class="stats">
            <span class="stat">${discs.length - opt.length} obrigatórias</span>
            <span class="stat">${opt.length} ${opt.length === 1 ? "optativa sugerida" : "optativas sugeridas"}</span>
            ${c.ppc ? `<span class="stat">citada no PPC</span>` : ""}
          </div>
        </div>
        ${c.nota ? `<p class="note">${c.nota}</p>` : ""}
        <div>
          <p class="block-title">A trilha no curso, período a período</p>
          <div class="timeline">${PERIODOS.map((p) => timelineRow(p, discs)).join("")}</div>
        </div>
        ${opt.length ? `
          <div>
            <p class="block-title">Optativas que reforçam esse caminho</p>
            <div class="tl-items" style="padding-top:0">${opt.map((d) => discTag(d)).join("")}</div>
          </div>` : ""}
        <div>
          <p class="block-title">Áreas envolvidas</p>
          <div class="chips">${areas.map(areaChip).join("")}</div>
        </div>
        <div class="pager">
          <button class="btn" data-open-view="carreiras">← Todas as carreiras</button>
          <button class="btn btn--accent" data-close>Ver no tabuleiro</button>
        </div>`,
    };
  }

  App.views.carreira = {
    info: (id) => ({
      title: careerById[id].nome,
      icon: "★",
      path: [{ label: "carreiras", view: "carreiras" }, { label: slug(careerById[id].nome) }],
    }),
    render,
  };
})();
