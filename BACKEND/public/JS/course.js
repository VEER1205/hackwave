// ====== NAV ======
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initNavLinks();
  initPersistence();
  initCourseEnrollment();
  initMaterialModal();
});

function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      mobileToggle.querySelector("i").classList.toggle("fa-bars");
      mobileToggle.querySelector("i").classList.toggle("fa-times");
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
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        document.querySelector("#mobileToggle i").classList.remove("fa-times");
        document.querySelector("#mobileToggle i").classList.add("fa-bars");
      }
    });
  });
}

// ====== STORAGE HELPERS ======
const LS = {
  coinsKey: "tmpro:coins",
  enrolKey: (id) => `tmpro:enrolled:${id}`,
  testKey: (id) => `tmpro:test:${id}`,
  nameKey: "tmpro:profileName",
};
function getCoins() {
  return parseInt(localStorage.getItem(LS.coinsKey) || "1000", 10);
}
function setCoins(v) {
  localStorage.setItem(LS.coinsKey, String(v));
}
function isEnrolled(id) {
  return localStorage.getItem(LS.enrolKey(id)) === "1";
}
function setEnrolled(id) {
  localStorage.setItem(LS.enrolKey(id), "1");
}
function getTestState(id) {
  try {
    return JSON.parse(localStorage.getItem(LS.testKey(id)) || "{}");
  } catch {
    return {};
  }
}
function setTestState(id, obj) {
  localStorage.setItem(LS.testKey(id), JSON.stringify(obj || {}));
}
function getProfileName() {
  return localStorage.getItem(LS.nameKey) || "";
}
function setProfileName(name) {
  localStorage.setItem(LS.nameKey, name || "");
}

function initPersistence() {
  // Wallet
  const coinEl = document.getElementById("user-coin-balance");
  coinEl.textContent = getCoins();

  // Enroll buttons state + View Material
  document.querySelectorAll(".course-card").forEach((card) => {
    const id = card.dataset.courseId;
    const btn = card.querySelector(".btn-enroll");
    if (isEnrolled(id)) {
      btn.textContent = "Enrolled";
      btn.classList.add("enrolled");
      addViewMaterialButton(
        card,
        id,
        card.querySelector(".course-title").textContent
      );
    }
  });
}

// ====== COURSE MATERIALS ======
// Stable sample files: PDFs/PPT/CSV are demo links. Replace with your own.
const SAMPLE_LINKS = {
  pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  ppt: "https://file-examples.com/wp-content/uploads/2017/08/file_example_PPT_500kB.ppt",
  xlsx: "https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_10.xlsx",
  csv: "https://people.sc.fsu.edu/~jburkardt/data/csv/airtravel.csv",
  img: "https://dummyimage.com/1200x800/0b0f14/ffffff.png&text=Cheat+Sheet",
};

