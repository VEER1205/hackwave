// Data and Logic
let savedMoney = 5000;
let enrolledCourses = [];

const courses = [
  {
    id: 1,
    title: "Personal Budgeting Mastery",
    icon: "📊",
    description:
      "Learn to create and stick to a budget that works for your lifestyle. Master expense tracking, goal setting, and financial planning fundamentals.",
    duration: "4 weeks",
    lessons: "12 lessons",
    price: 299,
    level: "Beginner",
  },
  {
    id: 2,
    title: "Investment Fundamentals",
    icon: "📈",
    description:
      "Discover the world of investing with stocks, bonds, ETFs, and mutual funds. Build a diversified portfolio and understand risk management.",
    duration: "6 weeks",
    lessons: "18 lessons",
    price: 499,
    level: "Intermediate",
  },
  {
    id: 3,
    title: "Debt Management & Credit Repair",
    icon: "💳",
    description:
      "Strategic approaches to eliminate debt, improve credit scores, and negotiate with creditors. Includes debt consolidation strategies.",
    duration: "5 weeks",
    lessons: "15 lessons",
    price: 399,
    level: "Beginner",
  },
  {
    id: 4,
    title: "Real Estate Investment Basics",
    icon: "🏠",
    description:
      "Learn about property investment, rental income strategies, REITs, and real estate market analysis for beginners.",
    duration: "8 weeks",
    lessons: "24 lessons",
    price: 699,
    level: "Intermediate",
  },
  {
    id: 5,
    title: "Retirement Planning Strategies",
    icon: "🏖️",
    description:
      "Comprehensive guide to 401(k)s, IRAs, pension plans, and retirement savings strategies. Plan for a secure financial future.",
    duration: "6 weeks",
    lessons: "20 lessons",
    price: 549,
    level: "Intermediate",
  },
  {
    id: 6,
    title: "Tax Optimization & Planning",
    icon: "📋",
    description:
      "Maximize your tax savings with legal strategies, deductions, and smart financial planning throughout the year.",
    duration: "4 weeks",
    lessons: "14 lessons",
    price: 449,
    level: "Advanced",
  },
  {
    id: 7,
    title: "Emergency Fund Building",
    icon: "🛡️",
    description:
      "Build a robust emergency fund to protect against financial hardships. Learn saving strategies and where to keep emergency funds.",
    duration: "3 weeks",
    lessons: "10 lessons",
    price: 199,
    level: "Beginner",
  },
  {
    id: 8,
    title: "Cryptocurrency & Digital Assets",
    icon: "₿",
    description:
      "Understanding Bitcoin, Ethereum, and other cryptocurrencies. Learn about blockchain technology and digital asset investment.",
    duration: "5 weeks",
    lessons: "16 lessons",
    price: 599,
    level: "Advanced",
  },
  {
    id: 9,
    title: "Small Business Financial Management",
    icon: "💼",
    description:
      "Financial strategies for entrepreneurs including cash flow management, business banking, and growth funding options.",
    duration: "7 weeks",
    lessons: "22 lessons",
    price: 799,
    level: "Advanced",
  },
  {
    id: 10,
    title: "Insurance & Risk Management",
    icon: "☂️",
    description:
      "Understand life, health, auto, and property insurance. Learn to assess your insurance needs and optimize coverage.",
    duration: "4 weeks",
    lessons: "13 lessons",
    price: 349,
    level: "Intermediate",
  },
  {
    id: 11,
    title: "Financial Goal Setting & Achievement",
    icon: "🎯",
    description:
      "Set SMART financial goals and create actionable plans to achieve them. Track progress and stay motivated.",
    duration: "3 weeks",
    lessons: "9 lessons",
    price: 249,
    level: "Beginner",
  },
  {
    id: 12,
    title: "Advanced Portfolio Management",
    icon: "⚖️",
    description:
      "Professional portfolio management techniques, asset allocation strategies, and advanced investment concepts.",
    duration: "10 weeks",
    lessons: "30 lessons",
    price: 999,
    level: "Advanced",
  },
];

function updateMoneyDisplay() {
  document.getElementById(
    "saved-money"
  ).textContent = `${savedMoney.toLocaleString()} VC`;
}

function createCourseCard(course) {
  const isEnrolled = enrolledCourses.includes(course.id);
  return `
                <div class="course-card">
                    <div class="course-header">
                        <span class="course-icon">${course.icon}</span>
                        <h3 class="course-title">${course.title}</h3>
                    </div>
                    <p class="course-description">${course.description}</p>
                    <div class="course-details">
                        <span>⏱️ ${course.duration}</span>
                        <span>📚 ${course.lessons}</span>
                        <span>🎓 ${course.level}</span>
                    </div>
                    <div class="course-price">${
                      course.price
                    } <span class="vc">VC</span></div>
                    <button class="enroll-btn ${isEnrolled ? "enrolled" : ""}" 
                            onclick="enrollCourse(${course.id}, event)" 
                            ${isEnrolled ? "disabled" : ""}>
                        ${isEnrolled ? "✅ Enrolled" : "Enroll Now"}
                    </button>
                </div>
            `;
}

function renderCourses() {
  const grid = document.getElementById("courses-grid");
  grid.innerHTML = courses.map((course) => createCourseCard(course)).join("");
}

function enrollCourse(courseId, event) {
  const course = courses.find((c) => c.id === courseId);
  const button = event.target;

  if (enrolledCourses.includes(courseId)) {
    return;
  }

  if (savedMoney < course.price) {
    button.classList.add("insufficient-funds");
    setTimeout(() => button.classList.remove("insufficient-funds"), 500);
    showModal(
      "Insufficient Funds",
      `You need ${(
        course.price - savedMoney
      ).toLocaleString()} more VC to enroll in this course.`
    );
    return;
  }

  savedMoney -= course.price;
  enrolledCourses.push(courseId);
  updateMoneyDisplay();
  renderCourses();

  showModal(
    "Enrollment Successful!",
    `You have successfully enrolled in "${course.title}". Good luck on your learning journey!`
  );
}

function showModal(title, message) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-message").textContent = message;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Initialize and event listeners
document.addEventListener("DOMContentLoaded", () => {
  updateMoneyDisplay();
  renderCourses();

  const modal = document.getElementById("modal");
  modal.addEventListener("click", function (e) {
    if (e.target === this) {
      closeModal();
    }
  });
});
