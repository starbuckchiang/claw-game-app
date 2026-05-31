// =========================
// Game / 娃娃機主邏輯
// 包含：狀態初始化、娃娃生成、移動、下爪、每日登入、排行榜操作
// =========================

// 娃娃池
const prizePool = [
  { name: "小熊", emoji: "🧸", score: 20, points: 20, rarity: "common" },
  { name: "兔兔", emoji: "🐰", score: 20, points: 20, rarity: "common" },
  { name: "小貓", emoji: "🐱", score: 80, points: 80, rarity: "rare" },
  { name: "企鵝", emoji: "🐧", score: 80, points: 80, rarity: "rare" },
  { name: "皇冠熊", emoji: "👑", score: 200, points: 200, rarity: "legendary" }
];

// 夾滿次數送的 Bonus 禮物池
const bonusGiftPool = [
  { name: "Bonus 愛心禮物", emoji: "💝", score: 120, points: 120, rarity: "bonus" },
  { name: "Bonus 星星禮物", emoji: "🌟", score: 120, points: 120, rarity: "bonus" },
  { name: "Bonus 花花禮物", emoji: "🌸", score: 120, points: 120, rarity: "bonus" }
];

// DOM
const playArea = document.getElementById("playArea");
const clawArm = document.getElementById("clawArm");
const clawEl = document.getElementById("claw");
const ropeEl = document.getElementById("rope");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const dropBtn = document.getElementById("dropBtn");
const dailyBtn = document.getElementById("dailyBtn");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");

// 主狀態
window.gameState = loadGameState();

let clawX = 180;
let isDropping = false;
let prizes = [];

// 重新整理整個畫面
function refreshAllUI() {
  updateHUD(window.gameState, adState.adWatched);
  renderLeaderboard();
  renderShowcase();
}

// 建立娃娃
function createPrizes() {
  playArea.innerHTML = "";
  prizes = [];

  const isMobile = window.innerWidth <= APP_CONFIG.mobileBreakpoint;
  const cols = isMobile ? APP_CONFIG.prizeColsMobile : APP_CONFIG.prizeColsDesktop;
  const rows = isMobile ? APP_CONFIG.prizeRowsMobile : APP_CONFIG.prizeRowsDesktop;

  for (let i = 0; i < 7; i++) {
    const prize = prizePool[Math.floor(Math.random() * prizePool.length)];
    const el = document.createElement("div");
    el.className = "prize";
    el.textContent = prize.emoji;

    const x = cols[Math.floor(Math.random() * cols.length)];
    const y = rows[Math.floor(Math.random() * rows.length)];

    el.style.left = x + "px";
    el.style.top = y + "px";

    playArea.appendChild(el);
    prizes.push({ ...prize, x, y, el });
  }
}

// 重設爪子位置
function resetClawPosition() {
  const maxX = Math.max(20, playArea.clientWidth - 80);
  clawX = Math.max(20, Math.min(maxX, Math.floor(playArea.clientWidth / 2) - 40));
  clawArm.style.left = clawX + "px";
  clawArm.style.transform = "none";
}

// 左右移動爪子
function moveClaw(delta) {
  if (isDropping) return;

  clawX += delta;
  const maxX = Math.max(20, playArea.clientWidth - 80);
  clawX = Math.max(20, Math.min(maxX, clawX));
  clawArm.style.left = clawX + "px";
  clawArm.style.transform = "none";
}

// 金幣不足或連敗時提示補給
function maybeSuggestSupply(reason) {
  if (reason === "noCoins") {
    setMessage("金幣有點不夠了，先去甜心補給站拿點資源吧。");
  }

  if (reason === "fail3") {
    setMessage("今天手氣有點調皮，要不要先補一下再夾？");
  }
}

// 每次遊玩前先扣資源
function spendForPlay() {
  if (window.gameState.bonusPlays > 0) {
    window.gameState.bonusPlays -= 1;
    saveGameState(window.gameState);
    refreshAllUI();
    return true;
  }

  if (window.gameState.coins < 10) {
    maybeSuggestSupply("noCoins");
    alert("金幣不足！可以先去甜心補給站看獎勵影片。");
    return false;
  }

  window.gameState.coins -= 10;
  saveGameState(window.gameState);
  refreshAllUI();
  return true;
}

// 找最接近爪子的娃娃
function getNearestPrize() {
  let best = null;
  let bestDistance = Infinity;
  const clawCenter = clawX + 20;

  prizes.forEach(prize => {
    const prizeCenter = prize.x + 27;
    const dx = Math.abs(prizeCenter - clawCenter);

    if (dx < bestDistance) {
      bestDistance = dx;
      best = prize;
    }
  });
    return { prize: best, distance: bestDistance };
}

