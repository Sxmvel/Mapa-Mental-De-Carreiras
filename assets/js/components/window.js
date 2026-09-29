(() => {
  const { $ } = App.utils;
  const { DISCIPLINAS, CARREIRAS } = App.data;
  const { careerById } = App.catalog;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const openTabs = [];
  const history = [];
  let active = -1;
  let win, scrim, title, body, back, tabs, crumbs;
  let lastTrigger = null;
  let closeTimer;

  const viewOf = (key) => {
    const [name, arg] = key.split(":");
    return { view: App.views[name], arg };
  };

  const infoOf = (key) => {
    const { view, arg } = viewOf(key);
    return view.info(arg);
  };

  function renderTabs() {
    tabs.innerHTML = openTabs
      .map((key, i) => {
        const info = infoOf(key);
        const isActive = i === active;
        return `<button class="tab ${isActive ? "is-active" : ""}" data-tab="${i}" ${isActive ? 'aria-current="page"' : ""} title="${info.title}">
          <span class="tab-icon">${info.icon}</span><span class="tab-title">${info.title}</span>
        </button>`;
      })
      .join("");
    tabs.querySelector(".is-active")?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function renderCrumbs() {
    const nodes = [{ label: "mapa", close: true }, ...infoOf(openTabs[active]).path];
    crumbs.innerHTML = nodes
      .map((node, i) => {
        if (i === nodes.length - 1) return `<li><span class="node is-current" aria-current="location">${node.label}</span></li>`;
        if (node.close) return `<li><button class="node" data-close title="Voltar ao tabuleiro">${node.label}</button></li>`;
        if (node.view) return `<li><button class="node" data-open-view="${node.view}">${node.label}</button></li>`;
        return `<li><span class="node">${node.label}</span></li>`;
      })
      .join("");
    crumbs.scrollLeft = crumbs.scrollWidth;
  }

  function renderStatus() {
    const id = App.state.selectedCareer;
    $("#statusCounts").textContent = `${DISCIPLINAS.length} disciplinas · ${CARREIRAS.length} carreiras`;
    $("#statusPath").textContent = id ? `caminho: ${careerById[id].nome}` : "nenhum caminho ativo";
  }

  function render(key) {
    const { view, arg } = viewOf(key);
    const page = view.render(arg);
    title.textContent = view.info(arg).title;
    body.innerHTML = `<div class="page">${page.html}</div>`;
    body.scrollTop = 0;
    renderTabs();
    renderCrumbs();
    renderStatus();
    back.disabled = history.length < 2;
    page.after?.();
  }

  const TAB_ORDER = { inicio: 0, periodo: 1, carreiras: 9, carreira: 10, areas: 11, optativas: 12 };

  const rankOf = (key) => {
    const [name, arg] = key.split(":");
    return name === "periodo" ? Number(arg) : TAB_ORDER[name];
  };

  function insertTab(key) {
    const rank = rankOf(key);
    const at = openTabs.findIndex((k) => rankOf(k) > rank);
    if (at === -1) openTabs.push(key);
    else openTabs.splice(at, 0, key);
  }

  function activate(key) {
    if (!openTabs.includes(key)) insertTab(key);
    active = openTabs.indexOf(key);
    if (history[history.length - 1] !== key) history.push(key);
    render(key);
  }

  function resetTabs() {
    openTabs.length = 0;
    history.length = 0;
    active = -1;
  }

  function animateFrom(trigger) {
    if (reducedMotion.matches || !trigger?.getBoundingClientRect) return;
    const t = trigger.getBoundingClientRect();
    const w = win.getBoundingClientRect();
    win.style.transformOrigin = `${t.left + t.width / 2 - w.left}px ${t.top + t.height / 2 - w.top}px`;
    win.classList.add("is-opening");
    setTimeout(() => win.classList.remove("is-opening"), 400);
  }

  function open(key, { trigger } = {}) {
    const opening = win.hidden || win.classList.contains("is-closing");
    if (opening) {
      clearTimeout(closeTimer);
      win.classList.remove("is-closing");
      scrim.classList.remove("is-closing");
      lastTrigger = trigger || document.activeElement;
      resetTabs();
    }
    win.hidden = false;
    scrim.hidden = false;
    activate(key);
    if (opening) animateFrom(trigger);
    title.focus();
  }

  function finishClose() {
    clearTimeout(closeTimer);
    if (!win.classList.contains("is-closing") && !reducedMotion.matches) return;
    win.hidden = true;
    scrim.hidden = true;
    win.classList.remove("is-closing");
    scrim.classList.remove("is-closing");
  }

  function close() {
    if (win.hidden) return;
    resetTabs();
    win.classList.remove("is-opening");
    if (reducedMotion.matches) finishClose();
    else {
      win.classList.add("is-closing");
      scrim.classList.add("is-closing");
      closeTimer = setTimeout(finishClose, 260);
    }
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;
    const focusables = [...win.querySelectorAll("button, summary, a[href], [tabindex]:not([tabindex='-1'])")].filter(
      (el) => !el.hidden && el.offsetParent !== null
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === title)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function init() {
    win = $("#window");
    scrim = $("#scrim");
    title = $("#windowTitle");
    body = $("#windowBody");
    back = $("#windowBack");
    tabs = $("#winTabs");
    crumbs = $("#winCrumbs");

    win.addEventListener("animationend", (e) => {
      if (e.target !== win) return;
      win.classList.remove("is-opening");
      if (win.classList.contains("is-closing")) finishClose();
    });
    win.addEventListener("keydown", trapFocus);

    back.addEventListener("click", () => {
      if (history.length < 2) return;
      history.pop();
      const prev = history[history.length - 1];
      active = openTabs.indexOf(prev);
      render(prev);
    });

    tabs.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-tab]");
      if (tab) activate(openTabs[Number(tab.dataset.tab)]);
    });

    $("#windowClose").addEventListener("click", close);
    scrim.addEventListener("click", close);
    renderStatus();
  }

  App.window = { init, open, close, renderStatus, isOpen: () => !win.hidden };
})();
