require("dotenv").config();
const cookieParser = require("cookie-parser");
const {
  addUser,
  getAllNumberOfUsers,
  getUserBalance,
  updateUserBalance,
  getPortfolio,
  upsertPortfolioHolding,
  insertTrade,
  getUserTrades,
  getUserWatchlist,
  executeTrade,
  addToWatchlist,
  removeFromWatchlist,
} = require("./schemaa.js");
const {
  getGoogleLoginPage,
  getGoogleLoginCallback,
  loginWithEmail,
  getGithubLoginPage,
  getGithubLoginCallback,
  getLinkedInLoginPage,
  getLinkedInLoginCallback,
  sendPasswordResetEmail,
  handlePasswordReset,
} = require("./auth.js");
const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

function requireAuth(req, res, next) {
  try {
    const userCookie = req.cookies.user;
    if (!userCookie) {
      return res
        .status(401)
        .json({ success: false, message: "Please log in first" });
    }

    const user = JSON.parse(userCookie);
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth check failed:", err);
    return res
      .status(401)
      .json({ success: false, message: "Please log in first" });
  }
}

app.use((req, res, next) => {
  res.flash = (type, message) => {
    res.cookie("flash", JSON.stringify({ type, message }), {
      maxAge: 5000,
      httpOnly: true,
    });
  };

  if (req.cookies.flash) {
    try {
      const flash = JSON.parse(req.cookies.flash);
      res.locals[flash.type] = [flash.message];
    } catch (e) {
      res.locals.errors = [];
      res.locals.success = [];
    }
    res.clearCookie("flash");
  } else {
    res.locals.errors = [];
    res.locals.success = [];
  }

  next();
});

app.get("/", (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    throw error;
  }
});

app.get("/login", (req, res) => {
  try {
    res.render("login", {
      errors: res.locals.errors,
      success: res.locals.success,
    });
  } catch (error) {
    throw error;
  }
});

app.get("/register", (req, res) => {
  try {
    res.render("login", {
      errors: res.locals.errors,
      success: res.locals.success,
    });
  } catch (error) {
    throw error;
  }
});

app.post("/register", (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.flash("errors", "Passwords do not match!");
    return res.redirect("/login");
  }

  bcrypt.hash(password, 10, (err, result) => {
    if (err) {
      res.flash("Failed to Sign Up !!! Please try Again");
      return res.redirect("/login");
    }

    addUser(fullname, email, result, res);
  });
});

app.get("/forgot-password", (req, res) => {
  res.render("forgot", {
    errors: res.locals.errors,
    success: res.locals.success,
  });
});

app.get("/reset-password", (req, res) => {
  const { token, id } = req.query;
  res.render("reset-password", {
    token,
    userId: id,
    errors: res.locals.errors,
  });
});

app.post("/forgot-password", sendPasswordResetEmail);
app.post("/reset-password", handlePasswordReset);

app.get("/Quiz", (req, res) => {
  res.render("Quiz", {
    errors: res.locals.errors,
    success: res.locals.success,
  });
});

app.get("/chatbot", (req, res) => {
  res.render("chatbot", {
    errors: res.locals.errors,
    success: res.locals.success,
  });
});

app.get("/landing", (req, res) => {
  res.render("landing", {
    errors: res.locals.errors,
    success: res.locals.success,
  });
});

app.get("/game", (req, res) => {
  res.render("game", {
    errors: res.locals.errors,
    success: res.locals.success,
  });
});

app.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard", {
    errors: res.locals.errors,
    success: res.locals.success,
    user: req.user, // pass user info
  });
});

app.get("/trading", requireAuth, (req, res) => {
  res.render("trading", {
    errors: res.locals.errors,
    success: res.locals.success,
    user: req.user,
  });
});

app.get("/course", requireAuth, (req, res) => {
  res.render("course", {
    errors: res.locals.errors,
    success: res.locals.success,
    user: req.user,
  });
});

