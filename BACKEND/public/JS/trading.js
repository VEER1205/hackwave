// Game state
let balance = 100000; // Starting with ₹1 Lakh
let portfolio = {};
let tradeHistory = [];
let selectedStock = null;
let selectedIpo = null;
let stockChart = null;
let watchedStocks = {};
let currentTab = "trading";

// Indian stock data (NSE/BSE)
const indianStocks = {
  RELIANCE: {
    name: "Reliance Industries Ltd.",
    price: 2458.5,
    change: 23.8,
    exchange: "NSE",
  },
  TCS: {
    name: "Tata Consultancy Services",
    price: 3724.3,
    change: -15.2,
    exchange: "NSE",
  },
  HDFCBANK: {
    name: "HDFC Bank Ltd.",
    price: 1642.75,
    change: 8.4,
    exchange: "NSE",
  },
  INFY: {
    name: "Infosys Ltd.",
    price: 1458.9,
    change: 12.6,
    exchange: "NSE",
  },
  HINDUNILVR: {
    name: "Hindustan Unilever Ltd.",
    price: 2387.2,
    change: -5.3,
    exchange: "NSE",
  },
  ICICIBANK: {
    name: "ICICI Bank Ltd.",
    price: 985.45,
    change: 7.85,
    exchange: "NSE",
  },
  BHARTIARTL: {
    name: "Bharti Airtel Ltd.",
    price: 1245.6,
    change: 18.9,
    exchange: "NSE",
  },
  ITC: {
    name: "ITC Ltd.",
    price: 456.75,
    change: -2.35,
    exchange: "NSE",
  },
  SBIN: {
    name: "State Bank of India",
    price: 623.2,
    change: 9.4,
    exchange: "NSE",
  },
  LT: {
    name: "Larsen & Toubro Ltd.",
    price: 3456.8,
    change: 34.6,
    exchange: "NSE",
  },
  KOTAKBANK: {
    name: "Kotak Mahindra Bank",
    price: 1785.4,
    change: -12.3,
    exchange: "NSE",
  },
  ASIANPAINT: {
    name: "Asian Paints Ltd.",
    price: 3234.5,
    change: 21.8,
    exchange: "NSE",
  },
  MARUTI: {
    name: "Maruti Suzuki India Ltd.",
    price: 10245.3,
    change: 89.7,
    exchange: "NSE",
  },
  BAJFINANCE: {
    name: "Bajaj Finance Ltd.",
    price: 6789.2,
    change: -45.6,
    exchange: "NSE",
  },
  TITAN: {
    name: "Titan Company Ltd.",
    price: 3156.4,
    change: 28.3,
    exchange: "NSE",
  },
};

// IPO data
const ipoData = {
  TATATECH: {
    name: "Tata Technologies Ltd.",
    sector: "Technology",
    priceBand: "475-500",
    lotSize: 30,
    minInvestment: 15000,
    openDate: "2024-01-15",
    closeDate: "2024-01-17",
    listingDate: "2024-01-22",
    status: "upcoming",
    details: "Leading engineering services company with global presence",
  },
  IDEAFORGE: {
    name: "IdeaForge Technology Ltd.",
    sector: "Defense & Aerospace",
    priceBand: "640-672",
    lotSize: 22,
    minInvestment: 14784,
    openDate: "2024-01-20",
    closeDate: "2024-01-22",
    listingDate: "2024-01-28",
    status: "open",
    details:
      "Leading drone manufacturer for defense and commercial applications",
  },
  BHARATFORGE: {
    name: "Bharat Forge International Ltd.",
    sector: "Auto Components",
    priceBand: "890-950",
    lotSize: 15,
    minInvestment: 14250,
    openDate: "2024-02-01",
    closeDate: "2024-02-03",
    listingDate: "2024-02-08",
    status: "upcoming",
    details: "Global leader in automotive and industrial components",
  },
  MEDPLUS: {
    name: "MedPlus Health Services Ltd.",
    sector: "Healthcare",
    priceBand: "796-826",
    lotSize: 18,
    minInvestment: 14868,
    openDate: "2024-02-10",
    closeDate: "2024-02-12",
    listingDate: "2024-02-17",
    status: "closed",
    details: "One of India's largest pharmacy retail chains",
  },
};

const popularStocks = ["RELIANCE", "TCS", "HDFCBANK", "INFY"];

