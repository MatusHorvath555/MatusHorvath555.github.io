(() => {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  /* ── Scroll reveal ─────────────────────────────── */
  const items = Array.from(document.querySelectorAll("[data-reveal]"));
  if (reduced) {
    items.forEach(el => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.10 });
    items.forEach(el => io.observe(el));
  }

  /* ── Toast ─────────────────────────────────────── */
  const toastEl = document.getElementById("toast");
  let toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 1600);
  }
  document.getElementById("toastBtn")?.addEventListener("click", () =>
    toast("✓ Micro-interaction fired.")
  );

  /* ── Dark / light theme ────────────────────────── */
  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = document.getElementById("themeIcon");
  const saved = localStorage.getItem("mh_lab_theme");
  if (saved === "dark") applyTheme("dark");

  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    if (themeIcon) themeIcon.textContent = t === "dark" ? "☀️" : "🌙";
  }
  themeBtn?.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("mh_lab_theme", next);
  });

  /* ── Sticky story ──────────────────────────────── */
  const story = document.querySelector(".principles");
  const princTitle    = document.getElementById("princTitle");
  const princText     = document.getElementById("princText");
  const progFill      = document.getElementById("progFill");
  const princDuration = document.getElementById("princDuration");
  const princEase     = document.getElementById("princEase");

  const frames = [
    {
      title: "Motion guides attention.",
      text: "Great UI motion feels instant, purposeful and never decorative. It answers: where am I, what changed, what can I do.",
      prog: 18, duration: "160 – 320 ms", ease: "cubic-bezier(0.22, 1, 0.36, 1)"
    },
    {
      title: "Depth creates hierarchy.",
      text: "Soft shadows + small translations create depth cues without distracting from content.",
      prog: 55, duration: "220 – 400 ms", ease: "cubic-bezier(0, 0, 0.2, 1)"
    },
    {
      title: "Respect the user.",
      text: "prefers-reduced-motion disables non-essential animation. Every interaction still works — just without motion.",
      prog: 92, duration: "0 ms (reduced)", ease: "no animation"
    },
  ];

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function updateStory() {
    if (!story) return;
    const rect = story.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const raw = (vh - rect.top) / (rect.height + vh);
    const p = clamp(raw, 0, 1);
    const idx = clamp(Math.floor(p * frames.length), 0, frames.length - 1);
    const f = frames[idx];
    if (princTitle) princTitle.textContent = f.title;
    if (princText)  princText.textContent  = f.text;
    if (princDuration) princDuration.textContent = f.duration;
    if (princEase)     princEase.textContent     = f.ease;
    if (progFill) progFill.style.width = reduced ? "90%" : `${f.prog}%`;
  }
  updateStory();
  window.addEventListener("scroll", updateStory, { passive: true });
  window.addEventListener("resize", updateStory);

  /* ── Typewriter ────────────────────────────────── */
  const typeTarget = document.getElementById("typeTarget");
  const phrases = [
    "Hover. Click. Feel it.",
    "Motion that's alive.",
    "Built with CSS + JS.",
    "Zero libraries."
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    if (!typeTarget) return;
    const phrase = phrases[pi];
    if (!deleting) {
      typeTarget.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      typeTarget.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
    }
    setTimeout(tick, deleting ? 42 : 68);
  }
  if (!reduced) setTimeout(tick, 800);
  else if (typeTarget) typeTarget.textContent = phrases[0];

  /* ── Count-up numbers ──────────────────────────── */
  const countCard = document.getElementById("countCard");
  let counted = false;

  const countIo = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll(".stat__num").forEach(el => {
          const target = +el.dataset.target;
          const dur = 1200;
          const start = performance.now();
          function step(now) {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(ease * target);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          if (!reduced) requestAnimationFrame(step);
          else el.textContent = target;
        });
      }
    }
  }, { threshold: 0.5 });
  if (countCard) countIo.observe(countCard);

  /* ── Easing card replay ────────────────────────── */
  document.querySelectorAll(".easing-card").forEach(card => {
    card.addEventListener("click", () => {
      const demo = card.querySelector(".easing-demo");
      if (!demo) return;
      demo.classList.remove("playing");
      void demo.offsetWidth; // reflow to restart
      demo.classList.add("playing");
    });
  });

})();