const navToggle = document.getElementById("menuToggleBtn");
const navMenu = document.getElementById("mainMenu");
const navBackdrop = document.getElementById("menuBackdrop");
const navLinks = document.querySelectorAll(".main-menu a");
const copyIpBtn = document.getElementById("copyIpBtn");
const serverIp = document.getElementById("serverIp");
const copyFeedback = document.getElementById("copyFeedback");
const pageLoader = document.getElementById("pageLoader");
const MOBILE_BREAKPOINT = 760;
const PAGE_TRANSITION_DELAY = 420;
const LOADER_HIDE_DURATION = 280;
let isNavigating = false;

function showPageLoader() {
  if (!pageLoader) return;
  pageLoader.classList.remove("is-hiding");
  pageLoader.classList.add("show");
}

function hidePageLoader() {
  if (!pageLoader) return;
  pageLoader.classList.add("is-hiding");
  setTimeout(() => {
    pageLoader.classList.remove("show");
    pageLoader.classList.remove("is-hiding");
  }, LOADER_HIDE_DURATION);
}

function openMenu() {
  // Evita erro caso algum elemento do menu nao exista.
  if (!navToggle || !navMenu || !navBackdrop) return;

  navToggle.setAttribute("aria-expanded", "true");
  navToggle.classList.add("active");
  navMenu.classList.add("open");
  navBackdrop.classList.add("show");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  if (!navToggle || !navMenu || !navBackdrop) return;

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.classList.remove("active");
  navMenu.classList.remove("open");
  navBackdrop.classList.remove("show");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (!navToggle) return;

  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    closeMenu();
    return;
  }

  openMenu();
}

if (navToggle) {
  navToggle.addEventListener("click", toggleMenu);
}

if (navBackdrop) {
  navBackdrop.addEventListener("click", closeMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    closeMenu();
  }
});

window.addEventListener("load", () => {
  setTimeout(hidePageLoader, 180);
});

document.addEventListener("click", (event) => {
  if (isNavigating) return;

  const link = event.target.closest("a[href]");
  if (!link) return;

  if (
    event.defaultPrevented ||
    link.target === "_blank" ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const nextUrl = new URL(link.href, window.location.href);
  const currentUrl = new URL(window.location.href);

  if (nextUrl.origin !== currentUrl.origin) return;

  const isSameDocumentAnchor =
    nextUrl.pathname === currentUrl.pathname &&
    nextUrl.search === currentUrl.search &&
    nextUrl.hash;

  if (isSameDocumentAnchor) return;

  event.preventDefault();
  isNavigating = true;
  showPageLoader();
  setTimeout(() => {
    window.location.href = nextUrl.href;
  }, PAGE_TRANSITION_DELAY);
});

window.addEventListener("beforeunload", () => {
  showPageLoader();
});

if (copyIpBtn && serverIp && copyFeedback) {
  copyIpBtn.addEventListener("click", async () => {
    const ip = serverIp.textContent.trim();

    try {
      await navigator.clipboard.writeText(ip);
      copyFeedback.textContent = "IP copiado com sucesso!";
      copyIpBtn.textContent = "Copiado!";
    } catch (error) {
      copyFeedback.textContent = "Nao foi possivel copiar automaticamente. Copie manualmente.";
    }

    setTimeout(() => {
      copyFeedback.textContent = "";
      copyIpBtn.textContent = "Copiar IP";
    }, 2200);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});
