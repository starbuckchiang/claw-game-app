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

  setupWantedForm();
});

function setupWantedForm() {
  const form = document.getElementById("wantedForm");
  const submitBtn = document.getElementById("submitWantedBtn");
  const statusEl = document.getElementById("wantedFormStatus");

  if (!form || !submitBtn || !statusEl) return;

  const API_URL = "https://script.google.com/macros/s/AKfycbzgq2WDR9WHHksID1BWgV8DiEhYD5gq8ijOocl3T-haz_yvrVCRoe5z7GEvgDlZduO1/exec";
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const payload = {
      category: formData.get("category")?.toString().trim() || "",
      itemName: formData.get("itemName")?.toString().trim() || "",
      brand: formData.get("brand")?.toString().trim() || "",
      size: formData.get("size")?.toString().trim() || "",
      budget: formData.get("budget")?.toString().trim() || "",
      style: formData.get("style")?.toString().trim() || "",
      note: formData.get("note")?.toString().trim() || "",
      contact: formData.get("contact")?.toString().trim() || "",
      nickname: formData.get("nickname")?.toString().trim() || "",
      page: "wanted-form.html",
      submittedAt: new Date().toISOString()
    };

    if (!payload.category && !payload.itemName) {
      statusEl.textContent = "請至少填寫「商品分類」或「想要的商品名稱 / 類型」。";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "送出中…";
    statusEl.textContent = "正在送出你的願望，請稍候…";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "送出失敗");
      }

      statusEl.textContent = "送出成功！你的願望已經進入許願池，謝謝你的分享。";
      form.reset();
    } catch (error) {
      statusEl.textContent = "送出失敗，請稍後再試，或改用 Bot / 私訊方式提交。";
      console.error("wanted form submit error:", error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "送出願望";
    }
  });
}
