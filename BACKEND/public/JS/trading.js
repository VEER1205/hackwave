document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initNavLinks();
});

function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  });

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
}

function initNavLinks() {
  const navLinks = document.querySelectorAll(".nav-link");
  const navMenu = document.getElementById("navMenu");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      if (navMenu.classList.contains("active"))
        navMenu.classList.remove("active");
    });
  });
}
// ====== CONFIG ======
const CONFIG = {
  mode: "DEMO", // 'DEMO' | 'ALPHAVANTAGE' | 'BACKEND'
  alphaVantageApiKey: "", // Add to enable ALPHAVANTAGE mode
  backendBaseUrl: "", // e.g. 'https://yourdomain.com' for BACKEND mode
  initialBalance: 1000000, // ₹10,00,000
};

// ====== DEMO Universe ======
const DEMO_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries" },
  { symbol: "TCS", name: "Tata Consultancy Services" },
  { symbol: "INFY", name: "Infosys" },
  { symbol: "HDFCBANK", name: "HDFC Bank" },
  { symbol: "ICICIBANK", name: "ICICI Bank" },
  { symbol: "SBIN", name: "State Bank of India" },
  { symbol: "ITC", name: "ITC" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank" },
  { symbol: "AXISBANK", name: "Axis Bank" },
  { symbol: "LT", name: "Larsen & Toubro" },
  { symbol: "ASIANPAINT", name: "Asian Paints" },
  { symbol: "MARUTI", name: "Maruti Suzuki" },
  { symbol: "SUNPHARMA", name: "Sun Pharma" },
  { symbol: "TATASTEEL", name: "Tata Steel" },
  { symbol: "WIPRO", name: "Wipro" },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement" },
  { symbol: "POWERGRID", name: "Power Grid" },
  { symbol: "CIPLA", name: "Cipla" },
];

// Crypto universe via CoinGecko IDs
const CRYPTO = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "polygon-pos", symbol: "MATIC", name: "Polygon" },
];

// Mutual Funds demo universe
const DEMO_MF = [
  { symbol: "HDFCBAL", name: "HDFC Balanced Advantage Fund" },
  { symbol: "SBI-SMALLCAP", name: "SBI Small Cap Fund" },
  { symbol: "PARAGFLEXI", name: "Parag Parikh Flexi Cap Fund" },
  { symbol: "MIRAE-LARGE", name: "Mirae Asset Large Cap Fund" },
  { symbol: "ICICI-NIFTY50", name: "ICICI Nifty 50 Index Fund" },
  { symbol: "AXIS-BLUECHIP", name: "Axis Bluechip Fund" },
];

// IPO demo data
const DEMO_IPO = [
  {
    code: "ABCFOODS",
    name: "ABC Foods Ltd",
    price: 120,
    lot: 125,
    open: "2025-10-12",
    close: "2025-10-15",
    status: "Open",
  },
  {
    code: "SOLARGEN",
    name: "Solargen Energy",
    price: 315,
    lot: 40,
    open: "2025-10-18",
    close: "2025-10-21",
    status: "Upcoming",
  },
  {
    code: "HEALTHPRO",
    name: "HealthPro Diagnostics",
    price: 88,
    lot: 160,
    open: "2025-10-05",
    close: "2025-10-08",
    status: "Closed",
  },
];

// ====== State ======
let STATE = {
  user: null, // { id, name }
  balance: CONFIG.initialBalance,
  holdings: [], // [{type:'stock'|'crypto'|'ipo'|'mf', symbol/id, name, qty, avg, last}]
  trades: [], // [{ts, type, side, symbol, name, qty, price, total}]
  watchlist: ["RELIANCE", "TCS", "INFY"],
  cryptoWatch: ["bitcoin", "ethereum", "polygon-pos"],
  wishlist: [], // stock symbols only

  // Mutual funds
  mfWatchlist: ["HDFCBAL", "PARAGFLEXI"],
  mfWishlist: [], // symbols
  selectedMF: { symbol: "HDFCBAL" },
  mfCandles: [],
  mfPrice: 0,
  mfPeriod: "1Y",

  selected: { type: "stock", symbol: "RELIANCE" },
  selectedCrypto: { id: "bitcoin" },
  candles: [], // stock OHLC
  cryptoCandles: [], // crypto OHLC
  currentPrice: 0,
  cryptoPrice: 0,
  period: "1Y",
  cryptoPeriod: "1Y",
  predictions: [],
  seriesCache: {}, // key -> [{time, close}] for performance & scoring
};

const currency = (n) =>
  "₹" + (n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const pct = (n) =>
  (n > 0 ? "+" : "") + (isFinite(n) ? n.toFixed(2) : "0.00") + "%";

// ====== Storage ======
const save = () => {
  if (!STATE.user) return;
  localStorage.setItem(`tx:${STATE.user.id}:balance`, String(STATE.balance));
  localStorage.setItem(
    `tx:${STATE.user.id}:holdings`,
    JSON.stringify(STATE.holdings)
  );
  localStorage.setItem(
    `tx:${STATE.user.id}:trades`,
    JSON.stringify(STATE.trades)
  );
  localStorage.setItem(
    `tx:${STATE.user.id}:wishlist`,
    JSON.stringify(STATE.wishlist)
  );
  localStorage.setItem(
    `tx:${STATE.user.id}:mfwishlist`,
    JSON.stringify(STATE.mfWishlist)
  );
  localStorage.setItem(`tx:watch`, JSON.stringify(STATE.watchlist));
  localStorage.setItem(`tx:watchc`, JSON.stringify(STATE.cryptoWatch));
  localStorage.setItem(`tx:mfwatch`, JSON.stringify(STATE.mfWatchlist));
};
const load = (user) => {
  STATE.balance = Number(
    localStorage.getItem(`tx:${user.id}:balance`) || CONFIG.initialBalance
  );
  STATE.holdings = JSON.parse(
    localStorage.getItem(`tx:${user.id}:holdings`) || "[]"
  );
  STATE.trades = JSON.parse(
    localStorage.getItem(`tx:${user.id}:trades`) || "[]"
  );
  STATE.wishlist = JSON.parse(
    localStorage.getItem(`tx:${user.id}:wishlist`) || "[]"
  );
  STATE.mfWishlist = JSON.parse(
    localStorage.getItem(`tx:${user.id}:mfwishlist`) || "[]"
  );
  STATE.watchlist = JSON.parse(
    localStorage.getItem(`tx:watch`) || JSON.stringify(STATE.watchlist)
  );
  STATE.cryptoWatch = JSON.parse(
    localStorage.getItem(`tx:watchc`) || JSON.stringify(STATE.cryptoWatch)
  );
  STATE.mfWatchlist = JSON.parse(
    localStorage.getItem(`tx:mfwatch`) || JSON.stringify(STATE.mfWatchlist)
  );
};

// ====== UI helpers ======
const qs = (s) => document.querySelector(s);
const qsa = (s) => [...document.querySelectorAll(s)];
const on = (el, ev, fn) => el.addEventListener(ev, fn);

// Tabs
qsa(".tab").forEach((btn) =>
  on(btn, "click", () => switchTab(btn.dataset.tab))
);
function switchTab(tab) {
  qsa(".tab").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab)
  );
  qsa(".tab-pane").forEach((p) => (p.style.display = "none"));
  qs(`#tab-${tab}`).style.display = "";
  if (tab === "portfolio") computeAndRenderPerformance(); // refresh charts
}

// Auth
function uid() {
  return "u" + Math.random().toString(36).slice(2, 10);
}
function login(name) {
  const user = { id: uid(), name };
  STATE.user = user;
  load(user);
  updateUserUI();
  renderAll();
  selectStock(STATE.selected.symbol);
  selectCrypto(STATE.selectedCrypto.id);
  selectMF(STATE.selectedMF.symbol);
  refreshPredictions(); // first run
}
function updateUserUI() {
  if (STATE.user) {
    qs("#loginBox").style.display = "none";
    qs("#userBox").style.display = "";
    qs("#userTag").textContent = `Hi, ${STATE.user.name}`;
  } else {
    qs("#loginBox").style.display = "";
    qs("#userBox").style.display = "none";
  }
  updateBalanceSummary();
}
on(qs("#startBtn"), "click", () => {
  const name = qs("#nameInput").value.trim() || "Investor";
  login(name);
});
on(qs("#logoutBtn"), "click", () => {
  STATE.user = null;
  updateUserUI();
});
on(qs("#resetBtn"), "click", () => {
  if (!STATE.user) return;
  if (confirm("Reset virtual balance and clear portfolio/trades/wishlist?")) {
    STATE.balance = CONFIG.initialBalance;
    STATE.holdings = [];
    STATE.trades = [];
    STATE.wishlist = [];
    STATE.mfWishlist = [];
    save();
    renderAll();
    computeAndRenderPerformance();
    refreshPredictions();
  }
});

// ====== Data mode indicator ======
function setModeIndicator() {
  const el = qs("#dataMode");
  if (CONFIG.mode === "BACKEND" && CONFIG.backendBaseUrl)
    el.textContent = "Data: Backend";
  else if (CONFIG.mode === "ALPHAVANTAGE" && CONFIG.alphaVantageApiKey)
    el.textContent = "Data: Alpha Vantage";
  else el.textContent = "Data: Demo";
}
setModeIndicator();