// Check if market is open (9:15 AM to 3:30 PM IST, Monday to Friday)
function isMarketOpen() {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // Monday to Friday
  if (day >= 1 && day <= 5) {
    // 9:15 AM to 3:30 PM IST
    return timeInMinutes >= 555 && timeInMinutes <= 930; // 9:15 AM = 555 min, 3:30 PM = 930 min
  }
  return false;
}

// Update market status
function updateMarketStatus() {
  const marketStatusEl = document.getElementById("marketStatus");
  if (isMarketOpen()) {
    marketStatusEl.textContent = "Market Open";
    marketStatusEl.className = "market-status market-open";
  } else {
    marketStatusEl.textContent = "Market Closed";
    marketStatusEl.className = "market-status market-closed";
  }
}

// Switch between tabs
function switchTab(tab) {
  currentTab = tab;
  const tradingTab = document.getElementById("tradingTab");
  const ipoTab = document.getElementById("ipoTab");
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((btn) => btn.classList.remove("active"));

  if (tab === "trading") {
    tradingTab.style.display = "grid";
    ipoTab.style.display = "none";
    tabButtons[0].classList.add("active");
  } else if (tab === "ipo") {
    tradingTab.style.display = "none";
    ipoTab.style.display = "grid";
    tabButtons[1].classList.add("active");
    renderIpos();
  }
}

// Search for Indian stocks
function searchStock() {
  const symbol = document
    .getElementById("searchInput")
    .value.trim()
    .toUpperCase();
  if (!symbol) {
    showNotification("Please enter a stock symbol", "error");
    return;
  }

  const searchBtn = document.getElementById("searchBtn");
  const searchResults = document.getElementById("searchResults");

  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";
  searchResults.innerHTML =
    '<div class="loading">Searching for stock data...</div>';

  setTimeout(() => {
    if (indianStocks[symbol]) {
      const stockData = {
        symbol: symbol,
        name: indianStocks[symbol].name,
        price: indianStocks[symbol].price,
        change: indianStocks[symbol].change,
        exchange: indianStocks[symbol].exchange,
        changePercent: "0.00%",
      };

      watchedStocks[symbol] = stockData;
      displaySearchResult(stockData);
      showNotification(`Found ${symbol}!`, "success");
    } else {
      // Generate random Indian stock data for unknown symbols
      const randomPrice = Math.random() * 5000 + 100;
      const randomChange = (Math.random() - 0.5) * 100;
      const stockData = {
        symbol: symbol,
        name: `${symbol} Ltd.`,
        price: parseFloat(randomPrice.toFixed(2)),
        change: parseFloat(randomChange.toFixed(2)),
        exchange: "NSE",
        changePercent: "0.00%",
      };

      watchedStocks[symbol] = stockData;
      displaySearchResult(stockData);
      showNotification(`Found ${symbol} (Demo Data)`, "success");
    }

    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
    renderWatchedStocks();
  }, 1000);
}

// Display search result
function displaySearchResult(stockData) {
  const searchResults = document.getElementById("searchResults");
  const changeClass = stockData.change >= 0 ? "price-up" : "price-down";
  const changeSymbol = stockData.change >= 0 ? "+" : "";

  searchResults.innerHTML = `
                <div class="search-result-item" onclick="addToWatchlist('${
                  stockData.symbol
                }')">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div class="stock-symbol">${stockData.symbol}</div>
                            <div class="stock-name">${stockData.name}</div>
                            <div class="stock-exchange">${
                              stockData.exchange
                            }</div>
                        </div>
                        <div class="stock-price ${changeClass}">
                            ₹${stockData.price.toFixed(2)}
                            <br><small>${changeSymbol}${stockData.change.toFixed(
    2
  )}</small>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 10px; color: var(--primary); font-size: 0.9rem;">
                        Click to add to watchlist
                    </div>
                </div>
            `;
}

// Add stock to watchlist
function addToWatchlist(symbol) {
  if (watchedStocks[symbol]) {
    showNotification(`${symbol} added to your watchlist!`, "success");
    renderWatchedStocks();
    document.getElementById("searchResults").innerHTML = "";
    document.getElementById("searchInput").value = "";
  }
}

// Generate historical data for Indian stocks
function generateHistoricalData(symbol, currentPrice) {
  const history = [];
  let price = currentPrice * 0.95; // Start 5% lower

  for (let i = 29; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 0.08; // ±4% change per day
    price = Math.max(price * (1 + change), 10);
    const date = new Date();
    date.setDate(date.getDate() - i);
    history.push({
      date: date.toLocaleDateString("en-IN"),
      price: parseFloat(price.toFixed(2)),
    });
  }

  // Make sure last price matches current price
  history[history.length - 1].price = currentPrice;
  return history;
}

