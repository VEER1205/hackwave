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
const quizData = [
  {
    question: "What is a 'bull market'?",
    options: [
      "A market where prices are falling",
      "A market where prices are rising",
      "A market with high volatility",
      "A market with low trading volume",
    ],
    correctAnswer: 1,
    explanation:
      "A bull market is characterized by rising prices and investor optimism. It's called 'bull' because bulls thrust their horns upward when attacking.",
  },
  {
    question: "What does IPO stand for?",
    options: [
      "Internal Profit Organization",
      "Initial Public Offering",
      "International Payment Order",
      "Investment Portfolio Overview",
    ],
    correctAnswer: 1,
    explanation:
      "IPO stands for Initial Public Offering, which is when a private company first sells shares to the public on a stock exchange.",
  },
  {
    question: "What is a call option?",
    options: [
      "The right to sell an asset at a specific price",
      "The right to buy an asset at a specific price",
      "An obligation to buy an asset",
      "A type of savings account",
    ],
    correctAnswer: 1,
    explanation:
      "A call option gives the holder the right (but not the obligation) to buy an asset at a predetermined price within a specific time period.",
  },
  {
    question: "What is diversification in investing?",
    options: [
      "Putting all money in one investment",
      "Spreading investments across different assets",
      "Only investing in technology stocks",
      "Keeping all money in cash",
    ],
    correctAnswer: 1,
    explanation:
      "Diversification is the practice of spreading investments across various financial instruments to reduce risk. It's the concept of 'not putting all eggs in one basket.'",
  },
  {
    question: "What is a P/E ratio?",
    options: [
      "Price to Equity ratio",
      "Profit to Expense ratio",
      "Price to Earnings ratio",
      "Portfolio to Exchange ratio",
    ],
    correctAnswer: 2,
    explanation:
      "P/E ratio (Price to Earnings) is calculated by dividing a company's stock price by its earnings per share. It's used to value a company and compare it with others.",
  },
  {
    question: "What does FDIC insurance protect?",
    options: [
      "Stock investments",
      "Bank deposits",
      "Cryptocurrency",
      "Real estate",
    ],
    correctAnswer: 1,
    explanation:
      "FDIC (Federal Deposit Insurance Corporation) insurance protects bank deposits up to $250,000 per depositor, per insured bank.",
  },
  {
    question: "What is a bear market?",
    options: [
      "A market where prices are rising",
      "A market where prices are falling by 20% or more",
      "A market with no trading",
      "A foreign exchange market",
    ],
    correctAnswer: 1,
    explanation:
      "A bear market occurs when prices fall 20% or more from recent highs, typically accompanied by widespread pessimism. Bears swipe downward when attacking.",
  },
  {
    question: "What is compound interest?",
    options: [
      "Interest calculated only on principal",
      "Interest on interest plus principal",
      "A type of bank fee",
      "Interest paid quarterly",
    ],
    correctAnswer: 1,
    explanation:
      "Compound interest is interest calculated on the initial principal plus accumulated interest from previous periods, allowing your money to grow exponentially.",
  },
  {
    question: "What is a dividend?",
    options: [
      "A company's debt payment",
      "A stock split",
      "A portion of company profits paid to shareholders",
      "A trading fee",
    ],
    correctAnswer: 2,
    explanation:
      "A dividend is a distribution of a portion of a company's earnings to its shareholders, usually paid quarterly in cash or additional shares.",
  },
  {
    question: "What is liquidity in finance?",
    options: [
      "How much cash a company has",
      "How easily an asset can be converted to cash",
      "The water content of an investment",
      "A type of investment strategy",
    ],
    correctAnswer: 1,
    explanation:
      "Liquidity refers to how quickly and easily an asset can be converted into cash without significantly affecting its price.",
  },
  {
    question: "What is a mutual fund?",
    options: [
      "A loan between friends",
      "A pooled investment managed by professionals",
      "A type of bank account",
      "A government bond",
    ],
    correctAnswer: 1,
    explanation:
      "A mutual fund pools money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities, managed by professional fund managers.",
  },
  {
    question: "What does ROI stand for?",
    options: [
      "Rate of Inflation",
      "Return on Investment",
      "Risk of Investment",
      "Rate of Interest",
    ],
    correctAnswer: 1,
    explanation:
      "ROI (Return on Investment) measures the profitability of an investment, calculated as (Gain - Cost) / Cost, usually expressed as a percentage.",
  },
  {
    question: "What is a stock split?",
    options: [
      "Dividing company profits",
      "Selling half your shares",
      "Increasing the number of shares while reducing price proportionally",
      "A trading strategy",
    ],
    correctAnswer: 2,
    explanation:
      "A stock split increases the number of shares outstanding while reducing the price per share proportionally. A 2-for-1 split gives you two shares for each one you owned.",
  },
  {
    question: "What is a put option?",
    options: [
      "The right to buy an asset",
      "The right to sell an asset at a specific price",
      "An obligation to sell an asset",
      "A type of bank deposit",
    ],
    correctAnswer: 1,
    explanation:
      "A put option gives the holder the right (but not the obligation) to sell an asset at a predetermined price within a specific time period.",
  },
  {
    question: "What is market capitalization?",
    options: [
      "The total value of a company's outstanding shares",
      "The capital gains tax rate",
      "The maximum market price",
      "The trading volume limit",
    ],
    correctAnswer: 0,
    explanation:
      "Market capitalization (market cap) is calculated by multiplying the current stock price by the total number of outstanding shares, representing the company's total value.",
  },
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;
let userAnswers = [];

function loadQuestion() {
  const question = quizData[currentQuestion];
  document.getElementById("question-text").textContent = question.question;
  document.getElementById("current-question").textContent = currentQuestion + 1;
  document.getElementById("total-questions").textContent = quizData.length;

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  document.getElementById("progress-fill").style.width = progress + "%";
  document.getElementById("progress-percentage").textContent =
    Math.round(progress) + "%";

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "option";
    optionDiv.textContent = option;
    optionDiv.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(optionDiv);
  });

  document.getElementById("explanation-container").innerHTML = "";
  document.getElementById("next-button").style.display = "none";
  selectedAnswer = null;
  answered = false;
}

