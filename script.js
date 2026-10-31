(function () {
  "use strict";

  const root = document.documentElement;
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  const menuBtn = document.getElementById("menuBtn");
  const themeToggle = document.getElementById("themeToggle");
  const toast = document.getElementById("toast");
  const tabPanel = document.getElementById("tabPanel");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const THEME_KEY = "glassui-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* storage unavailable */
    }
  }

  function initTheme() {
    let stored = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch (e) {
      stored = null;
    }
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
      return;
    }
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  themeToggle.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    showToast(next === "light" ? "Light theme enabled" : "Dark theme enabled");
  });

  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }

  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  menuBtn.addEventListener("click", function () {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  const counters = document.querySelectorAll(".stat-number");
  if (counters.length) {
    const animateCount = function (el) {
      const target = Number(el.dataset.count) || 0;
      if (reduceMotion || target === 0) {
        el.textContent = target === 0 ? "0" : String(target);
        return;
      }
      const duration = 1500;
      const start = performance.now();
      const format = function (value) {
        return value >= 1000 ? Math.round(value).toLocaleString() : String(Math.round(value));
      };
      const step = function (now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = format(target * eased);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = format(target);
        }
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              countObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach(function (el) {
        countObserver.observe(el);
      });
    } else {
      counters.forEach(animateCount);
    }
  }

  document.querySelectorAll(".feature-card").forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", event.clientX - rect.left + "px");
      card.style.setProperty("--my", event.clientY - rect.top + "px");
    });
  });

  const tabContent = {
    overview: "A calm, frosted surface for your most important content.",
    activity: "Every change is tracked with a light, readable timeline.",
    settings: "Fine tune blur, transparency and motion from one place.",
  };

  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (other) {
        other.classList.remove("active");
        other.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      if (tabPanel) {
        tabPanel.textContent = tabContent[tab.dataset.tab] || tabContent.overview;
      }
    });
  });

  const showcase = document.querySelector(".showcase");
  if (showcase && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const visual = showcase.parentElement;
    visual.addEventListener("pointermove", function (event) {
      const rect = visual.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      showcase.style.transform =
        "rotateY(" + (-9 + px * 10) + "deg) rotateX(" + (5 - py * 10) + "deg)";
    });
    visual.addEventListener("pointerleave", function () {
      showcase.style.transform = "";
    });
  }

  function demoAction(label) {
    showToast(label + " - demo only");
  }

  document.getElementById("primaryCta").addEventListener("click", function () {
    document.getElementById("components").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  document.getElementById("ctaButton").addEventListener("click", function () {
    demoAction("GlassUI toolkit requested");
  });

  document.getElementById("navCta").addEventListener("click", function () {
    document.getElementById("pricing").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  document.querySelectorAll(".price-card .btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      demoAction(btn.textContent.trim());
    });
  });

  document.querySelectorAll(".demo-card .btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      demoAction(btn.textContent.trim());
    });
  });

  initTheme();
})();