// ====== Data providers & cache ======
function cacheKey(key) {
  return key;
}
async function getSeriesStock(symbol, days = 500) {
  const key = cacheKey(`stock:${symbol}:${days}`);
  if (STATE.seriesCache[key]) return STATE.seriesCache[key];
  const candles = await fetchStockSeries(symbol, days);
  const series = candles.map((c) => ({ time: c.time, close: c.close }));
  STATE.seriesCache[key] = series;
  return series;
}
async function getSeriesCrypto(id, days = 730) {
  const key = cacheKey(`crypto:${id}:${days}`);
  if (STATE.seriesCache[key]) return STATE.seriesCache[key];
  const points = await fetchCryptoPriceSeries(id, days); // {time, close}
  STATE.seriesCache[key] = points;
  return points;
}
async function getSeriesMF(symbol, days = 500) {
  const key = cacheKey(`mf:${symbol}:${days}`);
  if (STATE.seriesCache[key]) return STATE.seriesCache[key];
  const candles = await fetchMFSeries(symbol, days);
  const series = candles.map((c) => ({ time: c.time, close: c.close }));
  STATE.seriesCache[key] = series;
  return series;
}

// Stocks OHLC
async function fetchStockSeries(symbol, days = 500) {
  // BACKEND
  if (CONFIG.mode === "BACKEND" && CONFIG.backendBaseUrl) {
    try {
      const r = await fetch(
        `${
          CONFIG.backendBaseUrl
        }/api/market/historical?symbol=${encodeURIComponent(
          symbol
        )}&exchange=NSE`
      );
      if (!r.ok) throw new Error("backend");
      return await r.json(); // expected {time, open, high, low, close}
    } catch (e) {
      /* fallback */
    }
  }
  // ALPHAVANTAGE (daily)
  if (CONFIG.mode === "ALPHAVANTAGE" && CONFIG.alphaVantageApiKey) {
    try {
      const sym = symbol + ".BSE";
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${sym}&outputsize=compact&apikey=${CONFIG.alphaVantageApiKey}`;
      const r = await fetch(url);
      const j = await r.json();
      const series = j["Time Series (Daily)"];
      if (!series) throw new Error("No AV data");
      const rows = Object.entries(series)
        .map(([d, v]) => ({
          time: Math.floor(new Date(d).getTime() / 1000),
          open: +v["1. open"],
          high: +v["2. high"],
          low: +v["3. low"],
          close: +v["4. close"],
        }))
        .sort((a, b) => a.time - b.time);
      return rows.slice(-days);
    } catch (e) {
      /* fallback */
    }
  }
  // DEMO random-walk OHLC (seeded by symbol)
  const daysCount = days;
  const seed = [...symbol].reduce((a, c) => a + c.charCodeAt(0), 0);
  let rand = (function (seed) {
    return () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  })(seed);
  let price = 100 + rand() * 300;
  const out = [];
  for (let i = daysCount; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const drift = (rand() - 0.48) * 1.2;
    const o = price;
    const c = Math.max(5, o + drift);
    const h = Math.max(o, c) + rand() * 1.5;
    const l = Math.min(o, c) - rand() * 1.5;
    out.push({
      time: Math.floor(d.getTime() / 1000),
      open: o,
      high: h,
      low: l,
      close: c,
    });
    price = c;
  }
  return out;
}

// MF OHLC (demo)
async function fetchMFSeries(symbol, days = 500) {
  const seed = [...symbol].reduce((a, c) => a + c.charCodeAt(0), 0) + 777;
  let rand = (function (seed) {
    return () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  })(seed);
  let price = 50 + rand() * 200;
  const out = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const drift = (rand() - 0.5) * 0.6;
    const o = price;
    const c = Math.max(5, o + drift);
    const h = Math.max(o, c) + rand() * 0.8;
    const l = Math.min(o, c) - rand() * 0.8;
    out.push({
      time: Math.floor(d.getTime() / 1000),
      open: o,
      high: h,
      low: l,
      close: c,
    });
    price = c;
  }
  return out;
}

// Crypto OHLC for candlesticks
async function fetchCryptoOHLC(id, days = 365) {
  const d = typeof days === "string" ? days : Math.min(days, 365);
  const url = `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=inr&days=${d}`;
  const r = await fetch(url);
  const arr = await r.json(); // [[timestamp, open, high, low, close], ...]
  if (!Array.isArray(arr)) return [];
  return arr.map(([ms, o, h, l, c]) => ({
    time: Math.floor(ms / 1000),
    open: o,
    high: h,
    low: l,
    close: c,
  }));
}
// Crypto close series for performance / portfolio (smaller payload)
async function fetchCryptoPriceSeries(id, days = 730) {
  const d = Math.min(days, 365);
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=inr&days=${d}&interval=daily`;
  const r = await fetch(url);
  const j = await r.json();
  const prices = (j.prices || []).map(([ms, p]) => ({
    time: Math.floor(ms / 1000),
    close: p,
  }));
  return prices;
}
async function fetchCryptoPrice(ids) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
    ","
  )}&vs_currencies=inr`;
  const r = await fetch(url);
  return r.json();
}

// ====== Chart helpers ======
function ensureChart(containerId, opts = {}) {
  const el = qs("#" + containerId);
  el.innerHTML = "";
  const c = LightweightCharts.createChart(el, {
    layout: { background: { color: "transparent" }, textColor: "#c8d2e0" },
    grid: { vertLines: { color: "#1f2633" }, horzLines: { color: "#1f2633" } },
    rightPriceScale: { borderColor: "#263043" },
    timeScale: { borderColor: "#263043", timeVisible: true },
    crosshair: { mode: 0 },
    localization: { priceFormatter: (p) => "₹" + p.toFixed(2) },
    ...opts,
  });
  return c;
}
function newCandleSeries(c) {
  return c.addCandlestickSeries({
    upColor: "#27d980",
    downColor: "#ff6b6b",
    borderUpColor: "#27d980",
    borderDownColor: "#ff6b6b",
    wickUpColor: "#27d980",
    wickDownColor: "#ff6b6b",
  });
}
function newHistogramSeries(c) {
  return c.addHistogramSeries({
    color: "#6c7cff",
    base: 0,
    priceFormat: { type: "price", precision: 2, minMove: 0.01 },
  });
}
function sliceByPeriod(arr, period) {
  if (!arr.length) return arr;
  const now = arr[arr.length - 1].time;
  const daysMap = {
    "1M": 21,
    "3M": 63,
    "6M": 126,
    "1Y": 252,
    "3Y": 756,
    MAX: 99999,
  };
  const days = daysMap[period] || 252;
  const from = now - days * 24 * 3600;
  return arr.filter((x) => x.time >= from);
}
function changePct(arr) {
  if (arr.length < 2) return 0;
  const f = arr[0].close ?? arr[0].value;
  const l = arr[arr.length - 1].close ?? arr[arr.length - 1].value;
  return ((l - f) / f) * 100;
}

// ====== Candlestick pattern detection (basic demo) ======
function detectPatternsBasic(candles) {
  const n = candles.length;
  const markers = [];
  const labels = [];
  const start = Math.max(2, n - 120); // analyze last ~120 bars
  for (let i = start; i < n; i++) {
    const c = candles[i];
    const p = candles[i - 1];
    const p2 = candles[i - 2];

    const range = (x) => Math.max(1e-6, x.high - x.low);
    const body = (x) => Math.abs(x.close - x.open);
    const upper = (x) => x.high - Math.max(x.open, x.close);
    const lower = (x) => Math.min(x.open, x.close) - x.low;
    const bull = (x) => x.close > x.open;
    const bear = (x) => x.open > x.close;

    const r = range(c),
      b = body(c),
      u = upper(c),
      l = lower(c);

    // Doji
    const isDoji = b <= 0.1 * r;

    // Hammer / Shooting Star
    const isHammer = l >= 2 * b && u <= 0.5 * b;
    const isShooting = u >= 2 * b && l <= 0.5 * b;

    // Engulfing
    let bullEngulf = false,
      bearEngulf = false;
    if (p) {
      bullEngulf =
        bear(p) &&
        bull(c) &&
        c.close >= p.open &&
        c.open <= p.close &&
        body(c) > body(p) * 0.9;
      bearEngulf =
        bull(p) &&
        bear(c) &&
        c.open >= p.close &&
        c.close <= p.open &&
        body(c) > body(p) * 0.9;
    }

    // Morning/Evening Star (simplified)
    let morning = false,
      evening = false;
    if (p && p2) {
      morning =
        bear(p2) &&
        body(p) <= 0.5 * range(p) &&
        bull(c) &&
        c.close > (p2.open + p2.close) / 2;
      evening =
        bull(p2) &&
        body(p) <= 0.5 * range(p) &&
        bear(c) &&
        c.close < (p2.open + p2.close) / 2;
    }

    // Marubozu
    const maru = b >= 0.8 * r && u <= 0.05 * r && l <= 0.05 * r;
    const bullMaru = maru && bull(c);
    const bearMaru = maru && bear(c);

    // Precedence: Engulfing > Star > Marubozu > Hammer/Shooting > Doji
    if (bullEngulf) {
      markers.push({
        time: c.time,
        position: "belowBar",
        color: "#27d980",
        shape: "arrowUp",
        text: "Bull Engulf",
      });
      labels.push("Bullish Engulfing");
    } else if (bearEngulf) {
      markers.push({
        time: c.time,
        position: "aboveBar",
        color: "#ff6b6b",
        shape: "arrowDown",
        text: "Bear Engulf",
      });
      labels.push("Bearish Engulfing");
    } else if (morning) {
      markers.push({
        time: c.time,
        position: "belowBar",
        color: "#27d980",
        shape: "arrowUp",
        text: "Morning Star",
      });
      labels.push("Morning Star");
    } else if (evening) {
      markers.push({
        time: c.time,
        position: "aboveBar",
        color: "#ff6b6b",
        shape: "arrowDown",
        text: "Evening Star",
      });
      labels.push("Evening Star");
    } else if (bullMaru) {
      markers.push({
        time: c.time,
        position: "belowBar",
        color: "#27d980",
        shape: "arrowUp",
        text: "Marubozu",
      });
      labels.push("Bullish Marubozu");
    } else if (bearMaru) {
      markers.push({
        time: c.time,
        position: "aboveBar",
        color: "#ff6b6b",
        shape: "arrowDown",
        text: "Marubozu",
      });
      labels.push("Bearish Marubozu");
    } else if (isHammer) {
      markers.push({
        time: c.time,
        position: "belowBar",
        color: "#27d980",
        shape: "arrowUp",
        text: "Hammer",
      });
      labels.push("Hammer");
    } else if (isShooting) {
      markers.push({
        time: c.time,
        position: "aboveBar",
        color: "#ff6b6b",
        shape: "arrowDown",
        text: "Shooting Star",
      });
      labels.push("Shooting Star");
    } else if (isDoji) {
      markers.push({
        time: c.time,
        position: "inBar",
        color: "#ffc542",
        shape: "circle",
        text: "Doji",
      });
      labels.push("Doji");
    }
  }
  const latest = labels.slice(-3); // last few labels
  return { markers: markers.slice(-80), latest };
}

function applyPatternMarkersToSeries(viewCandles, series, patternsElId) {
  const { markers, latest } = detectPatternsBasic(viewCandles || []);
  try {
    series.setMarkers(markers || []);
  } catch (_) {}
  const el =
    typeof patternsElId === "string" ? qs("#" + patternsElId) : patternsElId;
  if (el) {
    if (!latest.length) el.innerHTML = "Patterns: —";
    else
      el.innerHTML =
        "Patterns: " +
        latest.map((x) => `<span class="chip">${x}</span>`).join(" ");
  }
}

// ====== Stocks flow (Candlestick) ======
let chart, series;
async function selectStock(symbol) {
  STATE.selected = { type: "stock", symbol };
  const meta = DEMO_STOCKS.find((s) => s.symbol === symbol);
  qs("#assetTitle").textContent = meta?.name || symbol;
  qs("#assetSubtitle").textContent = `${symbol} • NSE/BSE`;
  qs("#tradeSymbol").textContent = symbol;

  const candles = await fetchStockSeries(symbol);
  STATE.candles = candles;

  const c = ensureChart("chart");
  chart = c;
  series = newCandleSeries(c);
  renderStockByPeriod(STATE.period);

  const last = candles[candles.length - 1]?.close || 0;
  STATE.currentPrice = last;
  qs("#assetPrice").textContent = currency(last);
  qs("#tradeLTP").textContent = currency(last);
  qs("#tradeBalance").textContent = currency(STATE.balance);
  recalcTradeTotal();

  setGrowthTiles(candles);
  setProjection(candles);
  renderOrders();
  renderPortfolio(); // refresh P&L values if holding this
}

function renderStockByPeriod(period) {
  STATE.period = period;
  qsa("#periodButtons .pill").forEach((p) =>
    p.classList.toggle("active", p.dataset.period === period)
  );
  const sliced = sliceByPeriod(STATE.candles, period);
  series.setData(sliced.length ? sliced : STATE.candles);
  const ch = changePct(sliced.length ? sliced : STATE.candles);
  const el = qs("#assetChange");
  el.textContent = `${pct(ch)} (${period})`;
  el.className = ch >= 0 ? "pos" : "neg";
}

function setGrowthTiles(arr) {
  const calc = (d) => {
    const s = sliceByPeriod(arr, d);
    const ch = changePct(s);
    return isFinite(ch) ? pct(ch) : "—";
  };
  qs("#g1m").textContent = calc("1M");
  qs("#g3m").textContent = calc("3M");
  qs("#g6m").textContent = calc("6M");
  qs("#g1y").textContent = calc("1Y");
  qs("#g3y").textContent = calc("3Y");
  // YTD
  const yearStart = arr.filter((x) => {
    const jan1 = new Date(new Date().getFullYear(), 0, 1).getTime() / 1000;
    return x.time >= jan1;
  });
  const ytd = changePct(yearStart.length ? yearStart : arr);
  qs("#gytd").textContent = isFinite(ytd) ? pct(ytd) : "—";
}
function setProjection(arr) {
  const oneYear = sliceByPeriod(arr, "1Y");
  if (oneYear.length < 2) {
    qs("#projection").textContent = "—";
    return;
  }
  const start = oneYear[0].close,
    end = oneYear[oneYear.length - 1].close;
  const cagr = (end / start - 1) * 100;
  const invest = 100000;
  const future1Y = invest * (1 + cagr / 100);
  qs("#projection").textContent = `₹1,00,000 → ~${currency(
    future1Y
  )} (if repeats; not guaranteed)`;
}

on(qs("#qtyInput"), "input", recalcTradeTotal);
on(qs("#maxBtn"), "click", () => {
  const q = Math.floor(STATE.balance / (STATE.currentPrice || 1));
  qs("#qtyInput").value = Math.max(q, 0);
  recalcTradeTotal();
});
function recalcTradeTotal() {
  const q = Number(qs("#qtyInput").value || 0);
  const total = q * (STATE.currentPrice || 0);
  qs("#tradeTotal").textContent = currency(total);
}

on(qs("#buyBtn"), "click", () => placeOrder("BUY", "stock"));
on(qs("#sellBtn"), "click", () => placeOrder("SELL", "stock"));

qsa("#periodButtons .pill").forEach((p) => {
  if (p.id === "wishFromHeader") return;
  on(p, "click", () => renderStockByPeriod(p.dataset.period));
});

// ====== Crypto flow (Candlestick + Patterns) ======
let cryptoChart, cryptoSeries;
async function selectCrypto(id) {
  STATE.selectedCrypto = { id };
  const meta = CRYPTO.find((c) => c.id === id) || {
    symbol: id.toUpperCase(),
    name: id,
  };
  qs("#cryptoTitle").textContent = `${meta.name} (${meta.symbol})`;
  qs("#cryptoSubtitle").textContent = id;

  const ps = await fetchCryptoPrice([id]);
  STATE.cryptoPrice = ps?.[id]?.inr || 0;
  qs("#cryptoPrice").textContent = currency(STATE.cryptoPrice);
  qs("#cryptoLTP").textContent = currency(STATE.cryptoPrice);
  qs("#cryptoBalance").textContent = currency(STATE.balance);
  qs("#cryptoSymbol").textContent = meta.symbol;

  // Fetch OHLC for candlestick
  const ohlc = await fetchCryptoOHLC(id, 365);
  STATE.cryptoCandles = ohlc;

  cryptoChart = ensureChart("cryptoChart");
  cryptoSeries = newCandleSeries(cryptoChart);
  renderCryptoByPeriod(STATE.cryptoPeriod);

  renderCryptoOrders();
  recalcCryptoTotal();
  calcCryptoChanges();
}
function renderCryptoByPeriod(period) {
  STATE.cryptoPeriod = period;
  qsa("#cryptoPeriodButtons .pill").forEach((p) =>
    p.classList.toggle("active", p.dataset.period === period)
  );
  const sliced = sliceByPeriod(STATE.cryptoCandles, period);
  const data = sliced.length ? sliced : STATE.cryptoCandles;
  cryptoSeries.setData(data);
  const ch = changePct(data);
  const el = qs("#cryptoChange");
  el.textContent = `${pct(ch)} (${period})`;
  el.className = ch >= 0 ? "pos" : "neg";
  applyPatternMarkersToSeries(data, cryptoSeries, "cryptoPatterns");
}
qsa("#cryptoPeriodButtons .pill").forEach((p) =>
  on(p, "click", () => renderCryptoByPeriod(p.dataset.period))
);

on(qs("#cryptoBuy"), "click", () => placeOrder("BUY", "crypto"));
on(qs("#cryptoSell"), "click", () => placeOrder("SELL", "crypto"));
on(qs("#cryptoQty"), "input", recalcCryptoTotal);
on(qs("#cryptoMax"), "click", () => {
  const q = STATE.cryptoPrice > 0 ? STATE.balance / STATE.cryptoPrice : 0;
  qs("#cryptoQty").value = Math.max(q, 0).toFixed(4);
  recalcCryptoTotal();
});
on(qs("#addWatchCrypto"), "click", () => {
  const id = (qs("#cryptoSearch").value || "").trim().toLowerCase();
  if (!id) return;
  if (!STATE.cryptoWatch.includes(id)) STATE.cryptoWatch.push(id);
  save();
});
function recalcCryptoTotal() {
  const q = Number(qs("#cryptoQty").value || 0);
  qs("#cryptoTotal").textContent = currency(q * (STATE.cryptoPrice || 0));
}
function renderCryptoOrders() {
  const container = qs("#cryptoOrdersList");
  const items = STATE.trades
    .filter((t) => t.type === "crypto")
    .slice(0, 10)
    .map((t) => {
      const cls = t.side === "BUY" ? "pos" : "neg";
      return `<div class="item">
            <div><div class="sym">${t.symbol} • ${
        t.name
      }</div><div class="muted">${new Date(t.ts).toLocaleString()}</div></div>
            <div style="text-align:right;">
              <div class="${cls}">${t.side}</div>
              <div class="muted">${t.qty} @ ${currency(t.price)}</div>
            </div>
        </div>`;
    })
    .join("");
  container.innerHTML =
    items || `<div class="muted">No crypto orders yet.</div>`;
  qs("#cryptoOrdersCount").textContent = STATE.trades.filter(
    (t) => t.type === "crypto"
  ).length;
}
function calcCryptoChanges() {
  const d = STATE.cryptoCandles;
  if (!d.length) {
    qs("#c24").textContent =
      qs("#c7d").textContent =
      qs("#c30d").textContent =
      qs("#c1y").textContent =
        "—";
    return;
  }
  const back = (days) => {
    const ts = d[d.length - 1].time - days * 24 * 3600;
    const arr = d.filter((x) => x.time >= ts);
    if (arr.length < 2) return 0;
    const f = arr[0].close,
      l = arr[arr.length - 1].close;
    return ((l - f) / f) * 100;
  };
  qs("#c24").textContent = pct(back(1));
  qs("#c7d").textContent = pct(back(7));
  qs("#c30d").textContent = pct(back(30));
  qs("#c1y").textContent = pct(back(365));
}

// ====== Mutual Funds flow (Candlestick + Patterns) ======
let mfChart, mfSeries;
async function selectMF(symbol) {
  STATE.selectedMF = { symbol };
  const meta = DEMO_MF.find((m) => m.symbol === symbol);
  qs("#mfTitle").textContent = meta?.name || symbol;
  qs("#mfSubtitle").textContent = `${symbol} • Mutual Fund`;
  qs("#mfSymbol").textContent = symbol;

  const candles = await fetchMFSeries(symbol);
  STATE.mfCandles = candles;

  mfChart = ensureChart("mfChart");
  mfSeries = newCandleSeries(mfChart);
  renderMFByPeriod(STATE.mfPeriod);

  const last = candles[candles.length - 1]?.close || 0;
  STATE.mfPrice = last;
  qs("#mfPrice").textContent = currency(last);
  qs("#mfLTP").textContent = currency(last);
  qs("#mfBalance").textContent = currency(STATE.balance);
  recalcMFTotal();

  renderMFOrders();
  renderPortfolio();
}
function renderMFByPeriod(period) {
  STATE.mfPeriod = period;
  qsa("#mfPeriodButtons .pill").forEach((p) =>
    p.classList.toggle("active", p.dataset.period === period)
  );
  const sliced = sliceByPeriod(STATE.mfCandles, period);
  const data = sliced.length ? sliced : STATE.mfCandles;
  mfSeries.setData(data);
  const ch = changePct(data);
  const el = qs("#mfChange");
  el.textContent = `${pct(ch)} (${period})`;
  el.className = ch >= 0 ? "pos" : "neg";
  applyPatternMarkersToSeries(data, mfSeries, "mfPatterns");
}
qsa("#mfPeriodButtons .pill").forEach((p) => {
  if (p.id === "mfWishFromHeader") return;
  on(p, "click", () => renderMFByPeriod(p.dataset.period));
});

function recalcMFTotal() {
  const q = Number(qs("#mfQty").value || 0);
  qs("#mfTotal").textContent = currency(q * (STATE.mfPrice || 0));
}
on(qs("#mfQty"), "input", recalcMFTotal);
on(qs("#mfMax"), "click", () => {
  const q = STATE.mfPrice > 0 ? STATE.balance / STATE.mfPrice : 0;
  qs("#mfQty").value = Math.max(q, 0).toFixed(2);
  recalcMFTotal();
});
on(qs("#mfBuy"), "click", () => placeOrder("BUY", "mf"));
on(qs("#mfSell"), "click", () => placeOrder("SELL", "mf"));

on(qs("#addWatchMF"), "click", () => {
  const s = (qs("#mfSearch").value || "").trim().toUpperCase();
  if (!s) return;
  if (!STATE.mfWatchlist.includes(s)) STATE.mfWatchlist.push(s);
  save();
  renderMFWatchlist();
});
on(qs("#addWishMF"), "click", () => {
  const s = (qs("#mfSearch").value || "").trim().toUpperCase();
  if (!s) return;
  addMFToWishlist(s);
});
on(qs("#mfWishFromHeader"), "click", () => {
  const sym = STATE.selectedMF?.symbol;
  if (sym) addMFToWishlist(sym);
});
on(qs("#mfSearch"), "keydown", async (e) => {
  if (e.key === "Enter") {
    const s = (qs("#mfSearch").value || "").trim().toUpperCase();
    if (s) {
      await selectMF(s);
      if (!STATE.mfWatchlist.includes(s)) {
        STATE.mfWatchlist.push(s);
        save();
        renderMFWatchlist();
      }
    }
  }
});

function renderMFOrders() {
  const container = qs("#mfOrdersList");
  const items = STATE.trades
    .filter((t) => t.type === "mf")
    .slice(0, 10)
    .map((t) => {
      const cls = t.side === "BUY" ? "pos" : "neg";
      return `<div class="item">
          <div><div class="sym">${t.symbol} • ${
        t.name
      }</div><div class="muted">${new Date(t.ts).toLocaleString()}</div></div>
          <div style="text-align:right;">
            <div class="${cls}">${t.side}</div>
            <div class="muted">${t.qty} @ ${currency(t.price)}</div>
          </div>
        </div>`;
    })
    .join("");
  container.innerHTML = items || `<div class="muted">No MF orders yet.</div>`;
  qs("#mfOrdersCount").textContent = STATE.trades.filter(
    (t) => t.type === "mf"
  ).length;
}

// ====== Orders & Trades ======
function pushTrade(type, side, key, name, qty, price, total) {
  const now = new Date().toISOString();
  STATE.trades.unshift({
    ts: now,
    type,
    side,
    symbol: type === "crypto" ? key.toUpperCase() : key,
    name,
    qty,
    price,
    total,
  });
}
function upsertHolding(type, key, name, qty, price, sign) {
  let h;
  if (type === "crypto") {
    h = STATE.holdings.find((x) => x.type === "crypto" && x.id === key);
    if (!h && sign > 0) {
      STATE.holdings.push({
        type: "crypto",
        id: key,
        name,
        qty: 0,
        avg: 0,
        last: price,
      });
      h = STATE.holdings[STATE.holdings.length - 1];
    }
  } else if (type === "stock") {
    h = STATE.holdings.find((x) => x.type === "stock" && x.symbol === key);
    if (!h && sign > 0) {
      STATE.holdings.push({
        type: "stock",
        symbol: key,
        name,
        qty: 0,
        avg: 0,
        last: price,
      });
      h = STATE.holdings[STATE.holdings.length - 1];
    }
  } else if (type === "ipo") {
    h = STATE.holdings.find((x) => x.type === "ipo" && x.symbol === key);
    if (!h && sign > 0) {
      STATE.holdings.push({
        type: "ipo",
        symbol: key,
        name,
        qty: 0,
        avg: price,
        last: price,
      });
      h = STATE.holdings[STATE.holdings.length - 1];
    }
  } else if (type === "mf") {
    h = STATE.holdings.find((x) => x.type === "mf" && x.symbol === key);
    if (!h && sign > 0) {
      STATE.holdings.push({
        type: "mf",
        symbol: key,
        name,
        qty: 0,
        avg: 0,
        last: price,
      });
      h = STATE.holdings[STATE.holdings.length - 1];
    }
  }
  if (!h) return;
  if (sign > 0) {
    const totalCost = h.avg * h.qty + price * qty;
    h.qty += qty;
    h.avg = totalCost / h.qty;
  } else {
    h.qty -= qty;
    if (h.qty <= 0) {
      STATE.holdings = STATE.holdings.filter((x) => x !== h);
      return;
    }
  }
  h.last = price;
}
function placeOrder(side, type) {
  if (!STATE.user) return alert("Please start (login) to trade.");
  const qty =
    type === "crypto"
      ? Number(qs("#cryptoQty").value || 0)
      : type === "mf"
      ? Number(qs("#mfQty").value || 0)
      : Number(qs("#qtyInput").value || 0);
  const price =
    type === "crypto"
      ? STATE.cryptoPrice
      : type === "mf"
      ? STATE.mfPrice
      : STATE.currentPrice;
  if (qty <= 0) return alert("Quantity must be > 0");
  const total = qty * price;

  if (side === "BUY") {
    if (STATE.balance < total) return alert("Insufficient balance");
    STATE.balance -= total;
    const key =
      type === "crypto"
        ? STATE.selectedCrypto.id
        : type === "mf"
        ? STATE.selectedMF.symbol
        : STATE.selected.symbol;
    const name =
      type === "crypto"
        ? CRYPTO.find((c) => c.id === key)?.name || key
        : type === "mf"
        ? DEMO_MF.find((m) => m.symbol === key)?.name || key
        : DEMO_STOCKS.find((s) => s.symbol === key)?.name || key;
    upsertHolding(type, key, name, qty, price, +1);
    pushTrade(type, side, key, name, qty, price, total);

    // Auto-add bought MF/Crypto to Watchlist
    if (type === "mf" && !STATE.mfWatchlist.includes(key)) {
      STATE.mfWatchlist.push(key);
      renderMFWatchlist();
    }
    if (type === "crypto" && !STATE.cryptoWatch.includes(key)) {
      STATE.cryptoWatch.push(key);
    }
  } else {
    const key =
      type === "crypto"
        ? STATE.selectedCrypto.id
        : type === "mf"
        ? STATE.selectedMF.symbol
        : STATE.selected.symbol;
    const idx = STATE.holdings.findIndex(
      (h) =>
        h.type === type &&
        ((type === "crypto" && h.id === key) ||
          (type !== "crypto" && h.symbol === key))
    );
    if (idx < 0 || STATE.holdings[idx].qty < qty)
      return alert("Insufficient holdings");
    STATE.balance += total;
    upsertHolding(type, key, "", qty, price, -1);
    const name =
      type === "crypto"
        ? CRYPTO.find((c) => c.id === key)?.name || key
        : type === "mf"
        ? DEMO_MF.find((m) => m.symbol === key)?.name || key
        : DEMO_STOCKS.find((s) => s.symbol === key)?.name || key;
    pushTrade(type, side, key, name, qty, price, total);
  }
  save();
  updateBalanceSummary();
  renderPortfolio();
  renderOrders();
  renderCryptoOrders();
  renderMFOrders();
  computeAndRenderPerformance();
  const niceKey =
    type === "crypto"
      ? STATE.selectedCrypto.id
      : type === "mf"
      ? STATE.selectedMF.symbol
      : STATE.selected.symbol;
  alert(`${side} executed: ${niceKey} x ${qty} @ ${currency(price)}`);
}
function renderOrders() {
  const container = qs("#ordersList");
  const items = STATE.trades
    .filter((t) => t.type === "stock")
    .slice(0, 10)
    .map((t) => {
      const cls = t.side === "BUY" ? "pos" : "neg";
      return `<div class="item">
            <div><div class="sym">${t.symbol} • ${
        t.name
      }</div><div class="muted">${new Date(t.ts).toLocaleString()}</div></div>
            <div style="text-align:right;">
              <div class="${cls}">${t.side}</div>
              <div class="muted">${t.qty} @ ${currency(t.price)}</div>
            </div>
        </div>`;
    })
    .join("");
  container.innerHTML = items || `<div class="muted">No orders yet.</div>`;
  qs("#ordersCount").textContent = STATE.trades.filter(
    (t) => t.type === "stock"
  ).length;
}

// ====== IPO ======
function renderIPO() {
  const list = qs("#ipoList");
  list.innerHTML = DEMO_IPO.map(
    (ip) => `
        <div class="ipo-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="sym">${ip.name}</div>
            <span class="chip">${ip.status}</span>
          </div>
          <div class="muted">${ip.code}</div>
          <div class="row" style="margin-top:6px;">
            <div><div class="k">Price</div><div class="v">${currency(
              ip.price
            )}</div></div>
            <div><div class="k">Lot Size</div><div class="v">${
              ip.lot
            }</div></div>
          </div>
          <div class="row" style="margin-top:6px;">
            <div><div class="k">Opens</div><div class="v">${ip.open}</div></div>
            <div><div class="k">Closes</div><div class="v">${
              ip.close
            }</div></div>
          </div>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <input class="input" id="ipoQty-${
              ip.code
            }" type="number" min="1" step="1" value="1" />
            <button class="btn" onclick="applyIPO('${ip.code}')">Apply</button>
          </div>
          <div class="note">Virtual apply: lots x lot-size x price is blocked from balance</div>
        </div>
      `
  ).join("");

  renderIPOOrders();
}
function applyIPO(code) {
  if (!STATE.user) return alert("Please start (login) to apply.");
  const ip = DEMO_IPO.find((x) => x.code === code);
  const lots = Number(qs(`#ipoQty-${code}`).value || 0);
  if (lots <= 0) return alert("Enter lots > 0");
  const qty = lots * ip.lot;
  const total = qty * ip.price;
  if (STATE.balance < total) return alert("Insufficient balance");

  STATE.balance -= total;
  upsertHolding("ipo", code, ip.name, qty, ip.price, +1);
  pushTrade("ipo", "BUY", code, ip.name, qty, ip.price, total);
  save();
  updateBalanceSummary();
  renderPortfolio();
  renderIPOOrders();
  computeAndRenderPerformance();
  alert(`IPO Applied: ${ip.name} • ${lots} lot(s) • ${qty} shares`);
}
function renderIPOOrders() {
  const container = qs("#ipoOrdersList");
  const items = STATE.trades
    .filter((t) => t.type === "ipo")
    .slice(0, 10)
    .map(
      (t) => `
        <div class="item">
          <div><div class="sym">${t.symbol} • ${
        t.name
      }</div><div class="muted">${new Date(t.ts).toLocaleString()}</div></div>
          <div style="text-align:right;"><div class="pos">${
            t.side
          }</div><div class="muted">${t.qty} @ ${currency(t.price)}</div></div>
        </div>
      `
    )
    .join("");
  container.innerHTML =
    items || `<div class="muted">No IPO applications yet.</div>`;
  qs("#ipoOrdersCount").textContent = STATE.trades.filter(
    (t) => t.type === "ipo"
  ).length;
}