function selectAnswer(index) {
  if (answered) return;

  selectedAnswer = index;
  answered = true;

  const question = quizData[currentQuestion];
  const options = document.querySelectorAll(".option");

  options.forEach((option, i) => {
    option.classList.add("disabled");
    if (i === question.correctAnswer) {
      option.classList.add("correct");
    } else if (i === selectedAnswer) {
      option.classList.add("incorrect");
    }
  });

  if (selectedAnswer === question.correctAnswer) {
    score++;
  }

  userAnswers.push({
    question: question.question,
    selected: question.options[selectedAnswer],
    correct: question.options[question.correctAnswer],
    isCorrect: selectedAnswer === question.correctAnswer,
  });

  const explanationDiv = document.createElement("div");
  explanationDiv.className = "explanation";
  explanationDiv.innerHTML = `
                 <div class="explanation-title">Explanation:</div>
                 <div>${question.explanation}</div>
             `;
  document.getElementById("explanation-container").appendChild(explanationDiv);

  document.getElementById("next-button").style.display = "block";
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  document.getElementById("quiz-container").style.display = "none";
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.style.display = "block";

  const percentage = Math.round((score / quizData.length) * 100);
  const incorrect = quizData.length - score;
  let coinsEarned = 0;

  // Determine performance level, message, and coins
  let performanceLevel = "";
  let performanceMessage = "";
  let performanceColor = "";

  if (percentage >= 90) {
    performanceLevel = "Outstanding! 🏆";
    performanceMessage =
      "You have an excellent understanding of finance and trading concepts. Your knowledge is impressive!";
    performanceColor = "hsl(160, 84%, 45%)";
    coinsEarned = percentage === 100 ? 100 : 75;
  } else if (percentage >= 75) {
    performanceLevel = "Great Job! 🌟";
    performanceMessage =
      "You have a solid grasp of finance fundamentals. Keep building on this strong foundation!";
    performanceColor = "hsl(170, 80%, 45%)";
    coinsEarned = 50;
  } else if (percentage >= 60) {
    performanceLevel = "Good Effort! 👍";
    performanceMessage =
      "You have a decent understanding, but there's room for improvement. Review the explanations below!";
    performanceColor = "hsl(180, 70%, 45%)";
    coinsEarned = 25;
  } else if (percentage >= 40) {
    performanceLevel = "Keep Learning! 📚";
    performanceMessage =
      "You're on the right track, but need more practice. Study the topics you missed and try again!";
    performanceColor = "hsl(45, 90%, 55%)";
    coinsEarned = 15;
  } else {
    performanceLevel = "Don't Give Up! 💪";
    performanceMessage =
      "Finance can be challenging, but practice makes perfect. Review all questions and retake the quiz!";
    performanceColor = "hsl(0, 84%, 60%)";
    coinsEarned = 10;
  }

  let reviewHTML = "";
  userAnswers.forEach((answer, index) => {
    reviewHTML += `
            <div class="review-item">
                <div class="review-question">
                    <span style="color: hsl(160, 84%, 45%); font-weight: bold;">Q${
                      index + 1
                    }.</span> ${answer.question}
                </div>
                <div class="review-answer ${
                  answer.isCorrect ? "correct" : "incorrect"
                }">
                    ${answer.isCorrect ? "✓" : "✗"} Your answer: ${
      answer.selected
    }
                </div>
                ${
                  !answer.isCorrect
                    ? `<div class="review-answer correct">✓ Correct answer: ${answer.correct}</div>`
                    : ""
                }
                <div style="margin-top: 8px; font-size: 0.875rem; color: hsl(180, 5%, 75%); font-style: italic;">
                    ${quizData[index].explanation}
                </div>
            </div>
        `;
  });

  resultsContainer.innerHTML = `
        <div class="results">
            <h2 style="color: ${performanceColor}; margin-bottom: 12px;">${performanceLevel}</h2>
            <div class="score">${score}/${quizData.length}</div>
            <div class="percentage">${percentage}% Correct</div>
            <p style="color: hsl(180, 5%, 75%); margin-bottom: 24px; line-height: 1.6;">
                ${performanceMessage}
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: hsl(220, 20%, 10%); padding: 16px; border-radius: 8px; border: 2px solid hsl(160, 84%, 45%);">
                    <div style="font-size: 0.875rem; color: hsl(180, 5%, 65%); margin-bottom: 4px;">Correct</div>
                    <div style="font-size: 2rem; font-weight: bold; color: hsl(160, 84%, 45%);">${score}</div>
                </div>
                <div style="background: hsl(220, 20%, 10%); padding: 16px; border-radius: 8px; border: 2px solid hsl(0, 84%, 60%);">
                    <div style="font-size: 0.875rem; color: hsl(180, 5%, 65%); margin-bottom: 4px;">Incorrect</div>
                    <div style="font-size: 2rem; font-weight: bold; color: hsl(0, 84%, 60%);">${incorrect}</div>
                </div>
                <div style="background: hsl(220, 20%, 10%); padding: 16px; border-radius: 8px; border: 2px solid hsl(180, 80%, 50%);">
                    <div style="font-size: 0.875rem; color: hsl(180, 5%, 65%); margin-bottom: 4px;">Accuracy</div>
                    <div style="font-size: 2rem; font-weight: bold; color: hsl(180, 80%, 50%);">${percentage}%</div>
                </div>
                 <div style="background: hsl(220, 20%, 10%); padding: 16px; border-radius: 8px; border: 2px solid hsl(50, 100%, 50%);">
                    <div style="font-size: 0.875rem; color: hsl(180, 5%, 65%); margin-bottom: 4px;">Coins Earned</div>
                    <div style="font-size: 2rem; font-weight: bold; color: hsl(50, 100%, 50%);">+${coinsEarned}</div>
                </div>
            </div>
            
            <button class="button button-primary" onclick="restartQuiz()">Retake Quiz</button>
            
            <div class="review-section">
                <h3 style="margin-bottom: 16px; font-size: 1.25rem;">Detailed Review</h3>
                <p style="color: hsl(180, 5%, 65%); margin-bottom: 16px; font-size: 0.875rem;">
                    Review each question below to understand the correct answers and explanations.
                </p>
                ${reviewHTML}
            </div>
        </div>
    `;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("results-container").style.display = "none";
  loadQuestion();
}

document.getElementById("next-button").addEventListener("click", nextQuestion);

// Initialize quiz
loadQuestion();