// Render watched stocks
function renderWatchedStocks() {
  const stockListEl = document.getElementById("stockList");

  if (Object.keys(watchedStocks).length === 0) {
    stockListEl.innerHTML =
      '<div style="text-align: center; color: var(--muted-foreground);">Search and add Indian stocks to your watchlist</div>';
    return;
  }

  stockListEl.innerHTML = "";

  Object.keys(watchedStocks).forEach((symbol) => {
    const stock = watchedStocks[symbol];
    const stockEl = document.createElement("div");
    stockEl.className = `stock-item ${
      selectedStock === symbol ? "selected" : ""
    }`;
    stockEl.onclick = () => selectStock(symbol);

    const changeClass = stock.change >= 0 ? "price-up" : "price-down";
    const changeSymbol = stock.change >= 0 ? "+" : "";

    stockEl.innerHTML = `
                    <div class="stock-info">
                        <div class="stock-symbol">${symbol}</div>
                        <div class="stock-name">${stock.name}</div>
                        <div class="stock-exchange">${stock.exchange}</div>
                    </div>
                    <div class="stock-price ${changeClass}">
                        ₹${stock.price.toFixed(2)}
                        <br><small>${changeSymbol}${stock.change.toFixed(
      2
    )}</small>
                    </div>
                `;

    stockListEl.appendChild(stockEl);
  });
}

// Render IPOs
function renderIpos() {
  const upcomingIposEl = document.getElementById("upcomingIpos");
  upcomingIposEl.innerHTML = "";

  Object.keys(ipoData).forEach((symbol) => {
    const ipo = ipoData[symbol];
    const ipoEl = document.createElement("div");
    ipoEl.className = "ipo-item";
    ipoEl.onclick = () => selectIpo(symbol);

    const statusClass = `ipo-${ipo.status}`;
    const statusText = ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1);

    ipoEl.innerHTML = `
                    <div class="ipo-name">${ipo.name}</div>
                    <div class="ipo-details">
                        <div><strong>Sector:</strong> ${ipo.sector}</div>
                        <div><strong>Price Band:</strong> ₹${ipo.priceBand}</div>
                        <div><strong>Lot Size:</strong> ${ipo.lotSize}</div>
                        <div><strong>Min Investment:</strong> ₹${ipo.minInvestment}</div>
                    </div>
                    <div class="ipo-status ${statusClass}">${statusText}</div>
                `;

    upcomingIposEl.appendChild(ipoEl);
  });
}

// Select IPO
function selectIpo(symbol) {
  selectedIpo = symbol;
  const ipo = ipoData[symbol];

  document.getElementById("selectedIpo").value = ipo.name;
  document.getElementById("ipoPriceBand").value = `₹${ipo.priceBand}`;
  document.getElementById("ipoLotSize").value = ipo.lotSize;
  calculateIpoAmount();

  // Update IPO details
  const ipoDetailsEl = document.getElementById("ipoDetails");
  ipoDetailsEl.innerHTML = `
                <div style="text-align: left; padding: 20px;">
                    <h3 style="color: var(--primary); margin-bottom: 15px;">${
                      ipo.name
                    }</h3>
                    <div style="margin-bottom: 10px;"><strong>Sector:</strong> ${
                      ipo.sector
                    }</div>
                    <div style="margin-bottom: 10px;"><strong>Price Band:</strong> ₹${
                      ipo.priceBand
                    }</div>
                    <div style="margin-bottom: 10px;"><strong>Lot Size:</strong> ${
                      ipo.lotSize
                    } shares</div>
                    <div style="margin-bottom: 10px;"><strong>Minimum Investment:</strong> ₹${
                      ipo.minInvestment
                    }</div>
                    <div style="margin-bottom: 10px;"><strong>Open Date:</strong> ${new Date(
                      ipo.openDate
                    ).toLocaleDateString("en-IN")}</div>
                    <div style="margin-bottom: 10px;"><strong>Close Date:</strong> ${new Date(
                      ipo.closeDate
                    ).toLocaleDateString("en-IN")}</div>
                    <div style="margin-bottom: 10px;"><strong>Listing Date:</strong> ${new Date(
                      ipo.listingDate
                    ).toLocaleDateString("en-IN")}</div>
                    <div style="margin-bottom: 15px;"><strong>Status:</strong> 
                        <span class="ipo-status ipo-${
                          ipo.status
                        }" style="display: inline-block; margin-left: 10px;">
                            ${
                              ipo.status.charAt(0).toUpperCase() +
                              ipo.status.slice(1)
                            }
                        </span>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: var(--muted); border-radius: 8px;">
                        <strong>About the Company:</strong><br>
                        ${ipo.details}
                    </div>
                </div>
            `;
}

