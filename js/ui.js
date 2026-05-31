// =========================
// UI / 畫面更新與顯示
// 負責 HUD、排行榜、展示櫃、訊息列
// =========================

// DOM 快取
window.UI_REFS = {
  coinsEl: document.getElementById("coins"),
  scoreEl: document.getElementById("score"),
  pointsEl: document.getElementById("points"),
  ticketsEl: document.getElementById("tickets"),
  triesEl: document.getElementById("tries"),
  bonusPlaysEl: document.getElementById("bonusPlays"),
  catchCountEl: document.getElementById("catchCount"),
  giftProgressEl: document.getElementById("giftProgress"),
  adRemainingEl: document.getElementById("adRemaining"),
  messageEl: document.getElementById("message"),
  leaderboardEl: document.getElementById("leaderboard"),
  showcaseEl: document.getElementById("showcase")
};

// 更新訊息列
function setMessage(text) {
  UI_REFS.messageEl.textContent = text;
}

// 更新 HUD
function updateHUD(state, adWatched) {
  UI_REFS.coinsEl.textContent = state.coins;
  UI_REFS.scoreEl.textContent = state.score;
  UI_REFS.pointsEl.textContent = state.points;
  UI_REFS.ticketsEl.textContent = state.tickets;
  UI_REFS.triesEl.textContent = Math.floor(state.coins / 10) + state.bonusPlays;
  UI_REFS.bonusPlaysEl.textContent = state.bonusPlays;
  UI_REFS.catchCountEl.textContent = state.catchCount;
  UI_REFS.giftProgressEl.textContent = state.catchCount % APP_CONFIG.bonusGiftEveryCatch;
  UI_REFS.adRemainingEl.textContent = Math.max(0, APP_CONFIG.maxDailyAdRewards - adWatched);
}

// 渲染排行榜
function renderLeaderboard() {
  const board = loadLeaderboard();

  UI_REFS.leaderboardEl.innerHTML = board.length
    ? board.map((item, index) =>
        `<li>${index + 1}. ${item.name}｜${item.score} 分｜${item.date}</li>`
      ).join("")
    : "<li>還沒有紀錄，快來成為第一名！</li>";
}

// 渲染展示櫃
function renderShowcase() {
  const list = loadShowcase();

  if (!list.length) {
    UI_REFS.showcaseEl.innerHTML =
      '<div style="grid-column:1/-1;color:#b8899e;text-align:center;">還沒抽到虛擬圖，快試試手氣！</div>';
    return;
  }

  UI_REFS.showcaseEl.innerHTML = list
    .slice(-8)
    .reverse()
    .map(item => `<div class="toy" title="${item.name}｜${item.points}點">${item.emoji}</div>`)
    .join("");
}

// 加到展示櫃
function addToShowcase(prize) {
  const list = loadShowcase();
  list.push(prize);
  saveShowcaseData(list);
  renderShowcase();
}

// 儲存排行榜分數
function saveScoreToLeaderboard(score) {
  const name = prompt("輸入暱稱：") || "神秘玩家";
  const board = loadLeaderboard();

  board.push({
    name: name.trim() || "神秘玩家",
    score,
    date: new Date().toLocaleDateString("zh-TW")
  });

  board.sort((a, b) => b.score - a.score);
  saveLeaderboardData(board.slice(0, 10));
  renderLeaderboard();
  setMessage("成績已儲存到本機排行榜！");
}

// 清空排行榜
function resetLeaderboardBoard() {
  if (!confirm("確定要清空本機排行榜嗎？")) return;
  localStorage.removeItem(STORAGE_KEYS.leaderboard);
  renderLeaderboard();
  setMessage("排行榜已清空。");
}
