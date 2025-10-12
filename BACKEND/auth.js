const arctic = require("arctic");
const bcrypt = require("bcrypt");
require("dotenv").config();
const {
  createUserWithOauth,
  linkUserWithOauth,
  getUserWithOauthId,
  getUserByEmail,
  updateUserPassword,
  storeResetToken,
  verifyResetToken,
  clearResetToken,
} = require("./schemaa.js");
require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const google = new arctic.Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);
const github = new arctic.GitHub(
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET,
  process.env.GITHUB_REDIRECT_URL
);

const linkedin = new arctic.LinkedIn(
  process.env.LINKEDIN_CLIENT_ID,
  process.env.LINKEDIN_CLIENT_SECRET,
  process.env.LINKEDIN_REDIRECT_URL
);

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendPasswordResetEmail(req, res) {
  const { email } = req.body;

  if (!email) {
    res.flash("errors", "Email is required");
    return res.redirect("/forgot-password");
  }

  try {
    // 1. Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      // Security: Don't reveal if email exists
      res.flash(
        "success",
        "If an account exists with this email, a reset link has been sent"
      );
      return res.redirect("/login");
    }

    // 2. Generate reset token using built-in crypto
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // 3. Store token in database
    await storeResetToken(user.user_id, resetToken, resetTokenExpiry);

    // 4. Create reset URL
    const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}&id=${user.user_id}`;

    // 5. Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };
    await transporter.sendMail(mailOptions);

    res.flash("success", "Password reset link has been sent to your email");
    res.redirect("/login");
  } catch (error) {
    console.error("Password reset error:", error);
    res.flash("errors", "Error sending reset email. Please try again.");
    res.redirect("/forgot-password");
  }
}

async function handlePasswordReset(req, res) {
  const { token, userId, newPassword, confirmPassword } = req.body;
  if (!token || !userId || !newPassword) {
    res.flash("errors", "All fields are required");
    return res.redirect(`/reset-password?token=${token}&id=${userId}`);
  }

  if (newPassword !== confirmPassword) {
    res.flash("errors", "Passwords do not match");
    return res.redirect(`/reset-password?token=${token}&id=${userId}`);
  }

  try {
    // 1. Verify token is valid and not expired
    const isValid = await verifyResetToken(userId, token);

    if (!isValid) {
      res.flash("errors", "Invalid or expired reset token");
      return res.redirect("/forgot-password");
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update password in database
    await updateUserPassword(userId, hashedPassword);

    // 4. Clear reset token
    await clearResetToken(userId);

    res.flash(
      "success",
      "Password reset successfully. Please login with your new password"
    );
    res.redirect("/login");
  } catch (error) {
    console.error("Password reset error:", error);
    res.flash("errors", "Error resetting password. Please try again.");
    res.redirect(`/reset-password?token=${token}&id=${userId}`);
  }
}

const getGoogleLoginPage = async (req, res) => {
  if (req.user) return res.redirect("/");

  const state = arctic.generateState();
  const codeVerifier = arctic.generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  const cookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 10 * 1000,
    sameSite: "lax",
  };
  res.cookie("google_oauth_state", state, cookieConfig);
  res.cookie("google_code_verifier", codeVerifier, cookieConfig);
  res.redirect(url.toString());
};

const getGoogleLoginCallback = async (req, res) => {
  const { code, state } = req.query;

  const {
    google_oauth_state: storedState,
    google_code_verifier: storedCodeVerifier,
  } = req.cookies;

  if (!code || !storedState || state !== storedState || !storedCodeVerifier) {
    res.flash(
      "errors",
      "Couldn't login with Google because of invalid login attempt. Please try again!"
    );
    return res.redirect("/login");
  }
  let tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
  } catch (err) {
    res.flash(
      "errors",
      "Couldn't login with Google because of invalid login attempt. Please try again!"
    );
      res.cookie(
        "user",
        JSON.stringify({
          id: user.user_id,
          email: user.email,
          name: user.name,
        }),
        {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60, // 1 hour
        }
      );
    return res.redirect("/login");
  }

  const claims = arctic.decodeIdToken(tokens.idToken());
  const { sub: googleUserId, name, email } = claims;

  let user = await getUserWithOauthId(email, "google");

  if (user && !user.providerAccountId) {
    await linkUserWithOauth(user.user_id, "google", googleUserId);
  }

  if (!user) {
    user=await createUserWithOauth({
      name: name,
      email: email,
      password: null,
      provider: "google",
      providerAccountId: googleUserId,
    });
  }

  res.redirect("/landing");
};

async function loginWithEmail(req, res) {
  const { email, password } = req.body;

  try {
    let user = await getUserByEmail(email);

    if (!user) {
      user = await getUserWithOauthId(email, "google");
    }

    if (!user) {
      res.flash("errors", "No account found with this email.");
      return res.redirect("/login");
    }

    if (!user.password) {
      res.flash(
        "errors",
        "This account was created using Google. Please continue with Google login."
      );
      return res.redirect("/login");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("❌ Login error:", err.message);
        res.flash("errors", "Something went wrong. Please try again.");
        return res.redirect("/login");
      }
      if (result === true) {
        res.cookie(
          "user",
          JSON.stringify({
            id: user.user_id,
            email: user.email,
            name: user.name,
          }),
          {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60, // 1 hour
          }
        );

        res.flash("success", "Welcome back!");
        return res.redirect("/landing");
      } else {
        res.flash("errors", "Invalid email or password.");
        return res.redirect("/login");
      }
    });
  } catch (error) {
    res.flash("PLease Login again");
    res.redirect("/login");
  }
}

const getGithubLoginPage = async (req, res) => {
  if (req.user) return res.redirect("/");

  const state = arctic.generateState();
  const url = github.createAuthorizationURL(state, ["user:email"]);

  const cookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 10 * 1000,
    sameSite: "lax",
  };
  res.cookie("github_oauth_state", state, cookieConfig);
  res.redirect(url.toString());
};

const getGithubLoginCallback = async (req, res) => {
  const { code, state } = req.query;

  const { github_oauth_state: storedState } = req.cookies;

  if (!code || !storedState || state !== storedState) {
    res.flash(
      "errors",
      "Couldn't login with Github because of invalid login attempt. Please try again! storedState err"
    );
    return res.redirect("/login");
  }
  let tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch (err) {
    res.flash(
      "errors",
      "Couldn't login with Github because of invalid login attempt. Please try again! authorize err"
    );
    return res.redirect("/login");
  }

  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });

  if (!githubUserResponse.ok) {
    res.flash(
      "errors",
      "Couldn't login with Github because of invalid login attempt. Please try again! userResponse"
    );
    return res.redirect("/login");
  }

  const githubUser = await githubUserResponse.json();

  const { id: githubUserId, login, name } = githubUser;
  let displayName = name || login;

  const githubEmailResponse = await fetch(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    }
  );

  if (!githubEmailResponse.ok) {
    res.flash(
      "errors",
      "Couldn't login with Github because of invalid login attempt. Please try again! emailResponse"
    );
    return res.redirect("/login");
  }

  const emails = await githubEmailResponse.json();
  const primaryEmailObj = emails.find((e) => e.primary === true);
  const email = primaryEmailObj ? primaryEmailObj.email : null;

  if (!email) {
    res.flash(
      "errors",
      "Couldn't login with Github because of invalid login attempt. Please try again! email err"
    );
    return res.redirect("/login");
  }

  let user = await getUserWithOauthId(email, "github");

  if (user && !user.providerAccountId) {
    await linkUserWithOauth(user.user_id, "github", githubUserId);
  }

  if (!user) {
    user=await createUserWithOauth({
      name: displayName,
      email: email,
      password: null,
      provider: "github",
      providerAccountId: githubUserId,
    });
  }
    res.cookie(
      "user",
      JSON.stringify({
        id: user.user_id,
        email: user.email,
        name: user.name,
      }),
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60, // 1 hour
      }
    );
  res.redirect("/landing");
};

const getLinkedInLoginPage = async (req, res) => {
  if (req.user) return res.redirect("/");

  const state = arctic.generateState();
  const scopes = ["openid", "profile", "email"]; // Use recommended scopes from docs

  // CORRECT: Only 2 parameters as per documentation
  const url = linkedin.createAuthorizationURL(state, scopes);

  const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60 * 1000,
    sameSite: "lax",
  };
  res.cookie("linkedin_oauth_state", state, cookieConfig);

  res.redirect(url.toString());
};

const getLinkedInLoginCallback = async (req, res) => {
  const { code, state } = req.query;

  const { linkedin_oauth_state: storedState } = req.cookies;

  if (!code || !storedState || state !== storedState) {
    res.flash(
      "errors",
      "Couldn't login with LinkedIn because of invalid login attempt. Please try again!"
    );
    return res.redirect("/login");
  }

  let tokens;
  try {
    // CORRECT: Only 1 parameter as per documentation
    tokens = await linkedin.validateAuthorizationCode(code);
  } catch (err) {
    console.error(err);
    res.flash(
      "errors",
      "Couldn't login with LinkedIn because of invalid login attempt. Please try again!"
    );
    return res.redirect("/login");
  }

  const accessToken = tokens.accessToken();

  // Fetch user profile using OpenID Connect as per documentation
  try {
    const response = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`);
    }

    const user = await response.json();
    const { sub: linkedInUserId, name, email } = user;

    // Optional: Decode ID token if needed
    const idToken = tokens.idToken();
    const claims = arctic.decodeIdToken(idToken);

    let existingUser = await getUserWithOauthId(email, "linkedin");

    if (existingUser && !existingUser.providerAccountId) {
      await linkUserWithOauth(existingUser.user_id, "linkedin", linkedInUserId);
    }

    if (!existingUser) {
     user= await createUserWithOauth({
        name: name,
        email: email,
        password: null,
        provider: "linkedin",
        providerAccountId: linkedInUserId,
      });
    }
      res.cookie(
        "user",
        JSON.stringify({
          id: user.user_id,
          email: user.email,
          name: user.name,
        }),
        {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60, // 1 hour
        }
      );
    res.redirect("/landing");
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error);
    res.flash("errors", "Failed to fetch user profile from LinkedIn");
    return res.redirect("/login");
  }
};

module.exports = {
  getGoogleLoginPage,
  getGoogleLoginCallback,
  loginWithEmail,
  getGithubLoginPage,
  getGithubLoginCallback,
  getLinkedInLoginPage,
  getLinkedInLoginCallback,
  sendPasswordResetEmail,
  handlePasswordReset,
};
