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
  const imageInput = document.getElementById("wanted-image");
  const nicknameInput = document.getElementById("wanted-nickname");
  const contactInput = document.getElementById("wanted-contact");
  const dateInput = document.getElementById("wanted-date");
  const timeInput = document.getElementById("wanted-time");

  const gfDateYear = document.getElementById("gf-date-year");
  const gfDateMonth = document.getElementById("gf-date-month");
  const gfDateDay = document.getElementById("gf-date-day");
  const gfTimeHour = document.getElementById("gf-time-hour");
  const gfTimeMinute = document.getElementById("gf-time-minute");

  if (
    !form ||
    !statusEl ||
    !submitBtn ||
    !categoryInput ||
    !descInput ||
    !imageInput ||
    !nicknameInput ||
    !contactInput ||
    !dateInput ||
    !timeInput ||
    !gfDateYear ||
    !gfDateMonth ||
    !gfDateDay ||
    !gfTimeHour ||
    !gfTimeMinute
  ) {
    return;
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function syncDateTimeToGoogleForm() {
    const dateValue = (dateInput.value || "").trim();
    const timeValue = (timeInput.value || "").trim();

    gfDateYear.value = "";
    gfDateMonth.value = "";
    gfDateDay.value = "";
    gfTimeHour.value = "";
    gfTimeMinute.value = "";

    if (dateValue) {
      const [year, month, day] = dateValue.split("-");
      gfDateYear.value = year || "";
      gfDateMonth.value = month || "";
      gfDateDay.value = day || "";
    }

    if (timeValue) {
      const [hour, minute] = timeValue.split(":");
      gfTimeHour.value = hour || "";
      gfTimeMinute.value = minute || "";
    }
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

  dateInput.addEventListener("change", syncDateTimeToGoogleForm);
  timeInput.addEventListener("change", syncDateTimeToGoogleForm);

  categoryInput.addEventListener("change", () => {
    setStatus("請填好資料後送出，資料會開新分頁送進 Google Form。");
  });

  descInput.addEventListener("input", () => {
    setStatus("請填好資料後送出，資料會開新分頁送進 Google Form。");
  });

  imageInput.addEventListener("input", () => {
    setStatus("請填好資料後送出，資料會開新分頁送進 Google Form。");
  });

  nicknameInput.addEventListener("input", () => {
    setStatus("請填好資料後送出，資料會開新分頁送進 Google Form。");
  });

  contactInput.addEventListener("input", () => {
    setStatus("請填好資料後送出，資料會開新分頁送進 Google Form。");
  });

  form.addEventListener("submit", (event) => {
    syncDateTimeToGoogleForm();

    if (!validateForm()) {
      event.preventDefault();
      return;
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
