document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-ready");

  const entryButtons = document.querySelectorAll("[data-entry-link]");
  entryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("is-clicked");
      setTimeout(() => {
        button.classList.remove("is-clicked");
      }, 180);
    });
  });

  const versionEl = document.getElementById("siteVersion");
  if (versionEl) {
    versionEl.textContent = "v1.0.0";
  }
});
