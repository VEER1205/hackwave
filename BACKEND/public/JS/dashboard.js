document.addEventListener("DOMContentLoaded", () => {
  // --- INITIALIZERS ---
  initNavbar();
  initNavLinks();
  initCharts();
  initUIComponents();
});

// --- NAVBAR LOGIC ---
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
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

      // Close mobile menu on link click
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
      }
    });
  });
}

// --- UI COMPONENTS ---
function initUIComponents() {
  // Set Current Date
  const dateElement = document.getElementById("currentDate");
  if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Animate Metric Counters
  const metricValues = document.querySelectorAll(".metric-value");
  metricValues.forEach((el) => {
    const text = el.textContent.trim();
    // Animate only the main metric cards, not the table values
    if (text.startsWith("₹") && !el.hasAttribute("style")) {
      const value = parseFloat(text.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(value)) {
        animateValue(el, 0, value, 1500);
      }
    }
  });
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    obj.innerHTML = `₹${current.toLocaleString("en-IN")}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// --- CHART LOGIC ---
function initCharts() {
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = "#8b949e";

  // --- Data for Charts ---
  const growthChartData = {
    "6m": {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
      data: [510000, 525000, 515000, 540000, 560000, 567890],
    },
    "1y": {
      labels: [
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
      ],
      data: [
        420000, 450000, 465000, 440000, 480000, 495000, 510000, 525000, 515000,
        540000, 560000, 567890,
      ],
    },
    "2y": {
      labels: [
        "Q4 '23",
        "Q1 '24",
        "Q2 '24",
        "Q3 '24",
        "Q4 '24",
        "Q1 '25",
        "Q2 '25",
        "Q3 '25",
        "Q4 '25",
      ],
      data: [
        380000, 420000, 445000, 465000, 480000, 495000, 520000, 535000, 567890,
      ],
    },
    all: {
      labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
      data: [150000, 220000, 300000, 380000, 480000, 567890],
    },
  };

  const profitLossData = {
    "6m": {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
      profit: [14000, 16500, 13000, 19000, 17000, 21000],
      loss: [-3500, -2800, -4200, -1800, -2200, -3100],
    },
    "12m": {
      labels: [
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
      ],
      profit: [
        9000, 12000, 8500, 15000, 11000, 18000, 14000, 16500, 13000, 19000,
        17000, 21000,
      ],
      loss: [
        -4000, -3000, -5000, -2000, -4000, -1500, -3500, -2800, -4200, -1800,
        -2200, -3100,
      ],
    },
  };

  const cryptoChartData = {
    "7d": {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
      data: [52500, 53000, 51000, 54500, 56000, 55200, 56780],
    },
    "30d": {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [48000, 51500, 49000, 56780],
    },
    "90d": {
      labels: ["Month 1", "Month 2", "Month 3"],
      data: [45000, 42000, 56780],
    },
  };

  // 1. Growth Chart
  const growthCtx = document.getElementById("growthChart").getContext("2d");
  const gradient = growthCtx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(20, 184, 166, 0.6)");
  gradient.addColorStop(1, "rgba(13, 17, 23, 0.1)");

  const growthChart = new Chart(growthCtx, {
    type: "line",
    data: {
      labels: growthChartData["6m"].labels,
      datasets: [
        {
          label: "Portfolio Value",
          data: growthChartData["6m"].data,
          borderColor: "#14b8a6",
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#14b8a6",
          pointBorderColor: "#e6edf3",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#e6edf3",
          pointHoverBorderColor: "#14b8a6",
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
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#0d1117",
          titleColor: "#e6edf3",
          bodyColor: "#e6edf3",
          borderColor: "rgba(66, 133, 244, 0.2)",
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (context) => `Value: ₹${context.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: (value) => `₹${value / 1000}K`,
            color: "#8b949e",
          },
          grid: {
            color: "rgba(139, 148, 158, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#8b949e",
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });

  // 2. Distribution Pie Chart
  const distributionCtx = document
    .getElementById("distributionChart")
    .getContext("2d");
  new Chart(distributionCtx, {
    type: "doughnut",
    data: {
      labels: ["Mutual Funds", "Stocks", "Fixed Deposits", "Gold"],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: ["#3b82f6", "#14b8a6", "#f59e0b", "#8b5cf6"],
          borderWidth: 4,
          borderColor: "#161b22",
          hoverOffset: 12,
          hoverBorderColor: "#14b8a6",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#0d1117",
          callbacks: {
            label: (context) => ` ${context.label}: ${context.parsed}%`,
          },
        },
      },
    },
  });

  // 3. Profit vs Loss Chart
  const profitLossCtx = document
    .getElementById("profitLossChart")
    .getContext("2d");
  const profitLossChart = new Chart(profitLossCtx, {
    type: "bar",
    data: {
      labels: profitLossData["6m"].labels,
      datasets: [
        {
          label: "Profit",
          data: profitLossData["6m"].profit,
          backgroundColor: "rgba(34, 197, 94, 0.8)",
          borderRadius: 4,
          hoverBackgroundColor: "#22c55e",
        },
        {
          label: "Loss",
          data: profitLossData["6m"].loss,
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderRadius: 4,
          hoverBackgroundColor: "#ef4444",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            boxWidth: 12,
            padding: 20,
            color: "#e6edf3",
          },
        },
        tooltip: {
          backgroundColor: "#0d1117",
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ₹${Math.abs(
                context.parsed.y
              ).toLocaleString()}`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => `₹${value / 1000}K`,
            color: "#8b949e",
          },
          grid: {
            color: "rgba(139, 148, 158, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#8b949e",
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });

  // 4. NEW Crypto Chart
  const cryptoCtx = document.getElementById("cryptoChart").getContext("2d");
  const cryptoGradient = cryptoCtx.createLinearGradient(0, 0, 0, 300);
  cryptoGradient.addColorStop(0, "rgba(139, 92, 246, 0.6)"); // Purple gradient
  cryptoGradient.addColorStop(1, "rgba(13, 17, 23, 0.1)");

  const cryptoChart = new Chart(cryptoCtx, {
    type: "line",
    data: {
      labels: cryptoChartData["30d"].labels,
      datasets: [
        {
          label: "Crypto Value",
          data: cryptoChartData["30d"].data,
          borderColor: "#8b5cf6", // --accent-purple
          backgroundColor: cryptoGradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#8b5cf6",
          pointBorderColor: "#e6edf3",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#e6edf3",
          pointHoverBorderColor: "#8b5cf6",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0d1117",
          titleColor: "#e6edf3",
          bodyColor: "#e6edf3",
          borderColor: "rgba(139, 92, 246, 0.3)",
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (context) => `Value: ₹${context.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: (value) => `₹${value / 1000}K`,
            color: "#8b949e",
          },
          grid: { color: "rgba(139, 148, 158, 0.1)" },
        },
        x: {
          ticks: { color: "#8b949e" },
          grid: { display: false },
        },
      },
    },
  });

  // --- Event Listeners for Dropdowns ---
  document.getElementById("timeRange").addEventListener("change", function () {
    const selectedRange = this.value;
    growthChart.data.labels = growthChartData[selectedRange].labels;
    growthChart.data.datasets[0].data = growthChartData[selectedRange].data;
    growthChart.update();
  });

  document
    .getElementById("plTimeRange")
    .addEventListener("change", function () {
      const selectedRange = this.value;
      const newData = profitLossData[selectedRange];
      profitLossChart.data.labels = newData.labels;
      profitLossChart.data.datasets[0].data = newData.profit;
      profitLossChart.data.datasets[1].data = newData.loss;
      profitLossChart.update();
    });

  document
    .getElementById("cryptoTimeRange")
    .addEventListener("change", function () {
      const selectedRange = this.value;
      cryptoChart.data.labels = cryptoChartData[selectedRange].labels;
      cryptoChart.data.datasets[0].data = cryptoChartData[selectedRange].data;
      cryptoChart.update();
    });
}
