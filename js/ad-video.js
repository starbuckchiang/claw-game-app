// =========================
// Ad Video / 補給站影片 modal 邏輯
// 規則：影片完整播完，按 X 關閉後才發獎勵
// =========================

const adVideoModal = document.getElementById("adVideoModal");
const adVideoPlayer = document.getElementById("adVideoPlayer");
const adVideoCloseBtn = document.getElementById("adVideoCloseBtn");
const adVideoStatus = document.getElementById("adVideoStatus");

// 影片狀態
let adVideoCompleted = false;
let adRewardClaimed = false;

// 廣告狀態
let adState = loadAdState();

// 更新 HUD 上的廣告剩餘次數
function refreshAdHUD() {
  if (window.gameState) {
    updateHUD(window.gameState, adState.adWatched);
  }
}

// 開啟補給站影片 modal
function openAdVideoModal() {
  if (adState.adWatched >= APP_CONFIG.maxDailyAdRewards) {
    alert("今天的補給次數已經用完了，明天再來喔！");
    setMessage("今天的甜心補給已經領完囉，明天再來補給吧！");
    return;
  }

  adVideoCompleted = false;
  adRewardClaimed = false;

  adVideoStatus.textContent = "影片尚未播放完成";
  adVideoModal.classList.add("show");

  adVideoPlayer.currentTime = 0;
  adVideoPlayer.load();

  adVideoPlayer.play().catch(() => {
    setMessage("影片已開啟，如果沒有自動播放，請手動按播放。");
  });
}

// 發補給獎勵
function grantAdReward() {
  if (adRewardClaimed) return;

  adRewardClaimed = true;
  adState.adWatched += 1;

  window.gameState.coins += APP_CONFIG.adRewardCoins;
  window.gameState.bonusPlays += APP_CONFIG.adRewardBonusPlay;

  saveAdState(adState.adDate, adState.adWatched);
  saveGameState(window.gameState);

  refreshAdHUD();
  setMessage(`補給完成！+${APP_CONFIG.adRewardCoins} 金幣、+${APP_CONFIG.adRewardBonusPlay} 次免費機會`);
}

// 關閉 modal
function closeAdVideoModal() {
  adVideoPlayer.pause();
  adVideoModal.classList.remove("show");

  if (adVideoCompleted) {
    grantAdReward();
    adVideoStatus.textContent = "補給已送達，記得去試試手氣！";
  } else {
    adVideoStatus.textContent = "影片尚未播放完成";
    setMessage("影片還沒播完，這次還不能領補給喔。");
  }
}

// 播放完成才算符合領獎條件
adVideoPlayer.addEventListener("ended", () => {
  adVideoCompleted = true;
  adVideoStatus.textContent = "影片播放完成，按右上角 × 關閉即可領取補給";
});

// 關閉按鈕
adVideoCloseBtn.addEventListener("click", closeAdVideoModal);

// 補給站按鈕
document.getElementById("watchAdBtn").addEventListener("click", openAdVideoModal);
