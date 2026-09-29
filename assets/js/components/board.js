(() => {
  const { $, ordinal, yearOf } = App.utils;
  const { PERIODOS } = App.data;
  const { discById } = App.catalog;

  const PLATE = { top: 14, side: 14, bottom: 34 };

  const KEYS = [
    { view: "inicio", kind: "start", num: "▶", label: "Início" },
    ...PERIODOS.map((p) => ({ view: `periodo:${p.n}`, kind: "period", n: p.n, num: String(p.n), label: p.curto })),
    { view: "carreiras", kind: "end", num: "★", label: "Carreiras" },
  ];

  let board, trail, trailLayers, keyEls, yearEls;

  function createKey(k, i) {
    const el = document.createElement("button");
    el.className = `key key--${k.kind}`;
    el.dataset.openView = k.view;
    el.style.setProperty("--i", i);
    if (k.kind === "period") el.style.setProperty("--yc", `var(--y${yearOf(k.n)})`);
    el.setAttribute("aria-label", k.kind === "period" ? `${ordinal(k.n)} período: ${PERIODOS[k.n - 1].titulo}` : k.label);
    el.innerHTML = `<span class="key-top"><span class="key-num">${k.num}</span><span class="key-label">${k.label}</span></span><span class="badge"></span>`;
    board.appendChild(el);
    return el;
  }

  function createYear(y) {
    const el = document.createElement("span");
    el.className = "year";
    el.setAttribute("aria-hidden", "true");
    el.style.setProperty("--yc", `var(--y${y})`);
    el.style.setProperty("--i", 2 * y);
    el.innerHTML = `<span class="dot"></span>${y}º ano`;
    board.appendChild(el);
    return el;
  }

  function layout() {
    const W = board.clientWidth;
    const vertical = W < 760;
    const n = KEYS.length;
    board.classList.toggle("is-vertical", vertical);

    let k;
    if (vertical) {
      k = 70;
      board.style.height = `${n * 94 + 80}px`;
    } else {
      board.style.height = "";
      const pad = Math.max(70, W * 0.07);
      k = Math.round(Math.min(100, Math.max(58, ((W - 2 * pad) / (n - 1)) * 0.84)));
    }
    board.style.setProperty("--k", `${k}px`);
    const H = board.clientHeight;
    const margin = k * 0.62;
    const cy = (PLATE.top + H - PLATE.bottom) / 2;

    const point = (t) => {
      const wave = Math.sin(t * 2 * Math.PI);
      if (vertical) {
        const top = PLATE.top + margin;
        const bottom = H - PLATE.bottom - margin;
        return { x: W / 2 + wave * (W / 2 - PLATE.side - margin), y: top + t * (bottom - top) };
      }
      const pad = Math.max(70, W * 0.07);
      const amp = (H - PLATE.top - PLATE.bottom) / 2 - margin;
      return { x: pad + t * (W - 2 * pad), y: cy - wave * amp };
    };

    const pts = KEYS.map((_, i) => point(i / (n - 1)));
    keyEls.forEach((el, i) => {
      el.style.left = `${pts[i].x}px`;
      el.style.top = `${pts[i].y}px`;
    });

    yearEls.forEach((el, i) => {
      const a = pts[2 * i + 1];
      const b = pts[2 * i + 2];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      if (vertical) mid.x += (mid.x < W / 2 ? 1 : -1) * k * 0.95;
      else mid.y += (mid.y < cy ? 1 : -1) * k * 1.25;
      el.style.left = `${mid.x}px`;
      el.style.top = `${mid.y}px`;
    });

    let d = "";
    const steps = 180;
    for (let s = 0; s <= steps; s++) {
      const p = point(s / steps);
      d += `${s ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }
    trail.setAttribute("viewBox", `0 0 ${W} ${H}`);
    trail.style.setProperty("--groove-w", `${Math.round(k * 0.5)}px`);
    trailLayers.forEach((path) => path.setAttribute("d", d));
  }

  function highlight(career) {
    board.classList.toggle("has-path", Boolean(career));
    KEYS.forEach((k, i) => {
      if (k.kind !== "period") return;
      const count = career ? career.disciplinas.filter((d) => discById[d]?.periodo === k.n).length : 0;
      keyEls[i].classList.toggle("is-lit", count > 0);
      $(".badge", keyEls[i]).textContent = count || "";
    });
  }

  function pressPeriod(n) {
    const el = keyEls[n];
    el.classList.add("is-pressed");
    setTimeout(() => el.classList.remove("is-pressed"), 140);
    return el;
  }

  function init() {
    board = $("#board");
    trail = $("#trail");
    trailLayers = ["#trailEdge", "#trailGroove", "#trailPath", "#trailFlow"].map((s) => $(s));
    keyEls = KEYS.map(createKey);
    yearEls = [1, 2, 3, 4].map(createYear);

    let frame;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    });
    layout();
  }

  App.board = { init, highlight, pressPeriod };
})();
