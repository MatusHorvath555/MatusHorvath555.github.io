(() => {
  /* ── Toast ─────────────────────────────────────── */
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 1400);
  }

  /* ── Copy email ─────────────────────────────────── */
  const copyBtn   = document.getElementById("copyEmailBtn");
  const emailLink = document.getElementById("emailLink");
  const email     = emailLink?.textContent?.trim() || "horvathmatus555@gmail.com";

  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast("Email copied ✓");
    } catch {
      const input = document.createElement("input");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      toast("Email copied ✓");
    }
  });

  /* ── Scroll reveal ──────────────────────────────── */
  const items   = Array.from(document.querySelectorAll("[data-reveal]"));
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  if (reduced) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
})();