// ====== Portfolio & P/L table ======
async function renderPortfolio() {
  const tbody = qs("#portfolioTable tbody");
  for (const h of STATE.holdings) {
    if (h.type === "stock") {
      if (h.symbol === STATE.selected.symbol) h.last = STATE.currentPrice;
      else {
        const s = await getSeriesStock(h.symbol, 60);
        h.last = s[s.length - 1]?.close || h.last || h.avg;
      }
    } else if (h.type === "crypto") {
      if (h.id === STATE.selectedCrypto.id) h.last = STATE.cryptoPrice;
      else {
        const s = await getSeriesCrypto(h.id, 60);
        h.last = s[s.length - 1]?.close || h.last || h.avg;
      }
    } else if (h.type === "ipo") {
      h.last = h.last || h.avg;
    } else if (h.type === "mf") {
      if (h.symbol === STATE.selectedMF.symbol) h.last = STATE.mfPrice;
      else {
        const s = await getSeriesMF(h.symbol, 60);
        h.last = s[s.length - 1]?.close || h.last || h.avg;
      }
    }
  }
  const rows = STATE.holdings
    .map((h) => {
      const ltp = h.last || h.avg;
      const pnl = (ltp - h.avg) * h.qty;
      const val = ltp * h.qty;
      const qtyDisp =
        h.type === "crypto"
          ? h.qty.toFixed(4)
          : h.type === "mf"
          ? h.qty.toFixed(2)
          : h.qty.toFixed(0);
      return `
          <tr>
            <td>${h.name || h.symbol || h.id}</td>
            <td><span class="pill-type">${h.type.toUpperCase()}</span></td>
            <td>${qtyDisp}</td>
            <td>${currency(h.avg)}</td>
            <td>${currency(ltp)}</td>
            <td class="${pnl >= 0 ? "pos" : "neg"}">${currency(pnl)}</td>
            <td>${currency(val)}</td>
          </tr>
        `;
    })
    .join("");
  tbody.innerHTML =
    rows || `<tr><td colspan="7" class="muted">No holdings yet.</td></tr>`;
  updateBalanceSummary();
  renderHistory();
}
function renderHistory() {
  const container = qs("#historyList");
  const items = STATE.trades
    .slice(0, 50)
    .map(
      (t) => `
        <div class="item" onclick="focusFromHistory('${t.type}', '${
        t.symbol
      }')">
          <div><div class="sym">${t.symbol} • ${
        t.name
      }</div><div class="muted">${new Date(t.ts).toLocaleString()}</div></div>
          <div style="text-align:right;">
            <div class="${
              t.side === "BUY" ? "pos" : "neg"
            }">${t.type.toUpperCase()} ${t.side}</div>
            <div class="muted">${t.qty} @ ${currency(t.price)} • ${currency(
        t.total
      )}</div>
          </div>
        </div>
      `
    )
    .join("");
  container.innerHTML = items || `<div class="muted">No trades yet.</div>`;
}
window.focusFromHistory = async function (type, symbol) {
  if (type === "stock") {
    switchTab("stocks");
    await selectStock(symbol);
  } else if (type === "crypto") {
    switchTab("crypto");
    const id =
      (CRYPTO.find((c) => c.symbol === symbol) || {}).id ||
      symbol.toLowerCase();
    await selectCrypto(id);
  } else if (type === "ipo") {
    switchTab("ipo");
  } else if (type === "mf") {
    switchTab("mf");
    await selectMF(symbol);
  }
};

