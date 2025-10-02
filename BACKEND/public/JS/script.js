const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});


// Add some interactive money animations
function createFloatingMoney() {
  const money = document.createElement("div");
  money.innerHTML = "₹";
  money.className = "money-animation";
  money.style.left = Math.random() * 100 + "%";
  money.style.animationDelay = Math.random() * 6 + "s";
  document.body.appendChild(money);

  setTimeout(() => {
    money.remove();
  }, 6000);
}

// Create floating money every 2 seconds
setInterval(createFloatingMoney, 2000);