// 成功夾滿指定次數送券
function rewardTicketIfNeeded() {
  if (
    window.gameState.catchCount > 0 &&
    window.gameState.catchCount % APP_CONFIG.ticketEveryCatch === 0
  ) {
    window.gameState.tickets += 1;
    saveGameState(window.gameState);
    refreshAllUI();
    setMessage(`恭喜累積成功 ${window.gameState.catchCount} 次！獲得 1 張兌換券`);
  }
}

// 成功夾滿指定次數送 bonus 禮物
function rewardBonusGiftIfNeeded() {
  if (
    window.gameState.catchCount > 0 &&
    window.gameState.catchCount % APP_CONFIG.bonusGiftEveryCatch === 0
  ) {
    const bonusGift = bonusGiftPool[Math.floor(Math.random() * bonusGiftPool.length)];
    addToShowcase(bonusGift);
    window.gameState.score += bonusGift.score;
    window.gameState.points += bonusGift.points;
    saveGameState(window.gameState);
    refreshAllUI();
    setMessage(`恭喜達成夾 10 送 1！獲得 ${bonusGift.name}，再加 ${bonusGift.points} 點`);
  }
}

// 每日登入獎勵
function dailyBonus() {
  const today = new Date().toDateString();
  const last = loadLastBonusDate();

  if (last === today) {
    alert("今天已經領過每日 50 金幣了！");
    setMessage("今天的每日登入獎勵已經領過囉～");
    return;
  }

  window.gameState.coins += 50;
  saveLastBonusDate(today);
  saveGameState(window.gameState);
  refreshAllUI();
  setMessage("每日登入成功，+50 金幣！");
}

// 下爪
function dropClaw() {
  if (isDropping) return;
  if (!spendForPlay()) return;

  isDropping = true;
  setMessage("下爪中…");
  ropeEl.style.height = window.innerWidth <= APP_CONFIG.mobileBreakpoint ? "120px" : "180px";
  clawEl.classList.add("closed");

  setTimeout(() => {
    const { prize, distance } = getNearestPrize();
    let caught = false;

    if (prize && distance < 38) {
      const baseChance = distance < 18 ? 0.88 : 0.58;
      caught = Math.random() < baseChance;
    }

    if (caught && prize) {
      prize.el.style.top = window.innerWidth <= APP_CONFIG.mobileBreakpoint ? "70px" : "120px";
      prize.el.style.left = clawX + "px";
      prize.el.style.transform = "scale(1.1)";

      setTimeout(() => {
        prize.el.remove();
        prizes = prizes.filter(p => p !== prize);

        window.gameState.catchCount += 1;
        window.gameState.failStreak = 0;
        window.gameState.score += prize.score;
        window.gameState.points += prize.points;
        addToShowcase(prize);

        rewardTicketIfNeeded();
        rewardBonusGiftIfNeeded();

        saveGameState(window.gameState);
        refreshAllUI();

        if (prize.rarity === "legendary") {
          setMessage(`傳說級 ${prize.name} 到手！+${prize.score} 分 / +${prize.points} 點`);
        } else if (prize.rarity === "rare") {
          setMessage(`夾到稀有 ${prize.name}！+${prize.score} 分 / +${prize.points} 點`);
        } else {
          setMessage(`夾到 ${prize.name}！+${prize.score} 分 / +${prize.points} 點`);
        }

        if (!prizes.length) {
          setTimeout(() => {
            createPrizes();
            resetClawPosition();
            setMessage("新的一批娃娃補上囉！");
          }, 600);
        }
      }, 450);
    } else {
      window.gameState.failStreak += 1;
      saveGameState(window.gameState);

      if (window.gameState.failStreak >= 3) {
        maybeSuggestSupply("fail3");
      } else {
        setMessage("差一點點！再調整位置一次試試看～");
      }
    }

    setTimeout(() => {
      ropeEl.style.height = window.innerWidth <= APP_CONFIG.mobileBreakpoint ? "20px" : "28px";
      clawEl.classList.remove("closed");
      isDropping = false;
    }, 300);
  }, 700);
}

// 事件綁定
leftBtn.addEventListener("click", () => moveClaw(-APP_CONFIG.clawMoveStep));
rightBtn.addEventListener("click", () => moveClaw(APP_CONFIG.clawMoveStep));
dropBtn.addEventListener("click", dropClaw);
dailyBtn.addEventListener("click", dailyBonus);
saveBtn.addEventListener("click", () => saveScoreToLeaderboard(window.gameState.score));
resetBtn.addEventListener("click", resetLeaderboardBoard);

// 鍵盤控制
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveClaw(-APP_CONFIG.clawMoveStep);
  if (e.key === "ArrowRight") moveClaw(APP_CONFIG.clawMoveStep);
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    dropClaw();
  }
});

// 初始化
window.addEventListener("load", () => {
  createPrizes();
  resetClawPosition();
});

window.addEventListener("resize", () => {
  createPrizes();
  resetClawPosition();
});

refreshAllUI();
createPrizes();
resetClawPosition();