// Calculate IPO amount
function calculateIpoAmount() {
  const lots = parseInt(document.getElementById("ipoLots").value) || 1;
  if (selectedIpo && ipoData[selectedIpo]) {
    const ipo = ipoData[selectedIpo];
    const maxPrice = parseFloat(ipo.priceBand.split("-")[1]);
    const totalAmount = lots * ipo.lotSize * maxPrice;
    document.getElementById("ipoTotalAmount").value = `₹${totalAmount.toFixed(
      2
    )}`;
  }
}

// Apply for IPO
function applyForIpo() {
  if (!selectedIpo || !ipoData[selectedIpo]) {
    showNotification("Please select an IPO first!", "error");
    return;
  }

  const ipo = ipoData[selectedIpo];
  if (ipo.status !== "open") {
    showNotification("This IPO is not open for subscription!", "error");
    return;
  }

  const lots = parseInt(document.getElementById("ipoLots").value) || 1;
  if (lots < 1 || lots > 5) {
    showNotification("Please enter valid number of lots (1-5)!", "error");
    return;
  }

  const maxPrice = parseFloat(ipo.priceBand.split("-")[1]);
  const totalAmount = lots * ipo.lotSize * maxPrice;

  if (balance < totalAmount) {
    showNotification("Insufficient balance for IPO application!", "error");
    return;
  }

  balance -= totalAmount;

  tradeHistory.unshift({
    type: "ipo",
    symbol: selectedIpo,
    name: ipo.name,
    lots: lots,
    quantity: lots * ipo.lotSize,
    price: maxPrice,
    total: totalAmount,
    timestamp: new Date().toLocaleString("en-IN"),
  });

  showNotification(`Applied for ${lots} lot(s) of ${ipo.name} IPO!`, "success");

  updateBalance();
  updateTradeHistory();
  document.getElementById("ipoLots").value = 1;
  calculateIpoAmount();
}

// Select stock
async function selectStock(symbol) {
  if (!watchedStocks[symbol]) return;

  selectedStock = symbol;
  const stock = watchedStocks[symbol];

  document.getElementById("selectedStock").value = `${symbol} - ${stock.name}`;
  document.getElementById("currentPrice").value = `₹${stock.price.toFixed(2)}`;
  calculateTotalCost();
  renderWatchedStocks();

  // Update chart with historical data
  const historicalData = generateHistoricalData(symbol, stock.price);
  updateChart(historicalData);
}

// Calculate total cost
function calculateTotalCost() {
  const quantity = parseInt(document.getElementById("quantity").value) || 0;
  if (selectedStock && watchedStocks[selectedStock] && quantity > 0) {
    const total = watchedStocks[selectedStock].price * quantity;
    document.getElementById("totalCost").value = `₹${total.toFixed(2)}`;
  } else {
    document.getElementById("totalCost").value = "";
  }
}

// Execute trade
function executeTrade(type) {
  if (!selectedStock || !watchedStocks[selectedStock]) {
    showNotification("Please select a stock first!", "error");
    return;
  }

  const quantity = parseInt(document.getElementById("quantity").value);
  if (!quantity || quantity <= 0) {
    showNotification("Please enter a valid quantity!", "error");
    return;
  }

  const stock = watchedStocks[selectedStock];
  const totalCost = stock.price * quantity;

  if (type === "buy") {
    if (balance < totalCost) {
      showNotification("Insufficient balance!", "error");
      return;
    }

    balance -= totalCost;

    if (portfolio[selectedStock]) {
      portfolio[selectedStock].quantity += quantity;
      portfolio[selectedStock].totalCost += totalCost;
      portfolio[selectedStock].avgPrice =
        portfolio[selectedStock].totalCost / portfolio[selectedStock].quantity;
    } else {
      portfolio[selectedStock] = {
        quantity: quantity,
        avgPrice: stock.price,
        totalCost: totalCost,
        name: stock.name,
      };
    }

    tradeHistory.unshift({
      type: "buy",
      symbol: selectedStock,
      quantity: quantity,
      price: stock.price,
      total: totalCost,
      timestamp: new Date().toLocaleString("en-IN"),
    });

    showNotification(
      `Bought ${quantity} shares of ${selectedStock}!`,
      "success"
    );
  } else if (type === "sell") {
    if (
      !portfolio[selectedStock] ||
      portfolio[selectedStock].quantity < quantity
    ) {
      showNotification("Insufficient shares to sell!", "error");
      return;
    }

    balance += totalCost;
    portfolio[selectedStock].quantity -= quantity;

    if (portfolio[selectedStock].quantity === 0) {
      delete portfolio[selectedStock];
    }

    tradeHistory.unshift({
      type: "sell",
      symbol: selectedStock,
      quantity: quantity,
      price: stock.price,
      total: totalCost,
      timestamp: new Date().toLocaleString("en-IN"),
    });

    showNotification(`Sold ${quantity} shares of ${selectedStock}!`, "success");
  }

  updateBalance();
  updatePortfolio();
  updateTradeHistory();
  document.getElementById("quantity").value = 1;
  calculateTotalCost();
}

