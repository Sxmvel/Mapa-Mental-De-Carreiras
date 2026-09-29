(() => {
  const { ordinal } = App.utils;
  const { PERIODOS } = App.data;
  const { optativas, ofPeriod, periodHours, topCareersFor } = App.catalog;
  const { careerChip, discCard } = App.ui;

  function optativaCard(nome) {
    return `
      <details class="disc" style="--area:var(--border-strong)">
        <summary><span class="disc-name">${nome}</span><span class="disc-meta">64 h</span></summary>
        <div class="disc-body">
          <p>Você escolhe uma entre ${optativas.length} optativas. É aqui que dá para puxar o curso para a carreira que você quer.</p>
          <p><button class="btn" data-open-view="optativas">Ver todas as optativas</button></p>
        </div>
      </details>`;
  }

  function pager(n) {
    const prev = n > 1
      ? `<button class="btn" data-open-view="periodo:${n - 1}">← ${ordinal(n - 1)} período</button>`
      : `<button class="btn" data-open-view="inicio">← Início</button>`;
    const next = n < 8
      ? `<button class="btn btn--accent" data-open-view="periodo:${n + 1}">${ordinal(n + 1)} período →</button>`
      : `<button class="btn btn--accent" data-open-view="carreiras">Ver carreiras →</button>`;
    return `<div class="pager">${prev}${next}</div>`;
  }

  function render(arg) {
    const n = Number(arg);
    const p = PERIODOS[n - 1];
    const discs = ofPeriod(n);
    const top = topCareersFor(discs, 8);
    return {
      html: `
        <div class="view-head">
          <p class="eyebrow">${ordinal(n)} período</p>
          <h3>${p.titulo}</h3>
          <p>${p.resumo}</p>
          <div class="stats">
            <span class="stat">${periodHours(n)} h</span>
            <span class="stat">${discs.length} obrigatórias</span>
            ${p.optativa ? `<span class="stat">+ ${p.optativa}</span>` : ""}
          </div>
        </div>
        <div>
          <p class="block-title">Disciplinas: clique para ver o que se estuda</p>
          <div class="stack">
            ${discs.map(discCard).join("")}
            ${p.optativa ? optativaCard(p.optativa) : ""}
          </div>
        </div>
        ${n >= 2 && n <= 6 ? `<p class="note"><strong>Projeto Integrador:</strong> neste período há um projeto interdisciplinar que junta as disciplinas do semestre, de preferência resolvendo um problema real de Ouro Branco e da região.</p>` : ""}
        ${n === 7 ? `<p class="note"><strong>TCC:</strong> começa aqui, individual e com orientação de um professor. Termina no 8º período com artigo ou monografia.</p>` : ""}
        <div>
          <p class="block-title">Carreiras que este período mais alimenta</p>
          <div class="chips">${top.map(careerChip).join("")}</div>
        </div>
        ${pager(n)}`,
    };
  }

  App.views.periodo = {
    info: (n) => ({
      title: `${ordinal(n)} período`,
      icon: n,
      path: [{ label: "periodos" }, { label: `${n}-periodo` }],
    }),
    render,
  };
})();