function updateBalanceSummary() {
  const invested = STATE.holdings.reduce((s, h) => s + h.avg * h.qty, 0);
  const current = STATE.holdings.reduce(
    (s, h) => s + (h.last || h.avg) * h.qty,
    0
  );
  const pl = current - invested;
  qs("#statBalance").textContent = currency(STATE.balance);
  qs("#statInvested").textContent = currency(current);
  const el = qs("#statPL");
  el.textContent = currency(pl);
  el.className = "stat-value " + (pl >= 0 ? "pos" : "neg");
  qs("#tradeBalance").textContent = currency(STATE.balance);
  qs("#cryptoBalance").textContent = currency(STATE.balance);
  const mfBalEl = qs("#mfBalance");
  if (mfBalEl) mfBalEl.textContent = currency(STATE.balance);
}

// ====== Watchlist & Wishlist (Stocks) ======
function renderWatchlist() {
  const wl = qs("#watchlist");
  const stockCards = STATE.watchlist
    .map(
      (sym) => `
        <div class="item">
          <div onclick="selectStock('${sym}')"><div class="sym">${sym}</div><div class="muted">${
        DEMO_STOCKS.find((s) => s.symbol === sym)?.name || "Stock"
      }</div></div>
          <div style="display:flex; gap:6px;">
            <button class="btn alt" onclick="quickBuySym('${sym}')">Buy</button>
            <button class="btn ghost" onclick="addToWishlist('${sym}')">❤</button>
          </div>
        </div>
      `
    )
    .join("");
  wl.innerHTML =
    stockCards || '<div class="muted">No stocks in watchlist</div>';
}
function renderWishlist() {
  const wl = qs("#wishlist");
  const cards = STATE.wishlist
    .map(
      (sym) => `
        <div class="item">
          <div onclick="selectStock('${sym}')"><div class="sym">${sym}</div><div class="muted">${
        DEMO_STOCKS.find((s) => s.symbol === sym)?.name || "Stock"
      }</div></div>
          <div style="display:flex; gap:6px;">
            <button class="btn alt" onclick="quickBuySym('${sym}')">Buy</button>
            <button class="btn ghost" onclick="removeFromWishlist('${sym}')">Remove</button>
          </div>
        </div>
      `
    )
    .join("");
  wl.innerHTML = cards || '<div class="muted">Empty wishlist</div>';
}
window.addToWishlist = function (sym) {
  if (!STATE.wishlist.includes(sym)) STATE.wishlist.push(sym);
  save();
  renderWishlist();
};
window.removeFromWishlist = function (sym) {
  STATE.wishlist = STATE.wishlist.filter((s) => s !== sym);
  save();
  renderWishlist();
};
window.quickBuySym = async function (sym) {
  switchTab("stocks");
  await selectStock(sym);
  qs("#qtyInput").value = 1;
};

