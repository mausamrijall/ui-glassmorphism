(function () {
  "use strict";

  const root = document.documentElement;
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  const menuBtn = document.getElementById("menuBtn");
  const themeToggle = document.getElementById("themeToggle");
  const toast = document.getElementById("toast");
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
    applyTheme(window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
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
    }, 2400);
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  const tabPanel = document.getElementById("tabPanel");
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

  document.querySelectorAll("[data-toast]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showToast(btn.dataset.toast);
    });
  });

  const overlay = document.getElementById("modalOverlay");
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");
  const cancelModal = document.getElementById("cancelModal");
  const confirmModal = document.getElementById("confirmModal");

  function hideModal() {
    if (overlay) overlay.hidden = true;
  }

  if (overlay && openModal) {
    openModal.addEventListener("click", function () {
      overlay.hidden = false;
      if (closeModal) closeModal.focus();
    });
    [closeModal, cancelModal].forEach(function (btn) {
      if (btn) btn.addEventListener("click", hideModal);
    });
    if (confirmModal) {
      confirmModal.addEventListener("click", function () {
        hideModal();
        showToast("Project deleted - demo only");
      });
    }
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) hideModal();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !overlay.hidden) hideModal();
    });
  }

  initTheme();
})();
