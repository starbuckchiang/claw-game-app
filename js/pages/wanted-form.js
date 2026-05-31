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

  const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScKLkUyuTR-5kYBmE6f52bGD7I3jivZ5ah8HSFgaGxA6Q7U4w/formResponse";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const category = (formData.get("category") || "").toString().trim();
    const itemName = (formData.get("itemName") || "").toString().trim();
    const brand = (formData.get("brand") || "").toString().trim();
    const size = (formData.get("size") || "").toString().trim();
    const budget = (formData.get("budget") || "").toString().trim();
    const style = (formData.get("style") || "").toString().trim();
    const note = (formData.get("note") || "").toString().trim();
    const contact = (formData.get("contact") || "").toString().trim();
    const nickname = (formData.get("nickname") || "").toString().trim();
    const date = (formData.get("date") || "").toString().trim();
    const time = (formData.get("time") || "").toString().trim();

    if (!category && !itemName && !note) {
      statusEl.textContent = "請至少填寫商品分類、商品名稱，或其他備註其中一項。";
      return;
    }

    const descriptionParts = [
      itemName ? `想要的商品名稱 / 類型：${itemName}` : "",
      brand ? `品牌：${brand}` : "",
      size ? `尺寸 / 規格：${size}` : "",
      budget ? `預算：${budget}` : "",
      style ? `風格 / 顏色 / 補充條件：${style}` : "",
      note ? `其他備註：${note}` : ""
    ].filter(Boolean);

    const description = descriptionParts.join("\n");

    const payload = new URLSearchParams();
    payload.append("entry.811115215", category);
    payload.append("entry.973854663", description);
    payload.append("entry.936283346", "");
    payload.append("entry.24028156", nickname);
    payload.append("entry.244490545", contact);

    if (date) {
      const [year, month, day] = date.split("-");
      payload.append("entry.1533264183_year", year || "");
      payload.append("entry.1533264183_month", month || "");
      payload.append("entry.1533264183_day", day || "");
    }

    if (time) {
      const [hour, minute] = time.split(":");
      payload.append("entry.1943315019_hour", hour || "");
      payload.append("entry.1943315019_minute", minute || "");
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "送出中…";
    statusEl.textContent = "正在送出你的願望，請稍候…";

    try {
      await fetch(FORM_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: payload.toString()
      });

      statusEl.textContent = "送出成功！你的願望已送出，我們會整理進許願池。";
      form.reset();
    } catch (error) {
      console.error("wanted form submit error:", error);
      statusEl.textContent = "送出失敗，請稍後再試。";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "送出願望";
    }
  });
}