app.get("/api/users/count", async (req, res) => {
  try {
    const count = await getAllNumberOfUsers();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user count" });
  }
});

app.get("/api/portfolio", async (req, res) => {
  try {
    const data = await getPortfolio(req.email);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

app.get("/api/user/balance", async (req, res) => {
  try {
    const userCookie = req.cookies.user;
    if (!userCookie) return res.status(401).json({ error: "Not logged in" });

    const user = JSON.parse(userCookie);
    const balance = await getUserBalance(user.user_id);

    res.json({ balance }); // ✅ return as { balance: number }
  } catch (err) {
    console.error("❌ GET /api/user/balance error:", err);
    res.status(500).json({ error: "Failed to fetch user balance" });
  }
});

app.get("/api/user/balance", requireAuth, async (req, res) => {
  try {
    const balance = await getUserBalance(req.user.user_id);
    res.json({ balance });
  } catch (err) {
    console.error("❌ GET /api/user/balance error:", err);
    res.status(500).json({ error: "Failed to fetch user balance" });
  }
});

// Get user portfolio
app.get("/api/portfolio", requireAuth, async (req, res) => {
  try {
    const holdings = await getPortfolio(req.user.user_id);
    res.json({ holdings });
  } catch (err) {
    console.error("❌ GET /api/portfolio error:", err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

// Get user trades
app.get("/api/trades", requireAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const trades = await getUserTrades(req.user.user_id, limit);
    res.json({ trades });
  } catch (err) {
    console.error("❌ GET /api/trades error:", err);
    res.status(500).json({ error: "Failed to fetch trades" });
  }
});

// Execute trade (BUY/SELL)
app.post("/api/trade", requireAuth, async (req, res) => {
  try {
    const { type, side, symbol, name, qty, price } = req.body;

    if (!type || !side || !symbol || !qty || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const userId = req.user.user_id;
    executeTrade(userId, { type, side, symbol, name, qty, price });
  } catch (err) {
    console.error("❌ POST /api/trade error:", err);
    res.status(500).json({ error: "Failed to execute trade" });
  }
});

// Get watchlist
app.get("/api/watchlist", requireAuth, async (req, res) => {
  try {
    const watchlist = await getUserWatchlist(req.user.user_id);
    res.json({ watchlist });
  } catch (err) {
    console.error("❌ GET /api/watchlist error:", err);
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

// Add to watchlist
app.post("/api/watchlist", requireAuth, async (req, res) => {
  try {
    const { type, symbol, name } = req.body;

    if (!type || !symbol) {
      return res.status(400).json({ error: "Missing type or symbol" });
    }

    await addToWatchlist(req.user.user_id, type, symbol, name || symbol);
    res.json({ success: true, message: "Added to watchlist" });
  } catch (err) {
    console.error("❌ POST /api/watchlist error:", err);
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
});

// Remove from watchlist
app.delete("/api/watchlist/:symbol", requireAuth, async (req, res) => {
  try {
    const { symbol } = req.params;
    await removeFromWatchlist(req.user.user_id, symbol);
    res.json({ success: true, message: "Removed from watchlist" });
  } catch (err) {
    console.error("❌ DELETE /api/watchlist error:", err);
    res.status(500).json({ error: "Failed to remove from watchlist" });
  }
});

// Get user info
app.get("/api/me", requireAuth, (req, res) => {
  res.json({
    email: req.user.email,
    name: req.user.name,
    user_id: req.user.user_id,
  });
});

app.post("/login", loginWithEmail);

app.get("/google", getGoogleLoginPage);
app.get("/google/callback", getGoogleLoginCallback);

app.get("/github", getGithubLoginPage);
app.get("/github/callback", getGithubLoginCallback);

app.get("/linkedin", getLinkedInLoginPage);
app.get("/linkedin/callback", getLinkedInLoginCallback);

app.listen(port, (req, res) => {
  console.log(`Listening at ${port}`);
});