// ====== Watchlist & Wishlist (Mutual Funds) ======
function renderMFWatchlist() {
  const wl = qs("#mfWatchlist");
  const cards = STATE.mfWatchlist
    .map(
      (sym) => `
        <div class="item">
          <div onclick="selectMF('${sym}')"><div class="sym">${sym}</div><div class="muted">${
        DEMO_MF.find((m) => m.symbol === sym)?.name || "Mutual Fund"
      }</div></div>
          <div style="display:flex; gap:6px;">
            <button class="btn alt" onclick="quickBuyMF('${sym}')">Buy</button>
            <button class="btn ghost" onclick="addMFToWishlist('${sym}')">❤</button>
          </div>
        </div>
      `
    )
    .join("");
  wl.innerHTML =
    cards || '<div class="muted">No mutual funds in watchlist</div>';
}
function renderMFWishlist() {
  const wl = qs("#mfWishlist");
  const cards = STATE.mfWishlist
    .map(
      (sym) => `
        <div class="item">
          <div onclick="selectMF('${sym}')"><div class="sym">${sym}</div><div class="muted">${
        DEMO_MF.find((m) => m.symbol === sym)?.name || "Mutual Fund"
      }</div></div>
          <div style="display:flex; gap:6px;">
            <button class="btn alt" onclick="quickBuyMF('${sym}')">Buy</button>
            <button class="btn ghost" onclick="removeMFfromWishlist('${sym}')">Remove</button>
          </div>
        </div>
      `
    )
    .join("");
  wl.innerHTML = cards || '<div class="muted">Empty MF wishlist</div>';
}
window.addMFToWishlist = function (sym) {
  if (!STATE.mfWishlist.includes(sym)) STATE.mfWishlist.push(sym);
  save();
  renderMFWishlist();
};
window.removeMFfromWishlist = function (sym) {
  STATE.mfWishlist = STATE.mfWishlist.filter((s) => s !== sym);
  save();
  renderMFWishlist();
};
window.quickBuyMF = async function (sym) {
  switchTab("mf");
  await selectMF(sym);
  qs("#mfQty").value = 1.0;
};

