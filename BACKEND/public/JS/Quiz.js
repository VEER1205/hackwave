// Financial literacy questions database
const questionBank = [
  {
    question: "What does SIP stand for in mutual fund investments?",
    options: [
      "Systematic Investment Plan",
      "Simple Interest Plan",
      "Secure Investment Portfolio",
      "Standard Investment Process",
    ],
    correct: 0,
  },
  {
    question:
      "Which type of bank account typically offers the highest interest rate?",
    options: [
      "Savings Account",
      "Current Account",
      "Fixed Deposit",
      "Salary Account",
    ],
    correct: 2,
  },
  {
    question:
      "What is the maximum insurance coverage provided by FDIC for bank deposits?",
    options: ["$100,000", "$250,000", "$500,000", "$1,000,000"],
    correct: 1,
  },
  {
    question: "Which of these is NOT a type of mutual fund?",
    options: ["Equity Fund", "Debt Fund", "Hybrid Fund", "Credit Fund"],
    correct: 3,
  },
  {
    question: "What should you do if you suspect credit card fraud?",
    options: [
      "Wait and see",
      "Contact bank immediately",
      "Use card more to test",
      "Ignore small amounts",
    ],
    correct: 1,
  },
  {
    question: "What is a good credit score range?",
    options: ["300-500", "500-650", "650-750", "750-850"],
    correct: 3,
  },
  {
    question:
      "Which investment has the highest risk but potentially highest returns?",
    options: [
      "Fixed Deposits",
      "Government Bonds",
      "Stocks",
      "Savings Account",
    ],
    correct: 2,
  },
  {
    question: "What does APR stand for in credit cards?",
    options: [
      "Annual Percentage Rate",
      "Average Payment Rate",
      "Automatic Payment Rate",
      "Annual Premium Rate",
    ],
    correct: 0,
  },
  {
    question: "Which is the safest investment option?",
    options: ["Cryptocurrency", "Stocks", "Government Bonds", "Forex Trading"],
    correct: 2,
  },
  {
    question: "What is the 50/30/20 rule in budgeting?",
    options: [
      "50% savings, 30% needs, 20% wants",
      "50% needs, 30% wants, 20% savings",
      "50% wants, 30% savings, 20% needs",
      "50% investments, 30% expenses, 20% emergency",
    ],
    correct: 1,
  },
  {
    question: "What is compound interest?",
    options: [
      "Interest on principal only",
      "Interest on interest",
      "Fixed interest rate",
      "Simple interest calculation",
    ],
    correct: 1,
  },
  {
    question: "Which document is required to open a bank account?",
    options: [
      "Only Aadhaar Card",
      "Only PAN Card",
      "KYC documents",
      "Only passport",
    ],
    correct: 2,
  },
  {
    question: "What is the purpose of an emergency fund?",
    options: [
      "Investment growth",
      "Tax savings",
      "Unexpected expenses",
      "Luxury purchases",
    ],
    correct: 2,
  },
  {
    question: "Which type of insurance is mandatory for vehicles?",
    options: [
      "Comprehensive Insurance",
      "Third-party Insurance",
      "Zero Depreciation",
      "Personal Accident",
    ],
    correct: 1,
  },
  {
    question: "What is diversification in investing?",
    options: [
      "Buying one stock",
      "Spreading investments",
      "Timing the market",
      "Following trends",
    ],
    correct: 1,
  },
];

// Game state
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timer = null;
let questionStartTime = 0;
let userData = JSON.parse(localStorage.getItem("quizUserData")) || {
  coins: 100,
  dailyStreak: 0,
  lastQuizDate: null,
  totalScore: 0,
  quizzesTaken: 0,
};

// Initialize app
function init() {
  updateUserStats();
  updateLeaderboard();
  checkDailyQuizStatus();
}

function checkDailyQuizStatus() {
  const today = new Date().toDateString();
  const startBtn = document.getElementById("startBtn");

  if (userData.lastQuizDate === today) {
    startBtn.textContent = "Quiz Already Completed Today";
    startBtn.disabled = true;
    startBtn.style.opacity = "0.5";
    startBtn.style.cursor = "not-allowed";
  }
}

function updateUserStats() {
  document.getElementById("userCoins").textContent = userData.coins;
  document.getElementById("dailyStreak").textContent = userData.dailyStreak;

  const leaderboard = getLeaderboard();
  const userRank = leaderboard.findIndex((user) => user.id === "current") + 1;
  document.getElementById("userRank").textContent = userRank || "-";
}

function generateDailyQuestions() {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  // Seeded random function
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  const shuffled = [...questionBank];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 7);
}

function startQuiz() {
  const today = new Date().toDateString();
  if (userData.lastQuizDate === today) return;

  currentQuestions = generateDailyQuestions();
  currentQuestionIndex = 0;
  score = 0;

  document.getElementById("welcomeScreen").classList.add("hidden");
  document.getElementById("leaderboardScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");

  showQuestion();
}