const COURSE_MATERIALS = {
  "intro-stocks": {
    notes: [
      "Stocks vs. Bonds: understanding equity and debt instruments.",
      "Primary market (IPOs) vs. Secondary market (exchanges).",
      "Order types (market/limit/SL), settlement cycles, basics of brokerage.",
    ],
    videos: [
      {
        title: "Stock Market for Beginners",
        url: "https://www.youtube.com/embed/p7HKvqRI_Bo",
      },
      {
        title: "How Stock Exchanges Work",
        url: "https://www.youtube.com/embed/F3QpgXBtDeo",
      },
    ],
    docs: [
      { label: "Syllabus (PDF)", type: "pdf", href: SAMPLE_LINKS.pdf },
      { label: "Lecture Slides (PPT)", type: "ppt", href: SAMPLE_LINKS.ppt },
      { label: "Workbook (XLSX)", type: "xlsx", href: SAMPLE_LINKS.xlsx },
      { label: "Cheat Sheet (PNG)", type: "img", href: SAMPLE_LINKS.img },
      { label: "Sample Dataset (CSV)", type: "csv", href: SAMPLE_LINKS.csv },
    ],
    papers: [
      {
        title: "Efficient Markets Overview (Sample PDF)",
        href: SAMPLE_LINKS.pdf,
      },
      {
        title: "Market Basics Article",
        href: "https://www.investopedia.com/terms/s/stockmarket.asp",
      },
    ],
  },
  candlestick: {
    notes: [
      "Body & wicks: what they mean. Bullish vs. bearish candles.",
      "Reversals: Hammer, Engulfing, Morning/Evening Star; Continuations.",
      "Combine with trend, S/R and volume for context.",
    ],
    videos: [
      {
        title: "Candlestick Patterns Explained",
        url: "https://www.youtube.com/embed/nQOz7i8t6yU",
      },
      {
        title: "10 Powerful Patterns",
        url: "https://www.youtube.com/embed/9bQJX6Q9C6o",
      },
    ],
    docs: [
      {
        label: "Pattern Cheat Sheet (PDF)",
        type: "pdf",
        href: SAMPLE_LINKS.pdf,
      },
      { label: "Slides (PPT)", type: "ppt", href: SAMPLE_LINKS.ppt },
    ],
    papers: [
      {
        title: "A Practitioner’s View on Candlestick Patterns (Sample PDF)",
        href: SAMPLE_LINKS.pdf,
      },
    ],
  },
  fundamentals: {
    notes: [
      "Financial statements: P&L, Balance Sheet, Cash Flow.",
      "Ratios: P/E, ROE, margins, growth, and leverage.",
      "Qualitative factors: moat, mgmt quality, industry dynamics.",
    ],
    videos: [
      {
        title: "Fundamental Analysis Basics",
        url: "https://www.youtube.com/embed/m9aNnJgE6kM",
      },
    ],
    docs: [
      { label: "FA Ratios Guide (PDF)", type: "pdf", href: SAMPLE_LINKS.pdf },
      {
        label: "Valuation Template (XLSX)",
        type: "xlsx",
        href: SAMPLE_LINKS.xlsx,
      },
    ],
    papers: [
      {
        title: "Value Investing Research (SSRN link)",
        href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=249474",
      },
    ],
  },
  "risk-mgmt": {
    notes: [
      "Risk-per-trade and portfolio risk caps (e.g., 1%-2%).",
      "Stop-loss placement, ATR-based sizing, trailing stops.",
      "Diversification and correlation.",
    ],
    videos: [
      {
        title: "Risk Management 101",
        url: "https://www.youtube.com/embed/XbZK8w6nJqk",
      },
    ],
    docs: [
      { label: "Position Sizing (PDF)", type: "pdf", href: SAMPLE_LINKS.pdf },
    ],
    papers: [
      { title: "Risk & Return Overview (Sample PDF)", href: SAMPLE_LINKS.pdf },
    ],
  },
  "adv-indicators": {
    notes: [
      "RSI divergences, MACD signal/histogram.",
      "Bollinger Bands squeeze & breakout logic.",
      "Multi-indicator confluence & false signal filtering.",
    ],
    videos: [
      {
        title: "MACD + RSI Deep Dive",
        url: "https://www.youtube.com/embed/Xm3Vb7Qb6no",
      },
    ],
    docs: [
      {
        label: "Indicator Playbook (PDF)",
        type: "pdf",
        href: SAMPLE_LINKS.pdf,
      },
    ],
    papers: [
      {
        title: "Technical Indicators: A Review (Sample PDF)",
        href: SAMPLE_LINKS.pdf,
      },
    ],
  },
  "crypto-blockchain": {
    notes: [
      "Blockchain: blocks, consensus, wallets, keys.",
      "Bitcoin vs. Altcoins; tokenomics & utility.",
      "On-chain vs off-chain metrics.",
    ],
    videos: [
      {
        title: "Blockchain Explained",
        url: "https://www.youtube.com/embed/SSo_EIwHSd4",
      },
      {
        title: "Crypto Investing Basics",
        url: "https://www.youtube.com/embed/Wn_Kb3MR_cU",
      },
    ],
    docs: [
      { label: "Crypto Glossary (PDF)", type: "pdf", href: SAMPLE_LINKS.pdf },
    ],
    papers: [
      {
        title: "Bitcoin Whitepaper (External)",
        href: "https://bitcoin.org/bitcoin.pdf",
      },
    ],
  },
  psychology: {
    notes: [
      "Biases: overconfidence, loss aversion, recency.",
      "Rules > Emotions. Build systems.",
      "Journaling & review loops.",
    ],
    videos: [
      {
        title: "Trading Psychology Essentials",
        url: "https://www.youtube.com/embed/M69ZfN8c9lY",
      },
    ],
    docs: [
      { label: "Mindset Checklist (PDF)", type: "pdf", href: SAMPLE_LINKS.pdf },
    ],
    papers: [
      {
        title: "Behavioral Finance Primer (Sample PDF)",
        href: SAMPLE_LINKS.pdf,
      },
    ],
  },
  forex: {
    notes: [
      "Pairs, pips, lots; spreads & liquidity.",
      "Leverage & margin; sessions & volatility.",
      "Macro events & rates.",
    ],
    videos: [
      {
        title: "Forex for Beginners",
        url: "https://www.youtube.com/embed/0TnR0_1VNCg",
      },
    ],
    docs: [
      { label: "FX Quick Guide (PDF)", type: "pdf", href: SAMPLE_LINKS.pdf },
    ],
    papers: [
      { title: "FX Market Structure (Sample PDF)", href: SAMPLE_LINKS.pdf },
    ],
  },
  "options-beginners": {
    notes: [
      "Calls/Puts, moneyness (ITM/ATM/OTM), premium & greeks lite.",
      "Covered Call, Protective Put basics.",
      "Risk graphs & break-even.",
    ],
    videos: [
      {
        title: "Options Basics",
        url: "https://www.youtube.com/embed/ES5G-0E1V9E",
      },
    ],
    docs: [
      {
        label: "Options Cheat Sheet (PDF)",
        type: "pdf",
        href: SAMPLE_LINKS.pdf,
      },
    ],
    papers: [{ title: "Options Intro (Sample PDF)", href: SAMPLE_LINKS.pdf }],
  },
};

