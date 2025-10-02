// Initialize Lucide icons
lucide.createIcons();

async function fetchPortfolio(email) {
        try {
          const response = await fetch(`https://paisabuddy-xzcz.onrender.com/api/portfolio?email=${email}`); // change URL for deployment
          const data = await response.json();

          const tableBody = document.getElementById("portfolioBody");
          tableBody.innerHTML = "";

          data.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${item.asset_name}</td>
            <td>${item.price}</td>
          `;
            tableBody.appendChild(row);
          });
        } catch (error) {
          console.error("Failed to load portfolio:", error);
        }
      }

async function loadUser() {
        try {
          const res = await fetch("/api/me");
          if (!res.ok) throw new Error("Not logged in");

          const user = await res.json();
          document.getElementById(
            "userInfo"
          ).innerText = `Logged in as: ${user.email}`;
          return user;
        } catch (err) {
          document.getElementById("userInfo").innerText =
            "You are not logged in.";
        }
      }
const value = document.getElementById("portfolio-value")
user = loadUser();
value.textContent = "₹" + fetchPortfolio(user.email);

// Money animations
function createFloatingMoney() {
  const symbols = ["₹", "💰", "💸", "💵"];
  const container = document.getElementById("money-animations");

  setInterval(() => {
    const symbol = document.createElement("div");
    symbol.className = "money-symbol animate-float";
    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    symbol.style.left = Math.random() * 100 + "%";
    symbol.style.animationDelay = Math.random() * 2 + "s";
    symbol.style.animationDuration = Math.random() * 3 + 4 + "s";

    container.appendChild(symbol);

    setTimeout(() => {
      symbol.remove();
    }, 7000);
  }, 2000);
}

// Animate saved amount counter
function animateCounter() {
  const element = document.getElementById("saved-amount");
  const target = 12450;
  let current = 0;
  const increment = target / 100;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = "₹" + Math.floor(current).toLocaleString();
  }, 50);
}

// Animate active users
function animateActiveUsers() {
  const element = document.getElementById("active-users");
  const values = ["2.4K", "2.5K", "2.3K", "2.6K"];
  let index = 0;

  setInterval(() => {
    element.textContent = values[index];
    index = (index + 1) % values.length;
  }, 3000);
}

// Initialize animations
document.addEventListener("DOMContentLoaded", () => {
  createFloatingMoney();
  animateCounter();
  animateActiveUsers();
});
