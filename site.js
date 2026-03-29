document.addEventListener("DOMContentLoaded", () => {
  const yearNodes = document.querySelectorAll("[data-year]");
  const currentYear = new Date().getFullYear();
  yearNodes.forEach(node => {
    node.textContent = currentYear;
  });

  const page = document.body.dataset.page;
  if (page) {
    const activeLink = document.querySelector(`[data-nav="${page}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
      activeLink.setAttribute("aria-current", "page");
    }
  }
});