// ====== TEST BANK ======
const DEFAULT_TEST = [
  {
    q: "What is risk management primarily about?",
    options: [
      "Maximizing profit",
      "Minimizing drawdowns and controlling losses",
      "Finding only winning trades",
      "Averaging down",
    ],
    a: 1,
  },
  {
    q: "A Stop-Loss is used to…",
    options: [
      "Increase position size",
      "Lock in profits only",
      "Limit downside risk",
      "Reduce spreads",
    ],
    a: 2,
  },
  {
    q: "Diversification helps reduce…",
    options: [
      "Transaction costs",
      "Systematic risk",
      "Idiosyncratic risk",
      "Slippage",
    ],
    a: 2,
  },
  {
    q: "Trend-following works best when markets are…",
    options: ["Sideways", "Range-bound", "Strongly directional", "Low volume"],
    a: 2,
  },
  {
    q: "Position sizing is typically based on…",
    options: [
      "Account size and risk per trade",
      "Number of indicators",
      "Broker preference",
      "Spread size only",
    ],
    a: 0,
  },
];
const COURSE_TESTS = {
  "intro-stocks": [
    {
      q: "A stock represents…",
      options: ["Debt", "Equity/ownership", "A bond", "A commodity"],
      a: 1,
    },
    {
      q: "IPO occurs in the…",
      options: [
        "Primary market",
        "Secondary market",
        "Derivative market",
        "Forex",
      ],
      a: 0,
    },
    {
      q: "A limit order…",
      options: [
        "Executes immediately at market",
        "Executes at a specified price or better",
        "Always fails in low liquidity",
        "Is same as stop order",
      ],
      a: 1,
    },
    {
      q: "Settlement cycle refers to…",
      options: [
        "Backtesting duration",
        "Time to deliver shares for a trade",
        "Time to build a portfolio",
        "Exchange opening hours",
      ],
      a: 1,
    },
    {
      q: "An index tracks…",
      options: [
        "Single stock only",
        "A basket of securities",
        "Only bonds",
        "Only FX",
      ],
      a: 1,
    },
  ],
  candlestick: [
    {
      q: "A Doji suggests…",
      options: [
        "Strong bullish trend",
        "Indecision",
        "Guaranteed reversal",
        "Gap up",
      ],
      a: 1,
    },
    {
      q: "Hammer typically appears at…",
      options: [
        "Tops for continuation",
        "Bottoms as reversal signal",
        "Mid-trend only",
        "Earnings",
      ],
      a: 1,
    },
    {
      q: "Bullish Engulfing is when…",
      options: [
        "Small green inside big red",
        "Green fully covers prior red body",
        "Gap down then up",
        "Two equal closes",
      ],
      a: 1,
    },
    {
      q: "Context is important because…",
      options: [
        "Patterns always work",
        "Trend/levels/volume refine signals",
        "Only volume matters",
        "Indicators replace context",
      ],
      a: 1,
    },
    {
      q: "Evening Star suggests…",
      options: [
        "Bullish continuation",
        "Bearish reversal",
        "No info",
        "Volatility crush",
      ],
      a: 1,
    },
  ],
  fundamentals: [
    {
      q: "ROE stands for…",
      options: [
        "Return on Equity",
        "Rate of Earnings",
        "Risk of Equity",
        "Return on Expense",
      ],
      a: 0,
    },
    {
      q: "P/E is…",
      options: [
        "Price/Earnings",
        "Profit/Equity",
        "Price/Equity",
        "Profit/Earnings",
      ],
      a: 0,
    },
    {
      q: "Cash flow statement tracks…",
      options: [
        "Only profits",
        "Movements of cash",
        "Assets only",
        "Liabilities only",
      ],
      a: 1,
    },
    {
      q: "High D/E often implies…",
      options: ["High leverage", "High growth", "Low risk", "Low ROE"],
      a: 0,
    },
    {
      q: "A moat refers to…",
      options: [
        "Liquidity buffer",
        "Competitive advantage",
        "Cash reserve",
        "Bond yield",
      ],
      a: 1,
    },
  ],
  // others fall back to DEFAULT_TEST
};

