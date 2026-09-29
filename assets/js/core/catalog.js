(() => {
  const { DISCIPLINAS, CARREIRAS, PERIODOS } = App.data;

  const discById = Object.fromEntries(DISCIPLINAS.map((d) => [d.id, d]));
  const careerById = Object.fromEntries(CARREIRAS.map((c) => [c.id, c]));

  const careersByDisc = {};
  for (const c of CARREIRAS) {
    for (const id of c.disciplinas) {
      if (!discById[id]) console.warn(`Disciplina "${id}" não existe (carreira ${c.id})`);
      (careersByDisc[id] ||= []).push(c.id);
    }
  }

  const optativas = DISCIPLINAS.filter((d) => d.periodo === null);
  const ofPeriod = (n) => DISCIPLINAS.filter((d) => d.periodo === n);
  const periodHours = (n) => ofPeriod(n).reduce((s, d) => s + d.ch, 0) + (PERIODOS[n - 1].optativa ? 64 : 0);

  function topCareersFor(discs, limit) {
    const count = {};
    for (const d of discs) for (const c of careersByDisc[d.id] || []) count[c] = (count[c] || 0) + 1;
    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => careerById[id]);
  }

  App.catalog = { discById, careerById, careersByDisc, optativas, ofPeriod, periodHours, topCareersFor };
})();
