const BUNDLE_SIZE = 10;

// 1 橘色碎片 = 2 神鑄石 => 1 神鑄石 = 0.5 橘色碎片
const ORANGE_RATIO = 0.5;

// 1 紅色碎片 = 3 神鑄石 => 1 神鑄石 = 1/3 紅色碎片
const RED_RATIO = 1 / 3;

const feeRateInput = document.getElementById("feeRate");
const stonePriceInput = document.getElementById("stonePrice");
const bundleCountInput = document.getElementById("bundleCount");
const orangePriceInput = document.getElementById("orangePrice");
const redPriceInput = document.getElementById("redPrice");

const netRevenueEl = document.getElementById("netRevenue");
const bestOptionEl = document.getElementById("bestOption");

const orangeFragmentsEl = document.getElementById("orangeFragments");
const orangeLotsEl = document.getElementById("orangeLots");
const orangeCostEl = document.getElementById("orangeCost");
const orangeRevenueEl = document.getElementById("orangeRevenue");
const orangeProfitEl = document.getElementById("orangeProfit");
const orangeRoiEl = document.getElementById("orangeRoi");
const orangeBadgeEl = document.getElementById("orangeBadge");
const orangeProfitBoxEl = document.getElementById("orangeProfitBox");

const redFragmentsEl = document.getElementById("redFragments");
const redLotsEl = document.getElementById("redLots");
const redCostEl = document.getElementById("redCost");
const redRevenueEl = document.getElementById("redRevenue");
const redProfitEl = document.getElementById("redProfit");
const redRoiEl = document.getElementById("redRoi");
const redBadgeEl = document.getElementById("redBadge");
const redProfitBoxEl = document.getElementById("redProfitBox");

function formatNumber(value) {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("zh-TW", {
    maximumFractionDigits: 2,
  }).format(value);
}

function readNumber(input, fallback = 0) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function renderResult(options) {
  const isProfit = options.profit >= 0;

  options.fragmentsEl.textContent = formatNumber(options.totalFragments);
  options.lotsEl.textContent = formatNumber(options.fragmentLots);
  options.costEl.textContent = formatNumber(options.totalCost);
  options.revenueEl.textContent = formatNumber(options.revenueAfterFee);
  options.profitEl.textContent = `${options.profit >= 0 ? "+" : ""}${formatNumber(options.profit)}`;
  options.roiEl.textContent = `ROI：${formatNumber(options.roi)}%`;

  options.badgeEl.textContent = isProfit ? "有賺" : "虧損";
  options.badgeEl.className = `badge ${isProfit ? "profit" : "loss"}`;
  options.profitBoxEl.className = `profit-box ${isProfit ? "profit" : "loss"}`;
  options.profitEl.className = `profit-value ${isProfit ? "profit" : "loss"}`;
}

function calculate() {
  const feeRate = Math.max(0, Math.min(100, readNumber(feeRateInput, 20))) / 100;
  const stoneSellPricePer10 = Math.max(0, readNumber(stonePriceInput));
  const bundleCount = Math.max(1, Math.floor(readNumber(bundleCountInput, 1)));
  const orangePricePer10 = Math.max(0, readNumber(orangePriceInput));
  const redPricePer10 = Math.max(0, readNumber(redPriceInput));

  feeRateInput.value = Math.round(feeRate * 100);
  bundleCountInput.value = bundleCount;

  const revenueAfterFee = stoneSellPricePer10 * bundleCount * (1 - feeRate);
  netRevenueEl.textContent = formatNumber(revenueAfterFee);

  const totalStones = bundleCount * BUNDLE_SIZE;

  const orangeTotalFragments = totalStones * ORANGE_RATIO;
  const orangeFragmentLots = orangeTotalFragments / BUNDLE_SIZE;
  const orangeTotalCost = orangeFragmentLots * orangePricePer10;
  const orangeProfit = revenueAfterFee - orangeTotalCost;
  const orangeRoi = orangeTotalCost === 0 ? 0 : (orangeProfit / orangeTotalCost) * 100;

  const redTotalFragments = totalStones * RED_RATIO;
  const redFragmentLots = redTotalFragments / BUNDLE_SIZE;
  const redTotalCost = redFragmentLots * redPricePer10;
  const redProfit = revenueAfterFee - redTotalCost;
  const redRoi = redTotalCost === 0 ? 0 : (redProfit / redTotalCost) * 100;

  renderResult({
    totalFragments: orangeTotalFragments,
    fragmentLots: orangeFragmentLots,
    totalCost: orangeTotalCost,
    revenueAfterFee,
    profit: orangeProfit,
    roi: orangeRoi,
    fragmentsEl: orangeFragmentsEl,
    lotsEl: orangeLotsEl,
    costEl: orangeCostEl,
    revenueEl: orangeRevenueEl,
    profitEl: orangeProfitEl,
    roiEl: orangeRoiEl,
    badgeEl: orangeBadgeEl,
    profitBoxEl: orangeProfitBoxEl,
  });

  renderResult({
    totalFragments: redTotalFragments,
    fragmentLots: redFragmentLots,
    totalCost: redTotalCost,
    revenueAfterFee,
    profit: redProfit,
    roi: redRoi,
    fragmentsEl: redFragmentsEl,
    lotsEl: redLotsEl,
    costEl: redCostEl,
    revenueEl: redRevenueEl,
    profitEl: redProfitEl,
    roiEl: redRoiEl,
    badgeEl: redBadgeEl,
    profitBoxEl: redProfitBoxEl,
  });

  if (orangeProfit === redProfit) {
    bestOptionEl.textContent = "兩種方案收益相同";
  } else if (orangeProfit > redProfit) {
    bestOptionEl.textContent = "橘色碎片方案比較划算";
  } else {
    bestOptionEl.textContent = "紅色碎片方案比較划算";
  }
}

[feeRateInput, stonePriceInput, bundleCountInput, orangePriceInput, redPriceInput].forEach((input) => {
  input.addEventListener("input", calculate);
});

calculate();