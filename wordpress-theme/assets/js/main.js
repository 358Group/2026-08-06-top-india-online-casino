(function () {
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = header ? header.offsetHeight + 12 : 12;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function offerHaystack(card) {
    if (card._tiHay) return card._tiHay;
    var name = (card.querySelector(".ti-offer__name") || {}).textContent || "";
    var bonus = (card.querySelector(".ti-offer__bonus") || {}).textContent || "";
    var cta = (card.querySelector(".ti-offer__cta") || {}).textContent || "";
    var href = "";
    var link = card.querySelector(".ti-offer__cta");
    if (link) href = link.getAttribute("href") || "";
    var slug = href.replace(/\/+$/, "").split("/").pop() || "";
    card._tiHay = normalize([name, bonus, cta, slug.replace(/-/g, " ")].join(" "));
    return card._tiHay;
  }

  function brandHaystack(a) {
    if (a._tiHay) return a._tiHay;
    var text = a.textContent || "";
    var href = a.getAttribute("href") || "";
    var slug = href.replace(/\/+$/, "").split("/").pop() || "";
    a._tiHay = normalize([text, slug.replace(/-/g, " ")].join(" "));
    return a._tiHay;
  }

  function ensureEmptyNote(list) {
    var note = list.querySelector(".ti-search-empty");
    if (!note) {
      note = document.createElement("p");
      note.className = "ti-search-empty";
      note.hidden = true;
      list.appendChild(note);
    }
    return note;
  }

  function hasCasinoList() {
    return !!document.querySelector(".ti-list .ti-offer");
  }

  function homePath() {
    var form = document.querySelector("form.ti-search");
    if (form && form.getAttribute("action")) return form.getAttribute("action");
    return "./";
  }

  function scrollToCasinos() {
    var el =
      document.querySelector("#casinos") ||
      document.querySelector(".ti-list") ||
      document.querySelector(".ti-brand-grid");
    if (!el) return;
    var offset = header ? header.offsetHeight + 12 : 12;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: "smooth",
    });
  }

  function filterCasinos(query) {
    var q = normalize(query);
    var list = document.querySelector(".ti-list");
    var cards = document.querySelectorAll(".ti-list .ti-offer");
    var brands = document.querySelectorAll(".ti-brand-grid a");
    var visible = 0;

    cards.forEach(function (card) {
      var show = !q || offerHaystack(card).indexOf(q) !== -1;
      card.style.display = show ? "" : "none";
      card.classList.toggle("is-search-hidden", !show);
      if (show) visible += 1;
    });

    brands.forEach(function (a) {
      var show = !q || brandHaystack(a).indexOf(q) !== -1;
      a.style.display = show ? "" : "none";
    });

    if (list) {
      var note = ensureEmptyNote(list);
      if (q && visible === 0) {
        note.hidden = false;
        note.textContent = 'No casinos found for “' + query + '”';
      } else {
        note.hidden = true;
      }
    }

    return visible;
  }

  function setUrlQuery(q) {
    try {
      var url = new URL(location.href);
      if (q) url.searchParams.set("q", q);
      else url.searchParams.delete("q");
      history.replaceState(null, "", url.pathname + url.search + (q ? "#casinos" : ""));
    } catch (e) {}
  }

  function runSearch(query, opts) {
    opts = opts || {};
    var q = (query || "").trim();

    if (!hasCasinoList()) {
      var base = homePath();
      location.href = q
        ? base + (base.indexOf("?") >= 0 ? "&" : "?") + "q=" + encodeURIComponent(q) + "#casinos"
        : base;
      return;
    }

    filterCasinos(q);
    if (opts.scroll !== false) scrollToCasinos();
    if (opts.updateUrl !== false) setUrlQuery(q);
  }

  var form = document.querySelector("form.ti-search");
  var input = form
    ? form.querySelector('input[type="search"], input[name="q"], input[name="s"]')
    : null;

  if (form && input) {
    if (input.name === "s") input.name = "q";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      runSearch(input.value, { scroll: true, updateUrl: true });
    });

    var timer = null;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (!hasCasinoList()) return;
        filterCasinos(input.value);
        setUrlQuery((input.value || "").trim());
      }, 120);
    });
  }

  // Apply ?q= on load
  try {
    var params = new URLSearchParams(location.search);
    var initial = params.get("q") || params.get("s") || "";
    if (initial) {
      if (input) input.value = initial;
      if (hasCasinoList()) {
        filterCasinos(initial);
        setTimeout(scrollToCasinos, 80);
      }
    }
  } catch (e) {}
})();
