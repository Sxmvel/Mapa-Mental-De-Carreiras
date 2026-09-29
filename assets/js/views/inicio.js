(() => {
  const { CURSO, EXTRAS } = App.data;

  const COMPOSICAO_CORES = ["var(--accent)", "var(--yellow)", "var(--blue)", "var(--red)"];
  const EIXO_CORES = ["#8A8A80", "#E3478F", "#1D4AFF", "#8D6E45", "#2F9E44", "#F54E00"];

  function render() {
    const total = CURSO.composicao.reduce((s, c) => s + c.horas, 0);
    return {
      html: `
        <div class="view-head">
          <p class="eyebrow">Ponto de partida</p>
          <h3>${CURSO.nome}</h3>
          <p>${CURSO.campus}. O curso usa a computação para resolver problemas de organizações e da sociedade, e mistura programação, dados, infraestrutura e gestão.</p>
        </div>
        <div class="facts">
          <div class="fact"><small>Duração</small><strong>${CURSO.duracao}</strong></div>
          <div class="fact"><small>Turno</small><strong>${CURSO.turno}</strong></div>
          <div class="fact"><small>Modalidade</small><strong>${CURSO.modalidade}</strong></div>
          <div class="fact"><small>Vagas</small><strong>${CURSO.vagas}</strong></div>
          <div class="fact"><small>Carga horária</small><strong>${CURSO.cargaHoraria.toLocaleString("pt-BR")} h</strong></div>
          <div class="fact"><small>Título</small><strong>Bacharel em SI</strong></div>
        </div>
        <div>
          <p class="block-title">Como entrar</p>
          <ul class="list">${CURSO.ingresso.map((i) => `<li>${i}</li>`).join("")}</ul>
          <p class="muted" style="margin-top:8px;font-size:14px">É preciso ter concluído o ensino médio até a matrícula.</p>
        </div>
        <div>
          <p class="block-title">Como as ${total.toLocaleString("pt-BR")} horas se dividem</p>
          <div class="stacked-bar" role="img" aria-label="Divisão da carga horária">
            ${CURSO.composicao.map((c, i) => `<span style="width:${(c.horas / total) * 100}%;background:${COMPOSICAO_CORES[i]}"></span>`).join("")}
          </div>
          <div class="bar-legend">
            ${CURSO.composicao.map((c, i) => `<div><span class="dot" style="--c:${COMPOSICAO_CORES[i]}"></span>${c.nome}<b>${c.horas} h</b></div>`).join("")}
          </div>
        </div>
        <div>
          <p class="block-title">Os 6 eixos de formação do PPC</p>
          <div class="bars">
            ${CURSO.eixos.map((e, i) => `
              <div class="bar-row"><span>${e.nome}</span><b>${e.pct}%</b>
                <div class="track"><span style="width:${e.pct * 3}%;background:${EIXO_CORES[i]}"></span></div>
              </div>`).join("")}
          </div>
        </div>
        <div>
          <p class="block-title">Além das aulas</p>
          <div class="extras">${EXTRAS.map((e) => `<div class="extra"><strong>${e.nome}</strong><span>${e.detalhe}</span></div>`).join("")}</div>
        </div>
        <div class="pager">
          <span></span>
          <button class="btn btn--accent" data-open-view="periodo:1">Começar pelo 1º período →</button>
        </div>`,
    };
  }

  App.views.inicio = {
    info: () => ({ title: "Sobre o curso", icon: "▶", path: [{ label: "sobre-o-curso" }] }),
    render,
  };
})();