// ====== MODAL LOGIC ======
let currentCourseId = null;
let currentCourseTitle = "";
function initMaterialModal() {
  const modal = document.getElementById("materialModal");
  const closeBtn = document.getElementById("materialClose");
  const tabButtons = modal.querySelectorAll(".tab-btn");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      showTab(btn.dataset.tab);
    });
  });
  closeBtn.addEventListener("click", closeMaterialModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeMaterialModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMaterialModal();
  });

  // Delegated click for View Material buttons
  const grid = document.getElementById("coursesGrid");
  grid.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".btn-view-material");
    if (viewBtn) {
      const card = viewBtn.closest(".course-card");
      openMaterialModal(
        card.dataset.courseId,
        card.querySelector(".course-title").textContent
      );
    }
  });
}
function showTab(tab) {
  document
    .querySelectorAll(".tab-panel")
    .forEach((p) => p.classList.remove("active"));
  const el = document.getElementById(`tab-${tab}`);
  if (el) el.classList.add("active");
}
function openMaterialModal(courseId, courseTitle) {
  currentCourseId = courseId;
  currentCourseTitle = courseTitle;
  document.getElementById(
    "materialTitle"
  ).textContent = `${courseTitle} • Materials`;

  renderNotes(courseId);
  renderVideos(courseId);
  renderDocs(courseId);
  renderPapers(courseId);
  renderTestPortal(courseId);
  renderCertificateTab(courseId);

  // Reset to first tab
  const modal = document.getElementById("materialModal");
  modal
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  modal.querySelector('.tab-btn[data-tab="notes"]').classList.add("active");
  showTab("notes");

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
function closeMaterialModal() {
  const modal = document.getElementById("materialModal");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

// ====== RENDERERS ======
function renderNotes(id) {
  const data = COURSE_MATERIALS[id] || {};
  const el = document.getElementById("tab-notes");
  const items = (data.notes || [])
    .map(
      (n) => `
        <li>
          <div class="material-left">
            <i class="fas fa-note-sticky" style="color:#f59e0b;"></i>
            <span>${n}</span>
          </div>
          <button class="btn btn-secondary" onclick="downloadText('${sanitizeForAttr(
            currentCourseTitle
          )} - Notes.txt', \`${escapeBackticks(n)}\`)">
            <i class="fas fa-download"></i> Download
          </button>
        </li>
      `
    )
    .join("");
  el.innerHTML = `<ul class="material-list">${
    items || "<li>No notes yet.</li>"
  }</ul>`;
}
function renderVideos(id) {
  const data = COURSE_MATERIALS[id] || {};
  const el = document.getElementById("tab-videos");
  el.innerHTML = `
        <div class="video-grid">
          ${
            (data.videos || [])
              .map(
                (v) => `
            <div class="video-item">
              <div class="video-title">${v.title}</div>
              <div class="video-frame"><iframe src="${v.url}" title="${v.title}" allowfullscreen></iframe></div>
            </div>
          `
              )
              .join("") ||
            '<div class="material-list"><li>No videos yet.</li></div>'
          }
        </div>
      `;
}
function iconForType(type) {
  const map = {
    pdf: "fa-file-pdf",
    ppt: "fa-file-powerpoint",
    xlsx: "fa-file-excel",
    csv: "fa-file-csv",
    img: "fa-image",
    doc: "fa-file-word",
    zip: "fa-file-zipper",
  };
  return map[type] || "fa-file";
}
function renderDocs(id) {
  const data = COURSE_MATERIALS[id] || {};
  const el = document.getElementById("tab-docs");
  el.innerHTML = `
        <ul class="material-list">
          ${
            (data.docs || [])
              .map(
                (d) => `
            <li>
              <div class="material-left">
                <i class="fas ${iconForType(
                  d.type
                )}" style="color:#60a5fa;"></i>
                <div><div style="font-weight:800;">${
                  d.label
                }</div><div class="cert-note">${(
                  d.type || ""
                ).toUpperCase()}</div></div>
              </div>
              <a href="${
                d.href
              }" target="_blank" rel="noopener" class="btn btn-secondary"><i class="fas fa-arrow-up-right-from-square"></i> Open</a>
            </li>
          `
              )
              .join("") || "<li>No documents yet.</li>"
          }
        </ul>
      `;
}
function renderPapers(id) {
  const data = COURSE_MATERIALS[id] || {};
  const el = document.getElementById("tab-papers");
  el.innerHTML = `
        <ul class="material-list">
          ${
            (data.papers || [])
              .map(
                (p) => `
            <li>
              <div class="material-left">
                <i class="fas fa-file-lines" style="color:#a78bfa;"></i>
                <div>${p.title}</div>
              </div>
              <a href="${p.href}" target="_blank" rel="noopener" class="btn btn-secondary"><i class="fas fa-file-arrow-down"></i> Open/Download</a>
            </li>
          `
              )
              .join("") || "<li>No papers yet.</li>"
          }
        </ul>
      `;
}

