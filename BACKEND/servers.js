require("dotenv").config();
const cookieParser = require("cookie-parser");
const { addUser } = require("./schemaa.js");
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

app.get("/landing", (req, res) => {
  res.render("landing", {
    errors: res.locals.errors,
    success: res.locals.success,
  });
});

app.get("/course", (req, res) => {
  res.render("course", {
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

app.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    errors: res.locals.errors,
    success: res.locals.success,
  });
});

app.get("/trading", (req, res) => {
  res.render("trading", {
    errors: res.locals.errors,
    success: res.locals.success,
  });
});

app.get("/api/portfolio", async (req, res) => {
  try {
    const data = await getPortFolio(req.email);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});



app.get("/api/me", (req, res) => {
  try {
    const userCookie = req.cookies.user;
    if (!userCookie) return res.status(401).json({ error: "Not logged in" });

    const user = JSON.parse(userCookie);
    res.json({ email: user.email, name: user.name });
  } catch (err) {
    console.error("Error parsing user cookie:", err);
    res.status(500).json({ error: "Internal server error" });
  }
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
