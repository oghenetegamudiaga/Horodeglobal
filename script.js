const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const form = document.querySelector(".contact-form");
const note = document.querySelector(".form-note");

menuButton?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open menu");
  }
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (note) {
    note.textContent = "Thanks. Your request is ready to connect to a backend.";
  }
});