// ====== TEST PORTAL ======
const TEST_SETTINGS = { durationSec: 5 * 60, passPct: 60 };
let testTimer = null;
function renderTestPortal(id) {
  const el = document.getElementById("tab-tests");
  const state = getTestState(id);
  const best = state.bestScore || 0;
  const attempts = state.attempts || 0;
  const passed = !!state.passed;

  el.innerHTML = `
        <div class="test-head">
          <div class="badge">Time: ${TEST_SETTINGS.durationSec / 60} min</div>
          <div class="badge">Pass: ${TEST_SETTINGS.passPct}%</div>
          <div class="badge">Best: ${best}% • Attempts: ${attempts}</div>
        </div>
        <div id="testContainer">
          <div style="margin-bottom:10px;">Take the test to earn a certificate. You can retry to improve your score.</div>
          <button class="btn btn-primary" id="startTestBtn"><i class="fas fa-play"></i> Start Test</button>
        </div>
      `;

  document
    .getElementById("startTestBtn")
    .addEventListener("click", () => startTest(id));
}
function startTest(courseId) {
  const el = document.getElementById("testContainer");
  const bank = COURSE_TESTS[courseId] || DEFAULT_TEST;
  const qs = shuffle(bank).slice(5); // ensure 5 Q max
  const timerId = `timer-${courseId}`;
  el.innerHTML = `
        <div class="test-head">
          <div id="${timerId}" class="badge"><i class="fas fa-hourglass-half"></i> 05:00</div>
          <div class="badge">${sanitize(currentCourseTitle)}</div>
        </div>
        <form id="testForm">
          ${qs
            .map(
              (item, idx) => `
            <div class="test-q">
              <h4>Q${idx + 1}. ${item.q}</h4>
              <div class="options">
                ${item.options
                  .map(
                    (opt, oi) => `
                  <label><input type="radio" name="q${idx}" value="${oi}" required> <span>${opt}</span></label>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
            )
            .join("")}
          <div class="test-actions">
            <button type="submit" class="btn btn-primary"><i class="fas fa-paper-plane"></i> Submit</button>
            <button type="button" class="btn btn-secondary" id="cancelTestBtn">Cancel</button>
          </div>
        </form>
      `;
  // Timer
  runTimer(timerId, TEST_SETTINGS.durationSec, () => {
    // time up
    gradeTest(courseId, qs, new FormData(document.getElementById("testForm")));
  });
  document
    .getElementById("cancelTestBtn")
    .addEventListener("click", () => renderTestPortal(courseId));
  document.getElementById("testForm").addEventListener("submit", (e) => {
    e.preventDefault();
    gradeTest(courseId, qs, new FormData(e.target));
  });
}
function runTimer(elId, secs, onEnd) {
  const el = document.getElementById(elId);
  let t = secs;
  if (testTimer) clearInterval(testTimer);
  const tick = () => {
    const m = String(Math.floor(t / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    el.textContent = `⏳ ${m}:${s}`;
    if (t <= 0) {
      clearInterval(testTimer);
      onEnd && onEnd();
    }
    t--;
  };
  tick();
  testTimer = setInterval(tick, 1000);
}
function gradeTest(courseId, qs, form) {
  if (testTimer) clearInterval(testTimer);
  const ans = [];
  for (let i = 0; i < qs.length; i++) {
    const v = form.get(`q${i}`);
    ans.push(v === null ? -1 : parseInt(v, 10));
  }
  const correct = ans.reduce((s, v, i) => s + (v === qs[i].a ? 1 : 0), 0);
  const pct = Math.round((correct / qs.length) * 100);
  const pass = pct >= TEST_SETTINGS.passPct;

  // Save state
  const st = getTestState(courseId);
  const attempts = (st.attempts || 0) + 1;
  const bestScore = Math.max(st.bestScore || 0, pct);
  const newState = { attempts, bestScore, passed: st.passed || pass };
  setTestState(courseId, newState);

  const el = document.getElementById("testContainer");
  el.innerHTML = `
        <div class="test-head">
          <div class="score ${
            pass ? "pass" : "fail"
          }">Your Score: ${pct}% (${correct}/${qs.length}) — ${
    pass ? "PASS" : "TRY AGAIN"
  }</div>
          <div class="badge">Best: ${bestScore}% • Attempts: ${attempts}</div>
        </div>
        <div class="test-actions">
          <button class="btn btn-primary" id="retryBtn"><i class="fas fa-rotate-right"></i> Retry</button>
          <button class="btn btn-secondary" id="backBtn">Back</button>
          ${
            pass
              ? `<button class="btn btn-secondary" id="goCertBtn"><i class="fas fa-award"></i> Get Certificate</button>`
              : ""
          }
        </div>
        <div class="cert-note">Tip: You need at least ${
          TEST_SETTINGS.passPct
        }% to unlock the certificate.</div>
      `;
  document
    .getElementById("retryBtn")
    .addEventListener("click", () => renderTestPortal(courseId));
  document
    .getElementById("backBtn")
    .addEventListener("click", () => renderTestPortal(courseId));
  const go = document.getElementById("goCertBtn");
  if (go) {
    go.addEventListener("click", () => {
      // Switch to cert tab
      document.querySelector('.tab-btn[data-tab="cert"]').click();
    });
  }
}

// ====== CERTIFICATE ======
function renderCertificateTab(id) {
  const el = document.getElementById("tab-cert");
  const st = getTestState(id);
  const canGet = !!st.passed;
  const name = getProfileName();

  el.innerHTML = `
        <div class="cert-wrap">
          <div class="cert-top">
            <div class="cert-controls">
              <input id="certName" placeholder="Your name for certificate" value="${sanitizeForAttr(
                name
              )}" />
              <button class="btn btn-primary" id="genCertBtn" ${
                canGet ? "" : "disabled"
              }><i class="fas fa-certificate"></i> Generate</button>
              <button class="btn btn-secondary" id="dlCertBtn" disabled><i class="fas fa-download"></i> Download PNG</button>
            </div>
            <div class="badge">${
              canGet ? "Eligible" : "Pass the test to unlock certificate"
            }</div>
          </div>
          <div class="cert-note">Certificate includes your name, course, date, score (best), and a unique ID.</div>
          <div class="cert-canvas"><canvas id="certCanvas" width="1400" height="990"></canvas></div>
        </div>
      `;

  document.getElementById("genCertBtn").addEventListener("click", () => {
    const userName =
      document.getElementById("certName").value.trim() || "Learner";
    setProfileName(userName);
    const best = getTestState(id).bestScore || 0;
    drawCertificate({
      name: userName,
      course: currentCourseTitle,
      date: new Date().toLocaleDateString(),
      score: best,
      id: "TX-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
    });
    document.getElementById("dlCertBtn").disabled = false;
  });
  document.getElementById("dlCertBtn").addEventListener("click", () => {
    const canvas = document.getElementById("certCanvas");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `Certificate_${currentCourseTitle.replace(/\s+/g, "_")}.png`;
    a.click();
  });
}
function drawCertificate({ name, course, date, score, id }) {
  const c = document.getElementById("certCanvas");
  const ctx = c.getContext("2d");

  // Background
  const grd = ctx.createLinearGradient(0, 0, c.width, c.height);
  grd.addColorStop(0, "#0b1220");
  grd.addColorStop(1, "#0f1b33");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, c.width, c.height);

  // Border
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, c.width - 40, c.height - 40);

  // Title
  ctx.fillStyle = "#f9fafb";
  ctx.textAlign = "center";
  ctx.font = "bold 64px Inter, Arial";
  ctx.fillText("Certificate of Completion", c.width / 2, 170);

  // Subtitle
  ctx.font = "24px Inter, Arial";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText("This is to certify that", c.width / 2, 235);

  // Name
  ctx.font = "bold 56px Inter, Arial";
  ctx.fillStyle = "#f9fafb";
  ctx.fillText(name, c.width / 2, 310);

  // Body
  ctx.font = "24px Inter, Arial";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText("has successfully completed the course", c.width / 2, 360);

  ctx.font = "bold 34px Inter, Arial";
  ctx.fillStyle = "#f9fafb";
  ctx.fillText(course, c.width / 2, 405);

  // Details row
  ctx.font = "22px Inter, Arial";
  ctx.fillStyle = "#d1d5db";
  ctx.fillText(`Date: ${date}`, c.width / 2, 470);
  ctx.fillText(`Score (Best): ${score}%`, c.width / 2, 505);

  // Badge
  ctx.beginPath();
  ctx.arc(c.width / 2, 600, 70, 0, Math.PI * 2);
  ctx.fillStyle = "#10b981";
  ctx.fill();
  ctx.font = "bold 28px Inter, Arial";
  ctx.fillStyle = "#0a0e17";
  ctx.fillText("PRO", c.width / 2, 610);

  // Signature + ID
  ctx.font = "20px Inter, Arial";
  ctx.fillStyle = "#9ca3af";
  ctx.textAlign = "left";
  ctx.fillText("Director, TradeMaster Pro", 120, 860);
  ctx.textAlign = "right";
  ctx.fillText(`Certificate ID: ${id}`, c.width - 120, 860);
}

// ====== ENROLLMENT / WALLET ======
function initCourseEnrollment() {
  const coinBalanceEl = document.getElementById("user-coin-balance");
  let userCoins = getCoins();
  coinBalanceEl.textContent = userCoins;

  document.querySelectorAll(".btn-enroll").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("enrolled")) return;

      const courseCard = button.closest(".course-card");
      const courseId = courseCard.dataset.courseId;
      const courseTitle = courseCard.querySelector(".course-title").textContent;
      const courseCost = parseInt(button.dataset.cost, 10);

      if (userCoins >= courseCost) {
        userCoins -= courseCost;
        setCoins(userCoins);
        coinBalanceEl.textContent = userCoins;
        button.textContent = "Enrolled";
        button.classList.add("enrolled");
        setEnrolled(courseId);
        addViewMaterialButton(courseCard, courseId, courseTitle);
        alert(
          `Success! You have enrolled in "${courseTitle}". You can now view course materials.`
        );
      } else {
        alert(
          `Insufficient coins to enroll in "${courseTitle}".\nYour balance: ${userCoins}\nCourse cost: ${courseCost}`
        );
      }
    });
  });
}

function addViewMaterialButton(courseCard, courseId, courseTitle) {
  if (courseCard.querySelector(".btn-view-material")) return;
  const footer = courseCard.querySelector(".course-footer");
  const btn = document.createElement("button");
  btn.className = "btn btn-secondary btn-view-material";
  btn.textContent = "View Material";
  btn.type = "button";
  btn.setAttribute("data-course-id", courseId);
  btn.setAttribute("data-course-title", courseTitle);
  footer.appendChild(btn);
}

// ====== UTIL ======
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
function sanitize(t) {
  return (t || "").replace(
    /[<>&]/g,
    (s) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[s])
  );
}
function sanitizeForAttr(t) {
  return (t || "").replace(/"/g, "&quot;");
}
function escapeBackticks(t) {
  return (t || "").replace(/`/g, "\\`");
}
function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