// ====== Crypto & MF Recommendations ======
function norm(v, min, max) {
  return Math.max(0, Math.min(1, (v - min) / (max - min)));
}

function scoreSeriesCrypto(series) {
  const closes = series.map((s) => s.close);
  if (closes.length < 40)
    return {
      score: 0,
      r7d: 0,
      r30d: 0,
      vol: 0,
      draw: 0,
      slope: 0,
      reasons: ["Insufficient data"],
    };
  const last = closes[closes.length - 1];
  const idx = (d) => Math.max(0, closes.length - 1 - d);
  const retN = (d) => ((last - closes[idx(d)]) / closes[idx(d)]) * 100;

  const r7d = retN(7);
  const r30d = retN(30);

  const logs = [];
  for (let i = 1; i < closes.length; i++) {
    logs.push(Math.log(closes[i] / closes[i - 1]));
  }
  const last30 = logs.slice(-30);
  const vol =
    Math.sqrt(
      last30.reduce((s, x) => s + x * x, 0) / Math.max(1, last30.length)
    ) * Math.sqrt(365);

  const n = Math.min(120, closes.length);
  const y = closes.slice(-n).map(Math.log);
  const x = Array.from({ length: n }, (_, i) => i + 1);
  const xbar = x.reduce((s, v) => s + v, 0) / n,
    ybar = y.reduce((s, v) => s + v, 0) / n;
  let num = 0,
    den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - xbar) * (y[i] - ybar);
    den += (x[i] - xbar) * (x[i] - xbar);
  }
  const slope = (den ? num / den : 0) * 365;

  const arr = closes.slice(-90);
  let peak = arr[0],
    mdd = 0;
  for (const p of arr) {
    peak = Math.max(peak, p);
    mdd = Math.min(mdd, (p - peak) / peak);
  }
  const draw = Math.abs(mdd) * 100;

  const s30 = norm(r30d, -30, 60);
  const s7 = norm(r7d, -10, 20);
  const sSlope = norm(slope * 100, -25, 40);
  const sVolPenalty = 1 - norm(vol, 0.2, 1.2);
  const sDrawPenalty = 1 - norm(draw, 10, 50);

  const score = Math.round(
    (0.45 * s30 +
      0.25 * s7 +
      0.2 * sSlope +
      0.05 * sVolPenalty +
      0.05 * sDrawPenalty) *
      100
  );

  const reasons = [];
  reasons.push(`30d ${pct(r30d)}`);
  reasons.push(`7d ${pct(r7d)}`);
  reasons.push(vol < 0.4 ? "Low vol" : vol < 0.8 ? "Med vol" : "High vol");
  reasons.push(draw < 20 ? "Shallow drawdowns" : "Deep drawdowns");

  return { score, r7d, r30d, vol, draw, slope, reasons };
}

function scoreSeriesStocksMF(series) {
  // Reuse stock-style scoring for MF
  const closes = series.map((s) => s.close);
  if (closes.length < 40) return { score: 0, reasons: ["Insufficient data"] };
  const last = closes[closes.length - 1];
  const idx = (d) => Math.max(0, closes.length - 1 - d);
  const retN = (d) => ((last - closes[idx(d)]) / closes[idx(d)]) * 100;

  const r1m = retN(21);
  const r3m = retN(63);

  const logs = [];
  for (let i = 1; i < closes.length; i++) {
    logs.push(Math.log(closes[i] / closes[i - 1]));
  }
  const last60 = logs.slice(-60);
  const vol =
    Math.sqrt(
      last60.reduce((s, x) => s + x * x, 0) / Math.max(1, last60.length)
    ) * Math.sqrt(252);

  const n = Math.min(120, closes.length);
  const y = closes.slice(-n).map(Math.log);
  const x = Array.from({ length: n }, (_, i) => i + 1);
  const xbar = x.reduce((s, v) => s + v, 0) / n,
    ybar = y.reduce((s, v) => s + v, 0) / n;
  let num = 0,
    den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - xbar) * (y[i] - ybar);
    den += (x[i] - xbar) * (x[i] - xbar);
  }
  const slope = (den ? num / den : 0) * 252;

  const arr = closes.slice(-180);
  let peak = arr[0],
    mdd = 0;
  for (const p of arr) {
    peak = Math.max(peak, p);
    mdd = Math.min(mdd, (p - peak) / peak);
  }
  const draw = Math.abs(mdd) * 100;

  const s3m = norm(r3m, -15, 25);
  const s1m = norm(r1m, -8, 12);
  const sSlope = norm(slope * 100, -15, 25);
  const sVolPenalty = 1 - norm(vol, 0.1, 0.6);
  const sDrawPenalty = 1 - norm(draw, 5, 30);

  const score = Math.round(
    (0.4 * s3m +
      0.25 * s1m +
      0.2 * sSlope +
      0.1 * sVolPenalty +
      0.05 * sDrawPenalty) *
      100
  );
  const reasons = [];
  reasons.push(`3M ${pct(r3m)}`);
  reasons.push(`1M ${pct(r1m)}`);
  reasons.push(vol < 0.2 ? "Low vol" : vol < 0.35 ? "Med vol" : "High vol");
  reasons.push(draw < 12 ? "Shallow drawdowns" : "Deep drawdowns");
  return { score, reasons };
}

