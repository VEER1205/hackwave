window.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initCharts();
  initReferralCode();
  initScrollEffects();
  initNavLinks();
});

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
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      const navMenu = document.getElementById("navMenu");
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
      }
    });
  });
}

function initCharts() {
  initHeroChart();
  initActiveUsersChart();
  initVolumeChart();
}

function initHeroChart() {
  const canvas = document.getElementById("heroChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 300;
  const data = generateTradingData(50);

  function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    const gradient = ctx.createLinearGradient(
      0,
      padding,
      0,
      canvas.height - padding
    );
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.8)");
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.8)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y =
        canvas.height - padding - ((value - minValue) / range) * chartHeight;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    const areaGradient = ctx.createLinearGradient(
      0,
      padding,
      0,
      canvas.height - padding
    );
    areaGradient.addColorStop(0, "rgba(16, 185, 129, 0.3)");
    areaGradient.addColorStop(1, "rgba(16, 185, 129, 0.05)");
    ctx.fillStyle = areaGradient;
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.closePath();
    ctx.fill();
  }
  drawChart();
  let animationIndex = 0;
  setInterval(() => {
    data.shift();
    data.push(generateTradingDataPoint());
    animationIndex++;
    drawChart();
  }, 2000);
}

function initActiveUsersChart() {
  const canvas = document.getElementById("activeUsersChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 200;
  const data = generateUserData(24);

  function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const padding = 20;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / data.length - 4;
    const maxValue = Math.max(...data);
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + (chartWidth / data.length) * index;
      const y = canvas.height - padding - barHeight;
      const gradient = ctx.createLinearGradient(
        x,
        y,
        x,
        canvas.height - padding
      );
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.8)");
      gradient.addColorStop(1, "rgba(16, 185, 129, 0.3)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      if (index === data.length - 1) {
        ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    });
  }
  drawChart();
  setInterval(() => {
    data.shift();
    data.push(Math.floor(Math.random() * 50000) + 30000);
    drawChart();
  }, 3000);
}

function initVolumeChart() {
  const canvas = document.getElementById("volumeChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 200;
  const data = generateVolumeData(30);

  function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const padding = 20;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    const gradient = ctx.createLinearGradient(
      0,
      padding,
      0,
      canvas.height - padding
    );
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0.8)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y =
        canvas.height - padding - ((value - minValue) / range) * chartHeight;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    const areaGradient = ctx.createLinearGradient(
      0,
      padding,
      0,
      canvas.height - padding
    );
    areaGradient.addColorStop(0, "rgba(59, 130, 246, 0.2)");
    areaGradient.addColorStop(1, "rgba(59, 130, 246, 0.05)");
    ctx.fillStyle = areaGradient;
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.closePath();
    ctx.fill();
  }
  drawChart();
  setInterval(() => {
    data.shift();
    data.push(Math.floor(Math.random() * 200) + 100);
    drawChart();
  }, 2500);
}

function generateTradingData(length) {
  const data = [];
  let value = 100;
  for (let i = 0; i < length; i++) {
    value += (Math.random() - 0.5) * 10;
    value = Math.max(50, Math.min(150, value));
    data.push(value);
  }
  return data;
}

function generateTradingDataPoint() {
  return Math.floor(Math.random() * 100) + 50;
}

function generateUserData(length) {
  const data = [];
  for (let i = 0; i < length; i++) {
    data.push(Math.floor(Math.random() * 50000) + 30000);
  }
  return data;
}

function generateVolumeData(length) {
  const data = [];
  for (let i = 0; i < length; i++) {
    data.push(Math.floor(Math.random() * 200) + 100);
  }
  return data;
}

function initReferralCode() {
  const copyBtn = document.getElementById("copyCodeBtn");
  const referralCode = document.getElementById("referralCode");
  if (copyBtn && referralCode) {
    copyBtn.addEventListener("click", () => {
      referralCode.select();
      document.execCommand("copy");
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      copyBtn.style.background = "var(--accent-primary)";
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.background = "";
      }, 2000);
    });
  }
}

function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);
  const animateElements = document.querySelectorAll(
    ".feature-card, .step-card, .testimonial-card, .stat-card"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}
const stats = {
  activeUsers: 48392,
  volume: 156.8,
};
setInterval(() => {
  stats.activeUsers += Math.floor(Math.random() * 200) - 100;
  stats.activeUsers = Math.max(45000, Math.min(52000, stats.activeUsers));
  const activeUserElement = document.querySelector(".stat-info .stat-current");
  if (activeUserElement) {
    activeUserElement.textContent = `${stats.activeUsers.toLocaleString()} users online now`;
  }
  stats.volume += (Math.random() - 0.5) * 2;
  stats.volume = Math.max(150, Math.min(165, stats.volume));
  const volumeElements = document.querySelectorAll(".stat-info .stat-current");
  if (volumeElements[1]) {
    volumeElements[1].textContent = `$${stats.volume.toFixed(1)}M volume`;
  }
}, 5000);
