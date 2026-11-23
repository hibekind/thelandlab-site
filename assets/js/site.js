(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const top = document.querySelector(".top");
  const btn = document.querySelector(".menu-btn");
  const nav = document.getElementById("menu");

  const setOpen = (open) => {
    if (!top || !btn) return;
    top.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  };

  if (btn && top) {
    btn.addEventListener("click", () => setOpen(!top.classList.contains("is-open")));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
    if (nav) {
      nav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => setOpen(false));
      });
    }
  }

  const canvas = document.getElementById("acker");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const side = document.querySelector(".hero__side");

  const cssSize = () => {
    const rect = canvas.getBoundingClientRect();
    return {
      w: Math.max(1, Math.round(rect.width)),
      h: Math.max(1, Math.round(rect.height)),
    };
  };

  const fit = () => {
    const { w, h } = cssSize();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const paint = (offset = 0) => {
    const { w, h } = cssSize();
    if (w < 2 || h < 2) return;
    ctx.fillStyle = "#1a120c";
    ctx.fillRect(0, 0, w, h);

    const vanishX = w * 0.52;
    const horizon = h * 0.12;
    const rows = 42;
    for (let i = 0; i < rows; i++) {
      const t = i / (rows - 1);
      const y = horizon + Math.pow(t, 0.72) * (h - horizon);
      const spread = 40 + t * w * 1.15;
      const wob = Math.sin(i * 0.4 + offset * 0.01) * 8 * t;
      ctx.beginPath();
      ctx.moveTo(vanishX - spread + wob, y);
      ctx.lineTo(vanishX + spread + wob, y);
      const rust = i % 7 === 0;
      ctx.strokeStyle = rust
        ? `rgba(226, 61, 18, ${0.18 + t * 0.55})`
        : `rgba(214, 255, 58, ${0.08 + t * 0.4})`;
      ctx.lineWidth = rust ? 5 : 1 + t * 3;
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(214,255,58,0.25)";
    ctx.lineWidth = 2;
    for (let k = -6; k <= 6; k++) {
      ctx.beginPath();
      ctx.moveTo(vanishX, horizon);
      ctx.lineTo(vanishX + k * (w / 8) + offset * 0.15, h);
      ctx.stroke();
    }

    if (!reduce) {
      const sy = (offset * 2) % h;
      ctx.fillStyle = "rgba(214,255,58,0.08)";
      ctx.fillRect(0, sy, w, 18);
    }
  };

  const render = (offset = 0) => {
    fit();
    paint(offset);
  };

  render(0);

  let lastGlitch = 0;
  const onScroll = () => {
    const y = window.scrollY;
    paint(y);
    if (reduce) return;
    document.querySelectorAll("h1 .l").forEach((el, i) => {
      const shift = Math.min(40, y * 0.06) * (i % 2 === 0 ? 1 : -1);
      el.style.transform = `translateX(${shift}px)`;
    });
    if (side && y > 40 && y - lastGlitch > 160) {
      lastGlitch = y;
      side.classList.add("is-glitch");
      window.setTimeout(() => side.classList.remove("is-glitch"), 400);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => render(window.scrollY), { passive: true });
  onScroll();
})();