async function refreshCryptoRecommendations() {
  const listEl = qs("#cryptoRecoList");
  if (listEl) listEl.innerHTML = `<div class="muted">Calculating...</div>`;
  const candidates = Array.from(
    new Set([...STATE.cryptoWatch, ...CRYPTO.map((c) => c.id)])
  ).slice(0, 20);

  const scored = [];
  for (const id of candidates) {
    try {
      const ser = await getSeriesCrypto(id, 200);
      if (!ser || ser.length < 40) continue;
      const sc = scoreSeriesCrypto(ser);
      const meta = CRYPTO.find((c) => c.id === id) || {
        symbol: id.toUpperCase(),
        name: id,
      };
      scored.push({ id, symbol: meta.symbol, name: meta.name, ...sc });
    } catch (_) {}
  }
  scored.sort((a, b) => b.score - a.score);
  renderCryptoRecommendations(scored.slice(0, 8));
}
function renderCryptoRecommendations(list) {
  const el = qs("#cryptoRecoList");
  if (!el) return;
  if (!list || !list.length) {
    el.innerHTML = `<div class="muted">No recommendations right now.</div>`;
    return;
  }
  el.innerHTML = list
    .map(
      (p) => `
        <div class="pred-item">
          <div>
            <div class="sym">${p.symbol} • ${p.name}</div>
            <div class="pred-meta">${p.reasons.join(" • ")}</div>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <div class="scorebar"><div class="scorefill" style="width:${
              p.score
            }%"></div></div>
            <div class="chip">${p.score}/100</div>
            <div class="pred-actions">
              <button class="btn alt" onclick="switchTab('crypto'); selectCrypto('${
                p.id
              }')">View</button>
              <button class="btn" onclick="quickBuyCrypto('${
                p.id
              }')">Buy</button>
              <button class="btn ghost" onclick="addCryptoToWatchlist('${
                p.id
              }')">+ Watch</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}
window.quickBuyCrypto = async function (id) {
  switchTab("crypto");
  await selectCrypto(id);
  qs("#cryptoQty").value = "0.01";
};
window.addCryptoToWatchlist = function (id) {
  if (!STATE.cryptoWatch.includes(id)) STATE.cryptoWatch.push(id);
  save();
};

async function refreshMFRecommendations() {
  const el = qs("#mfRecoList");
  if (el) el.innerHTML = `<div class="muted">Calculating...</div>`;
  const candidates = Array.from(
    new Set([...STATE.mfWatchlist, ...DEMO_MF.map((m) => m.symbol)])
  ).slice(0, 20);

  const scored = [];
  for (const sym of candidates) {
    try {
      const ser = await getSeriesMF(sym, 260);
      if (!ser || ser.length < 40) continue;
      const sc = scoreSeriesStocksMF(ser);
      const meta = DEMO_MF.find((m) => m.symbol === sym) || { name: sym };
      scored.push({ symbol: sym, name: meta.name, ...sc });
    } catch (_) {}
  }
  scored.sort((a, b) => b.score - a.score);
  renderMFRecommendations(scored.slice(0, 8));
}
function renderMFRecommendations(list) {
  const el = qs("#mfRecoList");
  if (!el) return;
  if (!list || !list.length) {
    el.innerHTML = `<div class="muted">No recommendations right now.</div>`;
    return;
  }
  el.innerHTML = list
    .map(
      (p) => `
        <div class="pred-item">
          <div>
            <div class="sym">${p.symbol} • ${p.name}</div>
            <div class="pred-meta">${p.reasons.join(" • ")}</div>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <div class="scorebar"><div class="scorefill" style="width:${
              p.score
            }%"></div></div>
            <div class="chip">${p.score}/100</div>
            <div class="pred-actions">
              <button class="btn alt" onclick="switchTab('mf'); selectMF('${
                p.symbol
              }')">View</button>
              <button class="btn" onclick="quickBuyMF('${
                p.symbol
              }')">Buy</button>
              <button class="btn ghost" onclick="addMFToWishlist('${
                p.symbol
              }')">❤</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

on(qs("#refreshCryptoReco"), "click", refreshCryptoRecommendations);
on(qs("#refreshMFReco"), "click", refreshMFRecommendations);

// ====== Prediction Bar (stocks) ======
on(qs("#refreshPred"), "click", refreshPredictions);

async function refreshPredictions() {
  const candidates = Array.from(
    new Set([
      ...STATE.watchlist,
      ...DEMO_STOCKS.slice(0, 12).map((s) => s.symbol),
    ])
  ).slice(0, 20);

  qs("#predList").innerHTML = `<div class="muted">Calculating...</div>`;

  const scored = [];
  for (const sym of candidates) {
    const ser = await getSeriesStock(sym, 260); // ~1Y
    if (ser.length < 40) continue;
    const score = scoreSeriesStocksMF(ser);
    const name = DEMO_STOCKS.find((s) => s.symbol === sym)?.name || sym;
    scored.push({ symbol: sym, name, ...score });
  }
  scored.sort((a, b) => b.score - a.score);
  STATE.predictions = scored.slice(0, 8);
  renderPredictions();
}

