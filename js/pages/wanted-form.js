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
    "https://docs.google.com/spreadsheets/d/1I6QqVPGMzMrGrcgcIgrJvnWM6WjmIzJY4OXSW8l57ew/edit?resourcekey=&gid=1467492265#gid=1467492265/Form_Responses";

  form.addEventListener("submit", (event) => {
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

    submitBtn.disabled = true;
    submitBtn.textContent = "送出中…";
    statusEl.textContent = "正在送出你的願望，請稍候…";

    const hiddenForm = document.createElement("form");
    hiddenForm.action = FORM_URL;
    hiddenForm.method = "POST";
    hiddenForm.target = "hidden_iframe";
    hiddenForm.style.display = "none";

    const fields = {
      "entry.811115215": category,
      "entry.973854663": description,
      "entry.936283346": "",
      "entry.24028156": nickname,
      "entry.244490545": contact
    };

    if (date) {
      const [year, month, day] = date.split("-");
      fields["entry.1533264183_year"] = year || "";
      fields["entry.1533264183_month"] = month || "";
      fields["entry.1533264183_day"] = day || "";
    }

    if (time) {
      const [hour, minute] = time.split(":");
      fields["entry.1943315019_hour"] = hour || "";
      fields["entry.1943315019_minute"] = minute || "";
    }

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      hiddenForm.appendChild(input);
    });

    let iframe = document.getElementById("hidden_iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.name = "hidden_iframe";
      iframe.id = "hidden_iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();

    setTimeout(() => {
      hiddenForm.remove();
      statusEl.textContent = "送出完成，請到 Google Sheet / Form Responses 確認是否收到新資料。";
      submitBtn.disabled = false;
      submitBtn.textContent = "送出願望";
      form.reset();
    }, 1200);
  });
}
