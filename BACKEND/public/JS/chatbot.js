// --- NAVBAR SCRIPT START ---
function initNavbar() {
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

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
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
      }
    });
  });
}
// --- NAVBAR SCRIPT END ---

// Configuration
const API_BASE_URL = "https://hackathon-pflh.onrender.com";

// DOM elements
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesContainer = document.getElementById("messagesContainer");
const welcomeScreen = document.getElementById("welcomeScreen");
const fileInput = document.getElementById("fileInput");
const fileButton = document.querySelector(".input-button");

// State
let isLoading = false;
let messageCount = 0;

// Auto-resize textarea
messageInput.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 120) + "px";
  updateSendButton();
});

// Update send button state
function updateSendButton() {
  const hasText = messageInput.value.trim() !== "";
  sendButton.disabled = !hasText || isLoading;

  if (hasText && !isLoading) {
    sendButton.style.transform = "scale(1.05)";
  } else {
    sendButton.style.transform = "scale(1)";
  }
}

// File attachment
fileButton.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  if (files.length > 0) {
    const fileNames = files.map((f) => f.name).join(", ");
    showNotification(
      `📎 ${files.length} file(s) selected: ${fileNames}`,
      "info"
    );
  }
});

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 12px 16px;
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: var(--shadow-primary);
        max-width: 300px;
      `;

  if (type === "error") {
    notification.style.borderColor = "var(--error-color)";
    notification.style.background = "rgba(255, 71, 87, 0.1)";
  } else if (type === "success") {
    notification.style.borderColor = "var(--success-color)";
    notification.style.background = "rgba(46, 213, 115, 0.1)";
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// API call to backend
async function callGeminiAPI(prompt) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ask/?prompt=${encodeURIComponent(prompt)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("API call failed:", error);
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to server. Please ensure the backend is running."
      );
    }
    throw error;
  }
}

// Send message function
async function sendMessage() {
  const message = messageInput.value.trim();
  if (message === "" || isLoading) return;

  isLoading = true;
  updateSendButton();

  if (welcomeScreen.style.display !== "none") {
    welcomeScreen.style.display = "none";
  }

  addMessage(message, "user");
  messageInput.value = "";
  messageInput.style.height = "auto";

  const loadingMessageId = addLoadingMessage();

  try {
    const response = await callGeminiAPI(message);
    removeMessage(loadingMessageId);
    addMessage(response, "assistant");
    updateStatus("success");
  } catch (error) {
    removeMessage(loadingMessageId);
    addErrorMessage(error.message);
    updateStatus("error");
    showNotification("Failed to get AI response", "error");
  } finally {
    isLoading = false;
    updateSendButton();
  }
}

// Add message to chat
function addMessage(text, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", `${sender}-message`);
  messageElement.id = generateMessageId();
  messageElement.style.animationDelay = `${messageCount * 0.1}s`;
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  messageElement.innerHTML = `
        <div class="message-header">
          <div class="avatar ${sender}-avatar">${
    sender === "user" ? "U" : "F"
  }</div>
          <div class="sender-name">${sender === "user" ? "You" : "Futuro"}</div>
          <div class="timestamp">${timeString}</div>
        </div>
        <div class="message-content">${formatMessage(text)}</div>
      `;

  messagesContainer.appendChild(messageElement);
  messageCount++;
  scrollToBottom();
  return messageElement.id;
}

function addLoadingMessage() {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "assistant-message");
  messageElement.id = generateMessageId();
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  messageElement.innerHTML = `
        <div class="message-header">
          <div class="avatar assistant-avatar">F</div>
          <div class="sender-name">Futuro</div>
          <div class="timestamp">${timeString}</div>
        </div>
        <div class="message-content">
          <div class="loading-message">
            <div class="loading-dots">
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
            </div>
            <span>Thinking...</span>
          </div>
        </div>
      `;

  messagesContainer.appendChild(messageElement);
  scrollToBottom();
  return messageElement.id;
}

function addErrorMessage(errorText) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "assistant-message");
  messageElement.id = generateMessageId();
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  messageElement.innerHTML = `
        <div class="message-header">
          <div class="avatar assistant-avatar">F</div>
          <div class="sender-name">Futuro</div>
          <div class="timestamp">${timeString}</div>
        </div>
        <div class="message-content">
          <div class="error-message">
            <div class="error-icon">⚠️</div>
            <div class="error-content">
              <div class="error-title">Unable to Process Request</div>
              <div class="error-text">${errorText}</div>
            </div>
          </div>
        </div>
      `;

  messagesContainer.appendChild(messageElement);
  scrollToBottom();
  return messageElement.id;
}

function removeMessage(messageId) {
  const messageElement = document.getElementById(messageId);
  if (messageElement) {
    messageElement.style.animation = "fadeOut 0.3s ease";
    setTimeout(() => messageElement.remove(), 300);
  }
}

function formatMessage(text) {
  return text
    .replace(/\n/g, "<br>")
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/```([^`]+)```/g, "<pre><code>$1</code></pre>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>");
}

function generateMessageId() {
  return "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
}

function scrollToBottom() {
  const scrollHeight = messagesContainer.scrollHeight;
  const height = messagesContainer.clientHeight;
  const maxScrollTop = scrollHeight - height;
  messagesContainer.scrollTo({
    top: maxScrollTop > 0 ? maxScrollTop : 0,
    behavior: "smooth",
  });
}

function updateStatus(status) {
  const statusDot = document.querySelector(".status-dot");
  const statusText = document.querySelector(".status-indicator span");
  if (!statusDot || !statusText) return;

  if (status === "success") {
    statusDot.style.background = "var(--success-color)";
    statusText.textContent = "Online";
  } else if (status === "error") {
    statusDot.style.background = "var(--error-color)";
    statusText.textContent = "Error";
    setTimeout(() => {
      statusDot.style.background = "var(--success-color)";
      statusText.textContent = "Online";
    }, 3000);
  }
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

const promptChips = document.querySelectorAll(".prompt-chip");
promptChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const text = chip.textContent.replace(/^[^\s]+\s/, "");
    messageInput.value = text;
    messageInput.dispatchEvent(new Event("input"));
    messageInput.focus();

    const ripple = document.createElement("div");
    ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(0, 170, 255, 0.3);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
    chip.style.position = "relative";
    chip.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

const style = document.createElement("style");
style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
      }
      @keyframes ripple {
        from {
          width: 0; height: 0; opacity: 1; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
        to {
          width: 200px; height: 200px; opacity: 0; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    `;
document.head.appendChild(style);

// Initialize
initNavbar();
initNavLinks();
updateSendButton();

setTimeout(() => {
  if (messagesContainer.children.length === 1) {
    showNotification("👋 Welcome! Try asking me anything!", "info");
  }
}, 2000);

fetch(`${API_BASE_URL}/health`)
  .then((response) => response.json())
  .then(() => {
    showNotification("🚀 Connected to Futuro AI", "success");
    updateStatus("success");
  })
  .catch(() => {
    showNotification("⚠️ Backend not connected", "error");
    updateStatus("error");
  });