function renderPredictions() {
  const list = qs("#predList");
  if (!STATE.predictions.length) {
    list.innerHTML = `<div class="muted">No predictions yet.</div>`;
    return;
  }
  list.innerHTML = STATE.predictions
    .map(
      (p) => `
        <div class="pred-item">
          <div>
            <div class="sym">${p.symbol} • ${p.name}</div>
            <div class="pred-meta">${p.reasons.join(" • ")}</div>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <div class="scorebar"><div class="scorefill" style="width:${
              p.score
            }%"></div></div>
            <div class="chip">${p.score}/100</div>
            <div class="pred-actions">
              <button class="btn alt" onclick="selectStock('${
                p.symbol
              }')">View</button>
              <button class="btn" onclick="quickBuySym('${
                p.symbol
              }')">Buy</button>
              <button class="btn ghost" onclick="addToWishlist('${
                p.symbol
              }')">❤</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

// ====== Portfolio Performance (Month & YTD) ======
let monthChart, monthSeries, ytdChart, ytdSeries;

function dayStart(tsMs) {
  const d = new Date(tsMs);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function rangeDays(startMs, endMs) {
  const out = [];
  for (let t = dayStart(startMs); t <= dayStart(endMs); t += 86400000)
    out.push(t);
  return out;
}
function getPriceOnOrBefore(series, tSec) {
  let price = series[0]?.close || 0;
  for (let i = 0; i < series.length; i++) {
    if (series[i].time * 1000 <= tSec) price = series[i].close;
    else break;
  }
  return price;
}
function assetTrades(assetKey, isCrypto = false) {
  return STATE.trades
    .filter((t) =>
      isCrypto
        ? t.type === "crypto" &&
          (t.symbol.toLowerCase() === assetKey ||
            t.symbol === assetKey.toUpperCase())
        : t.type === "stock" && t.symbol === assetKey
    )
    .map((t) => ({
      ts: new Date(t.ts).getTime(),
      qty: (t.side === "BUY" ? +1 : -1) * t.qty,
      price: t.price,
    }))
    .sort((a, b) => a.ts - b.ts);
}
function ipoTrades(assetKey) {
  return STATE.trades
    .filter((t) => t.type === "ipo" && t.symbol === assetKey)
    .map((t) => ({
      ts: new Date(t.ts).getTime(),
      qty: (t.side === "BUY" ? +1 : -1) * t.qty,
      price: t.price,
    }))
    .sort((a, b) => a.ts - b.ts);
}

async function computeEquitySeries(startMs, endMs) {
  const days = rangeDays(startMs, endMs);
  if (!days.length) return { equity: [] };

  const assets = [];
  const stockSyms = Array.from(
    new Set([
      ...STATE.holdings.filter((h) => h.type === "stock").map((h) => h.symbol),
      ...STATE.trades.filter((t) => t.type === "stock").map((t) => t.symbol),
    ])
  );
  for (const sym of stockSyms) {
    const series = await getSeriesStock(sym, 500);
    assets.push({
      key: sym,
      type: "stock",
      series,
      trades: assetTrades(sym, false),
    });
  }
  const cryptoIds = Array.from(
    new Set([
      ...STATE.holdings.filter((h) => h.type === "crypto").map((h) => h.id),
      ...STATE.trades
        .filter((t) => t.type === "crypto")
        .map((t) => t.symbol.toLowerCase()),
    ])
  );
  for (const id of cryptoIds) {
    const series = await getSeriesCrypto(id, 365);
    assets.push({
      key: id,
      type: "crypto",
      series,
      trades: assetTrades(id, true),
    });
  }
  const ipoSyms = Array.from(
    new Set([
      ...STATE.holdings.filter((h) => h.type === "ipo").map((h) => h.symbol),
      ...STATE.trades.filter((t) => t.type === "ipo").map((t) => t.symbol),
    ])
  );
  for (const sym of ipoSyms) {
    const price =
      STATE.holdings.find((h) => h.type === "ipo" && h.symbol === sym)?.last ||
      STATE.trades.find((t) => t.type === "ipo" && t.symbol === sym)?.price ||
      0;
    const baseTs = dayStart(startMs) / 1000;
    const series = [{ time: Math.floor(baseTs), close: price }];
    assets.push({ key: sym, type: "ipo", series, trades: ipoTrades(sym) });
  }

  // Mutual Funds
  const mfSyms = Array.from(
    new Set([
      ...STATE.holdings.filter((h) => h.type === "mf").map((h) => h.symbol),
      ...STATE.trades.filter((t) => t.type === "mf").map((t) => t.symbol),
    ])
  );
  for (const sym of mfSyms) {
    const series = await getSeriesMF(sym, 500);
    const trades = STATE.trades
      .filter((t) => t.type === "mf" && t.symbol === sym)
      .map((t) => ({
        ts: new Date(t.ts).getTime(),
        qty: (t.side === "BUY" ? +1 : -1) * t.qty,
        price: t.price,
      }))
      .sort((a, b) => a.ts - b.ts);
    assets.push({ key: sym, type: "mf", series, trades });
  }

  const tradesAll = STATE.trades
    .map((t) => ({
      ts: new Date(t.ts).getTime(),
      type: t.type,
      side: t.side,
      qty: t.qty,
      price: t.price,
      sym: t.symbol,
    }))
    .sort((a, b) => a.ts - b.ts);
  const initCash = CONFIG.initialBalance;
  let cash = initCash;
  let tradeIdx = 0;
  const cashByDay = [];

  const qtyByAsset = {};
  for (const a of assets) qtyByAsset[a.key] = 0;

  for (const day of days) {
    while (
      tradeIdx < tradesAll.length &&
      dayStart(tradesAll[tradeIdx].ts) <= day
    ) {
      const tr = tradesAll[tradeIdx];
      const amt = tr.qty * tr.price;
      if (tr.side === "BUY") cash -= amt;
      else cash += amt;
      const key =
        tr.type === "crypto"
          ? tr.sym.toLowerCase()
          : tr.type === "stock" || tr.type === "ipo" || tr.type === "mf"
          ? tr.sym
          : tr.sym;
      if (!(key in qtyByAsset)) qtyByAsset[key] = 0;
      qtyByAsset[key] += tr.side === "BUY" ? tr.qty : -tr.qty;
      tradeIdx++;
    }
    cashByDay.push({ time: Math.floor(day / 1000), cash });
  }

  const equity = [];
  for (let i = 0; i < days.length; i++) {
    const tMs = days[i];
    let val = cashByDay[i].cash;
    for (const a of assets) {
      const key = a.key;
      const qty = qtyByAsset[key] || 0;
      const price = getPriceOnOrBefore(a.series, tMs);
      val += qty * price;
    }
    equity.push({ time: Math.floor(tMs / 1000), value: val });
  }

  return { equity };
}

function sumPL(series) {
  if (!series.length) return 0;
  const base = series[0].value;
  const last = series[series.length - 1].value;
  return last - base;
}

async function computeAndRenderPerformance() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const ytdStart = new Date(now.getFullYear(), 0, 1).getTime();
  const end = now.getTime();

  const { equity: eqM } = await computeEquitySeries(monthStart, end);
  const { equity: eqY } = await computeEquitySeries(ytdStart, end);

  const monthPld = [];
  for (let i = 0; i < eqM.length; i++) {
    const prev = i === 0 ? eqM[0].value : eqM[i - 1].value;
    const delta = eqM[i].value - prev;
    monthPld.push({
      time: eqM[i].time,
      value: delta,
      color: delta >= 0 ? "#27d980" : "#ff6b6b",
    });
  }
  const baseY = eqY[0]?.value || 0;
  const ytdCum = eqY.map((p) => ({ time: p.time, value: p.value - baseY }));

  const mc = ensureChart("equityMonthChart", {
    rightPriceScale: { visible: false },
    timeScale: { timeVisible: false },
  });
  monthSeries = newHistogramSeries(mc);
  monthSeries.setData(monthPld);

  const yc = ensureChart("equityYTDChart", {
    rightPriceScale: { visible: false },
    timeScale: { timeVisible: false },
  });
  ytdSeries = yc.addAreaSeries({
    lineColor: "#5be7c4",
    topColor: "rgba(91,231,196,.35)",
    bottomColor: "rgba(91,231,196,0)",
    lineWidth: 2,
  });
  ytdSeries.setData(ytdCum);

  const monthPL = sumPL(eqM);
  const ytdPL = sumPL(eqY);
  qs("#perfSummary").textContent = `Month P&L: ${currency(
    monthPL
  )} | YTD: ${currency(ytdPL)}`;
}

// ====== Index Bar (NIFTY • SENSEX • BANKNIFTY) ======
async function getIndexData() {
  try {
    const url =
      "https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5ENSEI,%5EBSESN,%5ENSEBANK";
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("Yahoo fetch failed");
    const j = await r.json();
    const rows =
      j && j.quoteResponse && j.quoteResponse.result
        ? j.quoteResponse.result
        : [];
    const bySymbol = {};
    rows.forEach((row) => {
      bySymbol[row.symbol] = row;
    });
    const list = [
      { label: "NIFTY 50", symbol: "^NSEI" },
      { label: "SENSEX", symbol: "^BSESN" },
      { label: "BANKNIFTY", symbol: "^NSEBANK" },
    ].map((x) => {
      const r = bySymbol[x.symbol] || {};
      const price = Number(
        r.regularMarketPrice || r.ask || r.bid || r.previousClose || 0
      );
      const chgPct = Number(r.regularMarketChangePercent || 0);
      return { label: x.label, price, chgPct };
    });
    return list;
  } catch (err) {
    const now = Date.now();
    const baseSeed = Math.floor(now / 60000);
    const seeded = (s) => {
      let x = s;
      return () => (x = (x * 1664525 + 1013904223) % 4294967296) / 4294967296;
    };
    const r1 = seeded(baseSeed + 1),
      r2 = seeded(baseSeed + 2),
      r3 = seeded(baseSeed + 3);
    const w = (rand, base, span) =>
      Math.round((base + (rand() - 0.5) * span) * 100) / 100;
    return [
      {
        label: "NIFTY 50",
        price: w(r1, 23000, 120),
        chgPct: Math.round((r1() - 0.5) * 2 * 100) / 10,
      },
      {
        label: "SENSEX",
        price: w(r2, 76000, 350),
        chgPct: Math.round((r2() - 0.5) * 2 * 100) / 10,
      },
      {
        label: "BANKNIFTY",
        price: w(r3, 48000, 220),
        chgPct: Math.round((r3() - 0.5) * 2 * 100) / 10,
      },
    ];
  }
}

function renderIndexBar(list) {
  const el = qs("#indexBar");
  if (!el) return;
  if (!list || !list.length) {
    el.innerHTML = '<div class="muted">No index data</div>';
    return;
  }
  el.innerHTML = list
    .map((d) => {
      const cls = d.chgPct >= 0 ? "idx-chg pos" : "idx-chg neg";
      const arrow = d.chgPct >= 0 ? "▲" : "▼";
      const value = (d.price || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      });
      const chg = (d.chgPct || 0).toFixed(2) + "%";
      return `
          <div class="idx-tile">
            <div class="idx-name">${d.label}</div>
            <div class="idx-value">${value}</div>
            <div class="${cls}">${arrow} ${chg}</div>
          </div>
        `;
    })
    .join("");
}

async function refreshIndicesOnce() {
  try {
    const list = await getIndexData();
    renderIndexBar(list);
  } catch (_) {
    renderIndexBar([]);
  }
}

function bootIndexBar() {
  refreshIndicesOnce();
  setInterval(refreshIndicesOnce, 30000);
}

// ====== UI bindings for search Enter key ======
on(qs("#stockSearch"), "keydown", async (e) => {
  if (e.key === "Enter") {
    const s = (qs("#stockSearch").value || "").trim().toUpperCase();
    if (s) {
      await selectStock(s);
      if (!STATE.watchlist.includes(s)) {
        STATE.watchlist.push(s);
        save();
        renderWatchlist();
        refreshPredictions();
      }
    }
  }
});

// ====== Export JSON ======
on(qs("#exportBtn"), "click", () => {
  if (!STATE.user) return alert("Please login first.");
  const data = {
    user: STATE.user,
    balance: STATE.balance,
    holdings: STATE.holdings,
    trades: STATE.trades,
    watchlist: STATE.watchlist,
    wishlist: STATE.wishlist,
    mfWatchlist: STATE.mfWatchlist,
    mfWishlist: STATE.mfWishlist,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tradex_portfolio_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

// ====== Init ======
function renderAll() {
  renderWatchlist();
  renderWishlist();
  renderMFWatchlist();
  renderMFWishlist();
  renderIPO();
  renderPortfolio();
  renderOrders();
  renderCryptoOrders();
  renderMFOrders();
}

(async function boot() {
  updateUserUI();
  renderAll();
  await selectStock(STATE.selected.symbol);
  await selectCrypto(STATE.selectedCrypto.id);
  await selectMF(STATE.selectedMF.symbol);
  refreshPredictions();
  refreshCryptoRecommendations();
  refreshMFRecommendations();
  computeAndRenderPerformance();
  bootIndexBar(); // Start the index bar updates
})();
