document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-ready");

  setupEntryLinkEffects();
  applyCategoryFromQuery();
  setupWantedForm();
});

function setupEntryLinkEffects() {
  const entryButtons = document.querySelectorAll("[data-entry-link]");

  entryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("is-clicked");
      setTimeout(() => {
        button.classList.remove("is-clicked");
      }, 180);
    });
  });
}

function applyCategoryFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("category");
  const categorySelect = document.getElementById("wanted-category");

  if (!slug || !categorySelect) return;

  const categoryMap = {
    skates: "冰刀鞋",
    "shoe-covers": "鞋套",
    spinner: "旋轉板",
    clothes: "服飾 / T-shirt / 夾克",
    plush: "絨毛娃娃 / 可愛小物",
    hockey: "Hockey 球鞋與裝備"
  };

  const mappedValue = categoryMap[slug];
  if (mappedValue) {
    categorySelect.value = mappedValue;
  }
}

function setupWantedForm() {
  const form = document.getElementById("wantedForm");
  const statusEl = document.getElementById("wantedFormStatus");
  const submitBtn = document.getElementById("submitWantedBtn");

  const categoryInput = document.getElementById("wanted-category");
  const descInput = document.getElementById("wanted-desc");
  const nicknameInput = document.getElementById("wanted-nickname");
  const contactInput = document.getElementById("wanted-contact");
  const dateInput = document.getElementById("wanted-date");
  const timeInput = document.getElementById("wanted-time");

  if (
    !form ||
    !statusEl ||
    !submitBtn ||
    !categoryInput ||
    !descInput ||
    !nicknameInput ||
    !contactInput ||
    !dateInput ||
    !timeInput
  ) {
    return;
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function validateForm() {
    const category = (categoryInput.value || "").trim();
    const desc = (descInput.value || "").trim();
    const nickname = (nicknameInput.value || "").trim();
    const contact = (contactInput.value || "").trim();
    const date = (dateInput.value || "").trim();
    const time = (timeInput.value || "").trim();

    if (!category) {
      setStatus("請先選擇物品分類。");
      categoryInput.focus();
      return false;
    }

    if (!desc) {
      setStatus("請填寫徵求物品敘述。");
      descInput.focus();
      return false;
    }

    if (!nickname) {
      setStatus("請填寫暱稱或呼號。");
      nicknameInput.focus();
      return false;
    }

    if (!contact) {
      setStatus("請填寫聯絡方式。");
      contactInput.focus();
      return false;
    }

    if (!date) {
      setStatus("請選擇日期。");
      dateInput.focus();
      return false;
    }

    if (!time) {
      setStatus("請選擇時間。");
      timeInput.focus();
      return false;
    }

    return true;
  }

  form.addEventListener("submit", (event) => {
    if (!validateForm()) {
      event.preventDefault();
      return;
    }

    const date = dateInput.value.trim();
    const time = timeInput.value.trim();
    const originalDesc = descInput.value.trim();

    const dateTimeText = `\n希望時間：${date} ${time}`;
    if (!originalDesc.includes("希望時間：")) {
      descInput.value = `${originalDesc}${dateTimeText}`;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "送出中…";
    setStatus("即將開啟 Google Form 送出頁面，請稍候…");

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "送出徵求";
      setStatus("如果已成功開啟新分頁，請在 Google Form 頁面完成送出。");
    }, 1500);
  });
}
