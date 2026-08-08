/* ============================================================
   SHUASH — Portfolio
   Motion engine: preloader, smooth scroll, cursor, reveals,
   scroll-morphing, counters, tilt, filters
   ============================================================ */

(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const page = document.body.dataset.page || "home";

  /* ---------------- Smooth scroll (Lenis) ---------------- */
  let lenis = null;
  if (!prefersReduced && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.2,
    });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const scrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------------- Preloader ---------------- */
  const preloader = document.getElementById("preloader");
  const countEl = document.getElementById("preload-count");
  if (preloader) {
    document.body.classList.add("no-scroll");
    const done = () => {
      preloader.classList.add("is-done");
      document.body.classList.remove("no-scroll");
      window.setTimeout(() => preloader.remove(), 1200);
    };
    if (prefersReduced || sessionStorage.getItem("loaded")) {
      countEl.textContent = "100";
      requestAnimationFrame(() => requestAnimationFrame(done));
    } else {
      let p = 0;
      const tick = () => {
        p += Math.floor(Math.random() * 14) + 6;
        if (p >= 100) { p = 100; countEl.textContent = p; sessionStorage.setItem("loaded", "1"); done(); return; }
        countEl.textContent = p;
        setTimeout(tick, 55 + Math.random() * 90);
      };
      setTimeout(tick, 350);
    }
  }

  /* ---------------- Letter split ---------------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    const frag = document.createDocumentFragment();
    let delay = 0;
    let line = document.createElement("span");
    line.className = "split-line";
    const flush = () => {
      if (line.children.length) { frag.appendChild(line); line = document.createElement("span"); line.className = "split-line"; }
    };
    const addWord = (text, cls) => {
      [...text].forEach((ch) => {
        const l = document.createElement("span");
        l.className = "l" + (cls ? " " + cls : "");
        l.textContent = ch;
        l.style.transitionDelay = `${delay}ms`;
        delay += 22;
        line.appendChild(l);
      });
    };
    el.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        const parts = node.textContent.split(" ");
        parts.forEach((w, i) => {
          if (!w) return;
          if (i > 0) line.appendChild(document.createTextNode(" "));
          addWord(w, "");
        });
      } else if (node.nodeType === 1) {
        if (node.tagName === "BR") { flush(); return; }
        line.appendChild(document.createTextNode(" "));
        addWord(node.textContent, node.className);
      }
    });
    flush();
    el.textContent = "";
    el.appendChild(frag);
  });

  /* ---------------- Reveal observer ---------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll("[data-reveal]").forEach((el, i) => {
    if (!el.style.getPropertyValue("--rd") && i % 3 !== 0) {
      el.style.setProperty("--rd", `${(i % 3) * 90}ms`);
    }
    revealObserver.observe(el);
  });

  /* ---------------- Header ---------------- */
  const header = document.querySelector(".header");
  const scrollbar = document.querySelector(".scrollbar");
  let lastY = window.scrollY;
  const onScrollHeader = () => {
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle("header--scrolled", y > 40);
    header.classList.toggle("header--hidden", y > lastY && y > 400);
    lastY = y;
    if (scrollbar) scrollbar.style.transform = `scaleX(${progress()})`;
  };

  const progress = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    return h > 0 ? window.scrollY / h : 0;
  };

  /* ---------------- Custom cursor ---------------- */
  if (finePointer && !prefersReduced) {
    document.body.classList.add("cursor-hidden");
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.append(dot, ring);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, shown = false;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!shown) { dot.style.opacity = 1; ring.style.opacity = 1; shown = true; }
    });
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
      ring.style.transform = `translate(${rx - ring.offsetWidth / 2}px, ${ry - ring.offsetHeight / 2}px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.querySelectorAll("a, button, .work-item, .card, input, textarea, .filter").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  /* ---------------- Magnetic elements ---------------- */
  if (finePointer && !prefersReduced) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transition = "transform 0.15s ease-out";
        el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ---------------- Counters ---------------- */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        counterObserver.unobserve(e.target);
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const dur = 1600;
        const t0 = performance.now();
        const step = (t) => {
          const k = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - k, 4);
          el.textContent = Math.round(target * eased);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

  /* ---------------- Skill bars ---------------- */
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        skillObserver.unobserve(e.target);
        const bar = e.target;
        const val = bar.dataset.fill;
        requestAnimationFrame(() => (bar.style.width = val));
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll("[data-fill]").forEach((el) => skillObserver.observe(el));

  /* ---------------- Tilt cards ---------------- */
  if (finePointer && !prefersReduced) {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      const card = el.closest(".card") || el;
      el.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)";
        card.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
        setTimeout(() => (card.style.transition = ""), 700);
      });
    });
  }

  /* ---------------- Mobile menu ---------------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      document.body.classList.toggle("no-scroll", open);
      if (lenis) open ? lenis.stop() : lenis.start();
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
        if (lenis) lenis.start();
      })
    );
  }

  /* ---------------- Work filters ---------------- */
  const filterBar = document.querySelector(".filters");
  if (filterBar) {
    const cards = document.querySelectorAll("[data-cat]");
    filterBar.querySelectorAll(".filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBar.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const f = btn.dataset.filter;
        cards.forEach((card) => {
          const show = f === "all" || card.dataset.cat.includes(f);
          card.style.transition = "opacity 0.5s ease, transform 0.5s ease, clip-path 0.7s var(--ease)";
          card.style.opacity = show ? 1 : 0;
          card.style.transform = show ? "none" : "scale(0.94)";
          card.style.clipPath = show ? "inset(0 0 0 0)" : "inset(0 50% 0 50%)";
          card.style.pointerEvents = show ? "" : "none";
        });
      });
    });
  }

  /* ---------------- Contact form ---------------- */
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.querySelector(".form-note");
      note.textContent = "Thanks — your message is on its way. I'll reply within 24h.";
      note.classList.add("is-success");
      form.reset();
    });
  }

  /* ---------------- Hero scroll morph (HOME) ---------------- */
  const heroFigure = document.querySelector(".hero__figure");
  const heroGlow = document.querySelector(".hero__glow");
  const heroProgress = document.querySelector(".hero__progress .bar");
  if (heroFigure && page === "home") {
    let morphTick = 0;
    const applyMorph = () => {
      morphTick = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const k = Math.min(y / vh, 1);
      const ease = 1 - Math.pow(1 - k, 3);
      heroFigure.style.transform = `scale(${1.08 - ease * 0.08}) translateY(${(y * 0.08).toFixed(1)}px)`;
      if (heroGlow) heroGlow.style.opacity = `${(1 - ease * 0.7).toFixed(2)}`;
      if (heroProgress) {
        const circ = heroProgress.getTotalLength() || 182;
        heroProgress.style.strokeDasharray = circ;
        heroProgress.style.strokeDashoffset = circ * (1 - progress());
      }
    };
    const onScroll = () => {
      if (morphTick) return;
      morphTick = requestAnimationFrame(applyMorph);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- About portrait parallax ---------------- */
  const portrait = document.querySelector(".about-portrait__img");
  if (portrait && page === "about") {
    const onScroll = () => {
      const r = portrait.closest(".about-portrait").getBoundingClientRect();
      const mid = r.top + r.height / 2 - window.innerHeight / 2;
      portrait.firstElementChild.style.transform = `translateY(${(mid * -0.06).toFixed(1)}px) scale(1.08)`;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Global scroll handlers ---------------- */
  addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
