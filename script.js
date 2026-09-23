(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "yh-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  (function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      applyTheme(saved);
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      applyTheme(prefersLight ? "light" : "dark");
    }
  })();

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scrollspy ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinkMap = new Map();
  document.querySelectorAll(".nav-link").forEach((a) => {
    navLinkMap.set(a.getAttribute("href")?.slice(1), a);
  });

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = navLinkMap.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            document.querySelectorAll(".nav-link.is-active").forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealer.observe(el));
  }

  /* ---------- Hero typing effect ---------- */
  const typingEl = document.getElementById("typingText");
  const roles = [
    "Software developer, 6+ years",
    "Btrust Builder",
    "Bitcoin protocol contributor",
    "Writer on protocol internals",
  ];

  if (typingEl) {
    if (prefersReducedMotion) {
      typingEl.textContent = roles[0];
    } else {
      let roleIndex = 0, charIndex = 0, deleting = false;
      const TYPE_SPEED = 55, DELETE_SPEED = 30, HOLD = 1400;

      function tick() {
        const word = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          typingEl.textContent = word.slice(0, charIndex);
          if (charIndex === word.length) {
            deleting = true;
            return setTimeout(tick, HOLD);
          }
        } else {
          charIndex--;
          typingEl.textContent = word.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
      }
      tick();
    }
  }

  /* ---------- BTC price / block height ticker ---------- */
  const btcPriceEl = document.getElementById("btcPrice");
  const btcHeightEl = document.getElementById("btcHeight");

  function fetchWithTimeout(url, ms = 6000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
  }

  async function updateBtcStats() {
    try {
      const priceRes = await fetchWithTimeout("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
      if (priceRes.ok) {
        const data = await priceRes.json();
        const price = data?.bitcoin?.usd;
        if (btcPriceEl) {
          btcPriceEl.textContent = Number.isFinite(price) ? "$" + price.toLocaleString("en-US") : "unavailable";
        }
      } else if (btcPriceEl) {
        btcPriceEl.textContent = "unavailable";
      }
    } catch (_) {
      if (btcPriceEl) btcPriceEl.textContent = "unavailable";
    }

    try {
      const heightRes = await fetchWithTimeout("https://mempool.space/api/blocks/tip/height");
      if (heightRes.ok) {
        const height = Number((await heightRes.text()).trim());
        if (btcHeightEl) btcHeightEl.textContent = Number.isFinite(height) ? height.toLocaleString("en-US") : "unavailable";
      } else if (btcHeightEl) {
        btcHeightEl.textContent = "unavailable";
      }
    } catch (_) {
      if (btcHeightEl) btcHeightEl.textContent = "unavailable";
    }
  }

  updateBtcStats();
  setInterval(updateBtcStats, 60000);

  /* ---------- Project filter ---------- */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const tags = card.dataset.tags?.split(" ") ?? [];
        const show = filter === "all" || tags.includes(filter);
        card.hidden = !show;
      });
    });
  });

  /* ---------- SHA-256 playground ---------- */
  const hashInput = document.getElementById("hashInput");
  const hashOutput = document.getElementById("hashOutput");
  const hashDiff = document.getElementById("hashDiff");
  let previousHashBits = null;

  function hexToBits(hex) {
    return hex.split("").map((c) => parseInt(c, 16).toString(2).padStart(4, "0")).join("");
  }

  function bitDiffPercent(a, b) {
    if (!a || !b || a.length !== b.length) return null;
    let diff = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
    return Math.round((diff / a.length) * 100);
  }

  async function computeHash(text) {
    const enc = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  let hashDebounce;
  async function updateHash() {
    if (!hashInput || !hashOutput) return;
    const value = hashInput.value;
    if (!value) {
      hashOutput.textContent = "—";
      hashDiff.textContent = "—";
      previousHashBits = null;
      return;
    }
    const hex = await computeHash(value);
    hashOutput.textContent = hex;
    const bits = hexToBits(hex);
    const pct = bitDiffPercent(previousHashBits, bits);
    hashDiff.textContent = pct === null ? "—" : pct + "%";
    previousHashBits = bits;
  }

  hashInput?.addEventListener("input", () => {
    clearTimeout(hashDebounce);
    hashDebounce = setTimeout(updateHash, 120);
  });
  updateHash();

  /* ---------- Copy email ---------- */
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const emailText = document.getElementById("emailText");

  copyEmailBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(emailText?.textContent?.trim() ?? "");
      const original = copyEmailBtn.textContent;
      copyEmailBtn.textContent = "Copied!";
      setTimeout(() => (copyEmailBtn.textContent = original), 1600);
    } catch (_) {
      /* clipboard API unavailable — user can select the text manually */
    }
  });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (!backToTop) return;
    backToTop.style.opacity = window.scrollY > 600 ? "1" : "0.35";
  }, { passive: true });
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Background network canvas ---------- */
  const canvas = document.getElementById("bg-canvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width, height, nodes;
    const NODE_COUNT = 46;
    const LINK_DIST = 130;
    let running = true;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function makeNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function accentColor() {
      const isLight = root.getAttribute("data-theme") === "light";
      return isLight ? "217, 122, 6" : "247, 147, 26";
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const color = accentColor();

      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(${color}, ${0.15 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.fillStyle = `rgba(${color}, 0.55)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(step);
    }

    resize();
    makeNodes();
    requestAnimationFrame(step);
    window.addEventListener("resize", () => { resize(); makeNodes(); });
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(step);
    });
  }
})();
