// =========================
// Gift Page / gift.html 邏輯
// 負責：資產顯示、商品渲染、兌換、紀錄顯示
// =========================

// 商品資料
const gifts = [
  {
    id: "gift1",
    name: "冰刀鞋",
    points: 300,
    tickets: 3,
    desc: "可放品牌、尺寸、保存狀況、適合對象等資訊。",
    image: "./image/image.png"
  },
  {
    id: "gift2",
    name: "鞋套",
    points: 120,
    tickets: 1,
    desc: "可放顏色、材質、尺寸與保存狀況。",
    image: "./image/image.png"
  },
  {
    id: "gift3",
    name: "旋轉板",
    points: 180,
    tickets: 2,
    desc: "可放品牌、磨損程度與適合初學者等資訊。",
    image: "./image/image.png"
  },
  {
    id: "gift4",
    name: "可愛娃娃",
    points: 150,
    tickets: 1,
    desc: "可放尺寸、角色名稱與是否全新等資訊。",
    image: "./image/image.png"
  },
  {
    id: "gift5",
    name: "冰場服飾",
    points: 220,
    tickets: 2,
    desc: "可放尺寸、版型、顏色與品牌資訊。",
    image: "./image/image.png"
  },
  {
    id: "gift6",
    name: "限定小禮包",
    points: 260,
    tickets: 2,
    desc: "可做成限時活動商品，增加收藏與回流感。",
    image: "./image/image.png"
  }
];

// 兌換紀錄 key
const REDEEM_HISTORY_KEY = "clawRedeemedGifts07";

// DOM
const pointsEl = document.getElementById("points");
const ticketsEl = document.getElementById("tickets");
const giftGrid = document.getElementById("giftGrid");
const historyList = document.getElementById("historyList");
const historyEmpty = document.getElementById("historyEmpty");

// 讀取 gift 頁資產（沿用 index07 的 storage key）
let giftState = {
  points: getStoredNumber(STORAGE_KEYS.points, 0),
  tickets: getStoredNumber(STORAGE_KEYS.tickets, 0)
};

// 儲存資產
function saveGiftWallet() {
  setStoredNumber(STORAGE_KEYS.points, giftState.points);
  setStoredNumber(STORAGE_KEYS.tickets, giftState.tickets);
}

// 更新資產顯示
function updateGiftWalletUI() {
  pointsEl.textContent = giftState.points;
  ticketsEl.textContent = giftState.tickets;
}

// 讀兌換紀錄
function loadRedeemHistory() {
  return getStoredJSON(REDEEM_HISTORY_KEY, []);
}

// 存兌換紀錄
function saveRedeemHistory(history) {
  setStoredJSON(REDEEM_HISTORY_KEY, history);
}

// 計算商品狀態
function getStatusText(gift) {
  const pointGap = Math.max(0, gift.points - giftState.points);
  const ticketGap = Math.max(0, gift.tickets - giftState.tickets);

  if (pointGap === 0 && ticketGap === 0) {
    return {
      text: "✅ 可立即兌換，資源已足夠",
      className: "gift-status ok"
    };
  }

  if (pointGap > 0 && ticketGap > 0) {
    return {
      text: `還差 ${pointGap} 點、${ticketGap} 張券`,
      className: "gift-status"
    };
  }

  if (pointGap > 0) {
    return {
      text: `還差 ${pointGap} 點即可兌換`,
      className: "gift-status"
    };
  }

  return {
    text: `還差 ${ticketGap} 張券即可兌換`,
    className: "gift-status"
  };
}

// 執行兌換
function redeemGift(id) {
  const gift = gifts.find(item => item.id === id);
  if (!gift) return;

  if (giftState.points < gift.points || giftState.tickets < gift.tickets) {
    alert(`兌換條件不足：需要 ${gift.points} 點 / ${gift.tickets} 張券`);
    return;
  }

  const ok = confirm(`確定要兌換「${gift.name}」嗎？會扣除 ${gift.points} 點 / ${gift.tickets} 張券`);
  if (!ok) return;

  giftState.points -= gift.points;
  giftState.tickets -= gift.tickets;

  saveGiftWallet();
  updateGiftWalletUI();

  const history = loadRedeemHistory();
  history.push({
    name: gift.name,
    date: new Date().toLocaleDateString("zh-TW"),
    points: gift.points,
    tickets: gift.tickets
  });
  saveRedeemHistory(history);

  alert(`兌換成功：${gift.name}`);
  renderGifts();
  renderRedeemHistory();
}

// 渲染商品卡
function renderGifts() {
  giftGrid.innerHTML = gifts.map(gift => {
    const status = getStatusText(gift);
    const enough = giftState.points >= gift.points && giftState.tickets >= gift.tickets;

    return `
      <div class="gift-card">
        <div class="gift-image">
          <img src="${gift.image || './image/image.png'}" alt="${gift.name}" onerror="this.src='./image/image.png'">
        </div>
        <div class="gift-name">${gift.name}</div>
        <div class="gift-cost">兌換需求：${gift.points} 點 / ${gift.tickets} 張券</div>
        <div class="gift-desc">${gift.desc}</div>
        <div class="${status.className}">${status.text}</div>
        <button class="btn ${enough ? 'btn-gift' : ''}" onclick="redeemGift('${gift.id}')" ${enough ? "" : "style='opacity:.65'"}>${enough ? "我要兌換" : "資源不足"}</button>
      </div>
    `;
  }).join("");
}

// 渲染兌換紀錄
function renderRedeemHistory() {
  const history = loadRedeemHistory();

  if (!history.length) {
    historyList.innerHTML = "";
    historyEmpty.style.display = "block";
    return;
  }

  historyEmpty.style.display = "none";
  historyList.innerHTML = history
    .slice()
    .reverse()
    .map(item => `
      <div class="history-item">
        <strong>${item.name}</strong><br>
        兌換日期：${item.date}<br>
        扣除：${item.points} 點 / ${item.tickets} 張券
      </div>
    `)
    .join("");
}

// 初始化
updateGiftWalletUI();
renderGifts();
renderRedeemHistory();

// 提供 onclick 使用
window.redeemGift = redeemGift;