// Update balance
function updateBalance() {
  document.getElementById("balance").textContent = balance.toFixed(2);
}

// Update portfolio
function updatePortfolio() {
  const portfolioEl = document.getElementById("portfolio");
  portfolioEl.innerHTML = "";

  if (Object.keys(portfolio).length === 0) {
    portfolioEl.innerHTML =
      '<p style="text-align: center; color: var(--muted-foreground);">No holdings</p>';
    return;
  }

  Object.keys(portfolio).forEach((symbol) => {
    const holding = portfolio[symbol];
    const currentPrice = watchedStocks[symbol]?.price || holding.avgPrice;
    const currentValue = holding.quantity * currentPrice;
    const profitLoss = currentValue - holding.quantity * holding.avgPrice;
    const profitLossClass = profitLoss >= 0 ? "profit" : "loss";
    const profitLossSymbol = profitLoss >= 0 ? "+" : "";

    const portfolioItemEl = document.createElement("div");
    portfolioItemEl.className = "portfolio-item";
    portfolioItemEl.innerHTML = `
                    <div class="portfolio-symbol">${symbol}</div>
                    <div class="portfolio-details">
                        <span>Qty: ${holding.quantity}</span>
                        <span>Avg: ₹${holding.avgPrice.toFixed(2)}</span>
                        <span>Current: ₹${currentPrice.toFixed(2)}</span>
                    </div>
                    <div class="portfolio-details">
                        <span>Value: ₹${currentValue.toFixed(2)}</span>
                        <span class="profit-loss ${profitLossClass}">
                            ${profitLossSymbol}₹${Math.abs(profitLoss).toFixed(
      2
    )}
                        </span>
                    </div>
                `;

    portfolioEl.appendChild(portfolioItemEl);
  });
}

// Update trade history
function updateTradeHistory() {
  const tradeHistoryEl = document.getElementById("tradeHistory");
  tradeHistoryEl.innerHTML = "";

  if (tradeHistory.length === 0) {
    tradeHistoryEl.innerHTML =
      '<p style="text-align: center; color: var(--muted-foreground);">No trades yet</p>';
    return;
  }

  tradeHistory.slice(0, 10).forEach((trade) => {
    const tradeEl = document.createElement("div");
    tradeEl.className = `trade-item trade-type-${trade.type}`;

    if (trade.type === "ipo") {
      tradeEl.innerHTML = `
                        <div>
                            <strong>IPO ${trade.name}</strong><br>
                            <small>${trade.timestamp}</small>
                        </div>
                        <div style="text-align: right;">
                            ${trade.lots} lot(s) - ${trade.quantity} shares<br>
                            <strong>₹${trade.total.toFixed(2)}</strong>
                        </div>
                    `;
    } else {
      tradeEl.innerHTML = `
                        <div>
                            <strong>${trade.type.toUpperCase()} ${
        trade.symbol
      }</strong><br>
                            <small>${trade.timestamp}</small>
                        </div>
                        <div style="text-align: right;">
                            ${trade.quantity} shares @ ₹${trade.price.toFixed(
        2
      )}<br>
                            <strong>₹${trade.total.toFixed(2)}</strong>
                        </div>
                    `;
    }

    tradeHistoryEl.appendChild(tradeEl);
  });
}

