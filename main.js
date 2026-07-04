/* TiltProof landing — vanilla motion system. Honors prefers-reduced-motion. */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.25, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal, .shot, .coach-card, .gauge-stage").forEach((el) => io.observe(el));

  /* ---- count-up numbers (data-count, optional data-prefix/suffix/decimals) ---- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const dur = reduce ? 1 : 1400;
    const t0 = performance.now();
    function frame(t) {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const cio = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          countUp(e.target);
          cio.unobserve(e.target);
        }
      }
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  /* ---- TiltScore gauge: arc sweep 0 -> 76 + tier ticker ---- */
  const gauge = document.querySelector(".gauge-stage");
  if (gauge) {
    const arc = gauge.querySelector(".gauge-arc");
    const num = gauge.querySelector(".gauge-num");
    const tier = gauge.querySelector(".gauge-tier");
    const LEN = arc.getTotalLength();
    arc.style.strokeDasharray = LEN;
    arc.style.strokeDashoffset = LEN;
    const TIERS = [
      [0, "On Tilt", "#e5484d"],
      [40, "Steady", "#f6b73c"],
      [60, "Sharp", "#e8b54a"],
      [80, "TiltProof", "#2ecf7f"],
    ];
    function tierFor(v) {
      let cur = TIERS[0];
      for (const t of TIERS) if (v >= t[0]) cur = t;
      return cur;
    }
    const gio = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        gio.disconnect();
        const target = 76;
        const dur = reduce ? 1 : 2100;
        const t0 = performance.now();
        function frame(t) {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          const v = target * eased;
          num.textContent = Math.round(v);
          arc.style.strokeDashoffset = LEN * (1 - (v / 100) * 1); // arc path spans 0..100
          const tr = tierFor(v);
          tier.textContent = tr[1];
          tier.style.color = tr[2];
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      },
      { threshold: 0.5 }
    );
    gio.observe(gauge);
  }

  /* ---- hero phone: pointer tilt + screenshot cycle ---- */
  const phone = document.querySelector(".phone");
  if (phone && !reduce && matchMedia("(pointer: fine)").matches) {
    const stage = document.querySelector(".hero");
    stage.addEventListener("pointermove", (ev) => {
      const r = stage.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      phone.style.animation = "none";
      phone.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 7}deg) translateY(${y * 6}px)`;
    });
    stage.addEventListener("pointerleave", () => {
      phone.style.transform = "";
      phone.style.animation = "";
    });
  }
  const frames = document.querySelectorAll(".phone .screen img");
  if (frames.length > 1) {
    let i = 0;
    setInterval(() => {
      frames[i].classList.remove("on");
      i = (i + 1) % frames.length;
      frames[i].classList.add("on");
    }, 3400);
  }

  /* ---- hero suits parallax ---- */
  if (!reduce) {
    const suits = document.querySelectorAll(".suit");
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y > window.innerHeight * 1.2) return;
        suits.forEach((s, idx) => {
          s.style.marginTop = y * (0.06 + (idx % 3) * 0.045) + "px";
        });
      },
      { passive: true }
    );
  }

  /* ---- one FAQ open at a time (per group) ---- */
  document.querySelectorAll(".faq-list").forEach((group) => {
    group.addEventListener("toggle", (ev) => {
      if (ev.target.open)
        group.querySelectorAll("details[open]").forEach((d) => {
          if (d !== ev.target) d.open = false;
        });
    }, true);
  });
})();