function showQuestion() {
  if (currentQuestionIndex >= currentQuestions.length) {
    endQuiz();
    return;
  }

  const question = currentQuestions[currentQuestionIndex];
  const progress = (currentQuestionIndex / currentQuestions.length) * 100;

  document.getElementById("questionNumber").textContent = `Question ${
    currentQuestionIndex + 1
  } of ${currentQuestions.length}`;
  document.getElementById("questionText").textContent = question.question;
  document.getElementById("progressFill").style.width = progress + "%";

  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "option";
    optionDiv.textContent = option;
    optionDiv.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(optionDiv);
  });

  startTimer();
}

function startTimer() {
  timeLeft = 15;
  questionStartTime = Date.now();
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      selectAnswer(-1); // Time's up
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerCircle = document.getElementById("timerCircle");
  timerCircle.textContent = timeLeft;

  const percentage = (timeLeft / 15) * 360;
  timerCircle.style.background = `conic-gradient(#10b981 ${percentage}deg, #1e293b ${percentage}deg)`;
}

function selectAnswer(selectedIndex) {
  clearInterval(timer);

  const question = currentQuestions[currentQuestionIndex];
  const options = document.querySelectorAll(".option");
  const responseTime = Date.now() - questionStartTime;

  // Show correct/incorrect answers
  options.forEach((option, index) => {
    if (index === question.correct) {
      option.classList.add("correct");
    } else if (index === selectedIndex && selectedIndex !== question.correct) {
      option.classList.add("incorrect");
    }
    option.onclick = null; // Disable clicking
  });

  // Calculate score based on correctness and speed
  if (selectedIndex === question.correct) {
    const speedBonus = Math.max(0, Math.floor((15000 - responseTime) / 100));
    const questionScore = 100 + speedBonus;
    score += questionScore;
  }

  // Move to next question after delay
  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion();
  }, 2000);
}

function endQuiz() {
  const today = new Date().toDateString();

  // Update user data
  userData.lastQuizDate = today;
  userData.totalScore += score;
  userData.quizzesTaken++;

  // Calculate coins earned
  let coinsEarned = 100; // Base participation reward
  if (score >= 700) coinsEarned += 50; // High score bonus

  userData.coins += coinsEarned;
  

  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (userData.lastQuizDate === yesterday.toDateString()) {
    userData.dailyStreak++;
  } else {
    userData.dailyStreak = 1;
  }

  // Save to localStorage
  localStorage.setItem("quizUserData", JSON.stringify(userData));

  // Update leaderboard
  updateLeaderboard();

  // Show results
  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("resultsScreen").classList.remove("hidden");
  document.getElementById("finalScore").textContent = score;
  document.getElementById(
    "coinsEarned"
  ).textContent = `+${coinsEarned} Coins Earned!`;

  let message = "";
  if (score >= 700) message = "Excellent! You're a financial expert! 🏆";
  else if (score >= 500) message = "Great job! Keep learning! 📈";
  else if (score >= 300) message = "Good effort! Practice makes perfect! 💪";
  else message = "Keep studying! You'll improve! 📚";

  document.getElementById("resultMessage").textContent = message;

  updateUserStats();
}

function getLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("quizLeaderboard")) || [];

  // Add/update current user
  const existingIndex = leaderboard.findIndex((user) => user.id === "current");
  const currentUser = {
    id: "current",
    name: "You",
    score: userData.totalScore,
    coins: userData.coins,
    quizzes: userData.quizzesTaken,
  };

  if (existingIndex >= 0) {
    leaderboard[existingIndex] = currentUser;
  } else {
    leaderboard.push(currentUser);
  }

  // Sort by total score
  leaderboard.sort((a, b) => b.score - a.score);

  return leaderboard;
}

function updateLeaderboard() {
  const leaderboard = getLeaderboard();
  localStorage.setItem("quizLeaderboard", JSON.stringify(leaderboard));

  const leaderboardList = document.getElementById("leaderboardList");
  leaderboardList.innerHTML = "";

  leaderboard.slice(0, 10).forEach((user, index) => {
    const item = document.createElement("div");
    item.className = "leaderboard-item";
    if (user.id === "current") {
      item.style.border = "2px solid #10b981";
    }

    item.innerHTML = `
                    <div class="leaderboard-rank">#${index + 1}</div>
                    <div class="leaderboard-name">${user.name}</div>
                    <div class="leaderboard-score">${user.score} pts</div>
                `;

    leaderboardList.appendChild(item);
  });
}

function showLeaderboard() {
  document.getElementById("resultsScreen").classList.add("hidden");
  document.getElementById("leaderboardScreen").classList.remove("hidden");
}

function resetToWelcome() {
  document.getElementById("leaderboardScreen").classList.add("hidden");
  document.getElementById("resultsScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("welcomeScreen").classList.remove("hidden");

  checkDailyQuizStatus();
}

// Initialize the app
init();
