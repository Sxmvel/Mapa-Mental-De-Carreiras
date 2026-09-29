App.utils = {
  $: (sel, el = document) => el.querySelector(sel),
  ordinal: (n) => `${n}º`,
  yearOf: (n) => Math.ceil(n / 2),
  slug: (s) =>
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
};