// Update chart with historical data
function updateChart(historicalData) {
  if (!stockChart || !historicalData) return;

  const labels = historicalData.map((entry) => entry.date);
  const prices = historicalData.map((entry) => entry.price);

  stockChart.data.labels = labels;
  stockChart.data.datasets[0].data = prices;
  stockChart.data.datasets[0].label = `${selectedStock} Price History (₹)`;
  stockChart.update("none");
}

// Initialize chart
function initializeChart() {
  const ctx = document.getElementById("stockChart").getContext("2d");
  stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Select a stock to view price history",
          data: [],
          borderColor: "#ff9933",
          backgroundColor: "rgba(255, 153, 51, 0.1)",
          tension: 0.1,
          fill: true,
          pointBackgroundColor: "#ff9933",
          pointBorderColor: "#ff9933",
          pointHoverBackgroundColor: "#ff9933",
          pointHoverBorderColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function (value) {
              return "₹" + value.toFixed(2);
            },
            color: "#a6a6a6",
          },
          grid: {
            color: "#333833",
          },
        },
        x: {
          ticks: {
            color: "#a6a6a6",
            maxTicksLimit: 10,
          },
          grid: {
            color: "#333833",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#f2f2f2",
          },
        },
        tooltip: {
          backgroundColor: "rgba(26, 31, 26, 0.9)",
          titleColor: "#f2f2f2",
          bodyColor: "#f2f2f2",
          borderColor: "#ff9933",
          borderWidth: 1,
        },
      },
    },
  });
}

// Show notification
function showNotification(message, type) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification ${type} show`;

  setTimeout(() => {
    notification.className = `notification ${type}`;
  }, 3000);
}

// Refresh stock prices periodically
function refreshStockPrices() {
  Object.keys(watchedStocks).forEach((symbol) => {
    const currentPrice = watchedStocks[symbol].price;
    const change = (Math.random() - 0.5) * 0.03; // ±1.5% change
    const newPrice = Math.max(currentPrice * (1 + change), 1);
    const priceChange = newPrice - currentPrice;

    watchedStocks[symbol].price = parseFloat(newPrice.toFixed(2));
    watchedStocks[symbol].change = parseFloat(priceChange.toFixed(2));
  });

  renderWatchedStocks();
  updatePortfolio();

  // Update current price if a stock is selected
  if (selectedStock && watchedStocks[selectedStock]) {
    document.getElementById("currentPrice").value = `₹${watchedStocks[
      selectedStock
    ].price.toFixed(2)}`;
    calculateTotalCost();
  }
}

// Initialize popular Indian stocks
function initializePopularStocks() {
  const loadingEl = document.getElementById("stockList");
  loadingEl.innerHTML =
    '<div class="loading">Loading popular Indian stocks...</div>';

  // Add popular Indian stocks to watchlist
  popularStocks.forEach((symbol) => {
    if (indianStocks[symbol]) {
      watchedStocks[symbol] = {
        symbol: symbol,
        name: indianStocks[symbol].name,
        price: indianStocks[symbol].price,
        change: indianStocks[symbol].change,
        exchange: indianStocks[symbol].exchange,
        changePercent: "0.00%",
      };
    }
  });

  setTimeout(() => {
    renderWatchedStocks();
    showNotification(
      "Popular Indian stocks loaded! Search for more stocks above.",
      "success"
    );
  }, 1000);
}

// Event listeners
function setupEventListeners() {
  // Search functionality
  document.getElementById("searchBtn").addEventListener("click", searchStock);
  document
    .getElementById("searchInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchStock();
      }
    });

  // Trading functionality
  document
    .getElementById("buyBtn")
    .addEventListener("click", () => executeTrade("buy"));
  document
    .getElementById("sellBtn")
    .addEventListener("click", () => executeTrade("sell"));

  // IPO functionality
  document.getElementById("applyIpoBtn").addEventListener("click", applyForIpo);

  // Quantity input
  document
    .getElementById("quantity")
    .addEventListener("input", calculateTotalCost);
  document
    .getElementById("ipoLots")
    .addEventListener("input", calculateIpoAmount);
}

// Initialize everything
function initialize() {
  updateBalance();
  updatePortfolio();
  updateTradeHistory();
  updateMarketStatus();
  initializeChart();
  initializePopularStocks();
  setupEventListeners();

  // Update market status every minute
  setInterval(updateMarketStatus, 60000);

  // Refresh prices every 3 seconds (faster for Indian markets)
  setInterval(refreshStockPrices, 3000);
}

// Start the application
document.addEventListener("DOMContentLoaded", initialize);
