// =========================
// Storage / localStorage 讀寫工具
// 統一管理 index07 用到的 key
// =========================

window.STORAGE_KEYS = {
  coins: "clawCoins07",
  score: "clawScore07",
  points: "clawPoints07",
  tickets: "clawTickets07",
  bonusPlays: "clawBonusPlays07",
  catchCount: "clawCatchCount07",
  failStreak: "clawFailStreak07",

  adDate: "clawAdDate07",
  adWatched: "clawAdWatched07",
  lastBonusDate: "clawLastBonusDate07",

  leaderboard: "clawLeaderboard07",
  showcase: "clawShowcase07"
};

// 讀取數字，沒有值時回傳預設值
function getStoredNumber(key, fallback = 0) {
  const raw = localStorage.getItem(key);
  const value = Number(raw);
  return Number.isNaN(value) ? fallback : value;
}

// 讀取 JSON，沒有值或解析失敗時回傳預設值
function getStoredJSON(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

// 存數字
function setStoredNumber(key, value) {
  localStorage.setItem(key, String(value));
}

// 存 JSON
function setStoredJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// 讀取遊戲主狀態
function loadGameState() {
  return {
    coins: getStoredNumber(STORAGE_KEYS.coins, 100),
    score: getStoredNumber(STORAGE_KEYS.score, 0),
    points: getStoredNumber(STORAGE_KEYS.points, 0),
    tickets: getStoredNumber(STORAGE_KEYS.tickets, 0),
    bonusPlays: getStoredNumber(STORAGE_KEYS.bonusPlays, 0),
    catchCount: getStoredNumber(STORAGE_KEYS.catchCount, 0),
    failStreak: getStoredNumber(STORAGE_KEYS.failStreak, 0)
  };
}

// 儲存遊戲主狀態
function saveGameState(state) {
  setStoredNumber(STORAGE_KEYS.coins, state.coins);
  setStoredNumber(STORAGE_KEYS.score, state.score);
  setStoredNumber(STORAGE_KEYS.points, state.points);
  setStoredNumber(STORAGE_KEYS.tickets, state.tickets);
  setStoredNumber(STORAGE_KEYS.bonusPlays, state.bonusPlays);
  setStoredNumber(STORAGE_KEYS.catchCount, state.catchCount);
  setStoredNumber(STORAGE_KEYS.failStreak, state.failStreak);
}

// 讀排行榜
function loadLeaderboard() {
  return getStoredJSON(STORAGE_KEYS.leaderboard, []);
}

// 存排行榜
function saveLeaderboardData(board) {
  setStoredJSON(STORAGE_KEYS.leaderboard, board);
}

// 讀展示櫃
function loadShowcase() {
  return getStoredJSON(STORAGE_KEYS.showcase, []);
}

// 存展示櫃
function saveShowcaseData(items) {
  setStoredJSON(STORAGE_KEYS.showcase, items);
}

// 讀廣告狀態
function loadAdState() {
  const todayKey = new Date().toDateString();
  let adDate = localStorage.getItem(STORAGE_KEYS.adDate);
  let adWatched = getStoredNumber(STORAGE_KEYS.adWatched, 0);

  if (adDate !== todayKey) {
    adDate = todayKey;
    adWatched = 0;
    localStorage.setItem(STORAGE_KEYS.adDate, todayKey);
    localStorage.setItem(STORAGE_KEYS.adWatched, "0");
  }

  return { adDate, adWatched };
}

// 存廣告狀態
function saveAdState(adDate, adWatched) {
  localStorage.setItem(STORAGE_KEYS.adDate, adDate);
  localStorage.setItem(STORAGE_KEYS.adWatched, String(adWatched));
}

// 讀每日登入日期
function loadLastBonusDate() {
  return localStorage.getItem(STORAGE_KEYS.lastBonusDate) || "";
}

// 存每日登入日期
function saveLastBonusDate(dateText) {
  localStorage.setItem(STORAGE_KEYS.lastBonusDate, dateText);
}
