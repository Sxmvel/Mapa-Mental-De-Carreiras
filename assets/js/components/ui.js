(() => {
  const { AREAS, FAMILIAS } = App.data;
  const { discById, careerById, careersByDisc } = App.catalog;

  const careerChip = (c) =>
    `<button class="chip chip--sm" style="--c:${FAMILIAS[c.familia].cor}" data-open-view="carreira:${c.id}"><span class="dot"></span>${c.nome}</button>`;

  const areaChip = (id) =>
    `<button class="chip chip--sm" style="--c:${AREAS[id].cor}" data-open-view="areas:${id}"><span class="dot"></span>${AREAS[id].nome}</button>`;

  const discTag = (d, suffix = d.periodo ? "" : "optativa") =>
    `<span class="tag" style="--area:${AREAS[d.area].cor}"><span class="dot"></span>${d.nome}${suffix ? ` <small>${suffix}</small>` : ""}</span>`;

  const dotTitle = (color, text) =>
    `<p class="block-title"><span class="dot" style="--c:${color};display:inline-block;margin-right:6px"></span>${text}</p>`;

  function discCard(d) {
    const area = AREAS[d.area];
    const careers = (careersByDisc[d.id] || []).map((id) => careerById[id]);
    const selected = App.state.selectedCareer;
    const inPath = selected && careerById[selected].disciplinas.includes(d.id);
    const prereq = d.prereq ? ` · Pré-requisito: ${discById[d.prereq].nome}` : "";
    return `
      <details class="disc ${inPath ? "is-path" : ""}" style="--area:${area.cor}">
        <summary>
          <span class="disc-name">${d.nome}</span>
          ${inPath ? `<span class="path-tag">no caminho</span>` : ""}
          <span class="disc-meta">${d.ch} h</span>
        </summary>
        <div class="disc-body">
          <p>${d.resumo}</p>
          <p class="meta">Área: <button class="link" data-open-view="areas:${d.area}">${area.nome}</button>${prereq}</p>
          ${careers.length ? `<div><p class="block-title">Leva a</p><div class="chips">${careers.map(careerChip).join("")}</div></div>` : ""}
        </div>
      </details>`;
  }

  App.ui = { careerChip, areaChip, discTag, dotTitle, discCard };
})();
