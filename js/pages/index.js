// =========================
// Index Page / 導流首頁初始化
// 負責：頁面載入狀態、導流按鈕小互動、版本資訊顯示
// =========================

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-ready");

  setupEntryButtons();
  setupVersionInfo();
});

// 導流按鈕互動
function setupEntryButtons() {
  const entryButtons = document.querySelectorAll("[data-entry-link]");

  entryButtons.forEach(button => {
    button.addEventListener("click", () => {
      button.classList.add("is-clicked");

      setTimeout(() => {
        button.classList.remove("is-clicked");
      }, 180);
    });
  });
}

// 顯示版本資訊（若頁面有掛載點就顯示）
function setupVersionInfo() {
  const versionEl = document.getElementById("siteVersion");
  if (!versionEl) return;

  versionEl.textContent = "v1.0.0";
}
