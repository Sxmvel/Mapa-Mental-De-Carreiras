(() => {
  const { $, ordinal, slug } = App.utils;
  const { AREAS, DISCIPLINAS } = App.data;
  const { topCareersFor } = App.catalog;
  const { careerChip, discTag } = App.ui;

  const tagList = (items) => `<div class="tl-items" style="padding-top:0;min-height:0">${items.join("")}</div>`;

  function areaBlock(aid, a, focus) {
    const discs = DISCIPLINAS.filter((d) => d.area === aid);
    const obr = discs.filter((d) => d.periodo).sort((x, y) => x.periodo - y.periodo);
    const opt = discs.filter((d) => !d.periodo);
    const top = topCareersFor(discs, 5);
    return `
      <section class="area-block ${focus === aid ? "is-focus" : ""}" id="area-${aid}" style="--area:${a.cor}">
        <h4>${a.nome}</h4>
        <p>${a.desc}</p>
        ${obr.length ? `<p class="sub">Obrigatórias</p>${tagList(obr.map((d) => discTag(d, ordinal(d.periodo))))}` : ""}
        ${opt.length ? `<p class="sub">Optativas</p>${tagList(opt.map((d) => discTag(d, "")))}` : ""}
        ${top.length ? `<p class="sub">Leva principalmente a</p><div class="chips">${top.map(careerChip).join("")}</div>` : ""}
      </section>`;
  }

  function render(focus) {
    return {
      html: `
        <div class="view-head">
          <p class="eyebrow">Mapa por tema</p>
          <h3>${Object.keys(AREAS).length} áreas, ${DISCIPLINAS.length} disciplinas</h3>
          <p>As disciplinas agrupadas por tema. Ex.: Redes de Computadores, Sistemas Operacionais e Sistemas Distribuídos formam a área de infraestrutura.</p>
        </div>
        ${Object.entries(AREAS).map(([aid, a]) => areaBlock(aid, a, focus)).join("")}`,
      after: () => {
        if (focus) $(`#area-${focus}`)?.scrollIntoView({ block: "start" });
      },
    };
  }

  App.views.areas = {
    info: (a) => ({
      title: "Áreas do curso",
      icon: "◧",
      path: [{ label: "areas", view: a ? "areas" : null }, ...(a ? [{ label: slug(AREAS[a].nome) }] : [])],
    }),
    render,
  };
})();
