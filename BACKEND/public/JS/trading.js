document.addEventListener("DOMContentLoaded", function () {
  // Chart.js Global Defaults
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = "#a0a0a0"; // Secondary text color for ticks

  // --- Data for Charts ---

  // 1. Data for Portfolio Growth Chart
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
        "Q4 '22",
        "Q1 '23",
        "Q2 '23",
        "Q3 '23",
        "Q4 '23",
        "Q1 '24",
        "Q2 '24",
        "Q3 '24",
        "Q4 '24",
      ],
      data: [
        380000, 420000, 445000, 465000, 480000, 495000, 520000, 535000, 567890,
      ],
    },
    all: {
      labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
      data: [150000, 220000, 300000, 380000, 480000, 567890],
    },
  };

  // 2. Data for Profit/Loss Chart
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

  // --- Chart Initializations ---

  // 1. Growth Chart
  const growthCtx = document.getElementById("growthChart").getContext("2d");
  const gradient = growthCtx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(34, 197, 94, 0.4)");
  gradient.addColorStop(1, "rgba(34, 197, 94, 0)");

  let growthChart = new Chart(growthCtx, {
    type: "line",
    data: {
      labels: growthChartData["6m"].labels,
      datasets: [
        {
          label: "Portfolio Value",
          data: growthChartData["6m"].data,
          borderColor: "#22c55e",
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#22c55e",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
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
          backgroundColor: "#000",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "#333",
          borderWidth: 1,
          padding: 10,
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
          },
          grid: { color: "rgba(255, 255, 255, 0.05)" },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });

  // 2. Distribution Pie Chart
  const distributionCtx = document
    .getElementById("distributionChart")
    .getContext("2d");
  const distributionChart = new Chart(distributionCtx, {
    type: "doughnut",
    data: {
      labels: ["Mutual Funds", "Stocks", "Fixed Deposits", "Gold"],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: ["#3b82f6", "#16a34a", "#f59e0b", "#8b5cf6"],
          borderWidth: 4,
          borderColor: "#1e1e1e", // Card background color
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#000",
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
          backgroundColor: "#22c55e",
          borderRadius: 4,
        },
        {
          label: "Loss",
          data: profitLossData["6m"].loss,
          backgroundColor: "#ef4444",
          borderRadius: 4,
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
          },
        },
        tooltip: {
          backgroundColor: "#000",
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
          },
          grid: { color: "rgba(255, 255, 255, 0.05)" },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });

  // --- Event Listeners for Dropdowns ---

  // 1. Listener for Growth Chart
  document.getElementById("timeRange").addEventListener("change", function () {
    const selectedRange = this.value;
    const newData = growthChartData[selectedRange];

    growthChart.data.labels = newData.labels;
    growthChart.data.datasets[0].data = newData.data;
    growthChart.update();
  });

  // 2. Listener for Profit/Loss Chart
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
});

// Add these two lines to your script
const dateElement = document.getElementById("currentDate");
dateElement.textContent = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
