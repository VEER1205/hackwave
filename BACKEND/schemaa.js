const mysql = require("mysql2");
const fs = require("fs");
const { resolve } = require("path");
require("dotenv").config();

function createConnection() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "test",
    port: process.env.DB_PORT || 4000,
    ssl: { rejectUnauthorized: true },
  });

  connection.connect((err) => {
    if (err) {
      console.error("❌ MySQL connection failed:", err.message);
    } else {
      console.log("✅ DB Connection successful!");
    }
  });

  return connection;
}

function addUser(name, email, password, res) {
  let emailregex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/;

  if (!emailregex.test(email)) {
    res.flash("errors", "Please enter a valid email address!");
    return res.redirect("/login");
  }

  // Null / empty check
  if (!name || !email || !password) {
    res.flash("errors", "All fields are required!");
    return res.redirect("/login");
  }

  const db = createConnection();

  // 1️⃣ Check for duplicate email
  const checkSql = `SELECT * FROM Users WHERE email = ? LIMIT 1`;
  db.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error("❌ Error checking email:", err.message);
      res.flash("errors", "Database error! Try again.");
      db.end();
      return res.redirect("/login");
    }

    if (results.length > 0) {
      res.flash("errors", "Email already registered!");
      db.end();
      return res.redirect("/login");
    }

    // 2️⃣ Insert new user
    const insertSql = `INSERT INTO Users (name, email, password) VALUES (?, ?, ?)`;
    db.query(insertSql, [name, email, password], (err, result) => {
      if (err) {
        console.error("❌ Error inserting user:", err.message);
        res.flash("errors", "Database error! Try again.");
        db.end();
        return res.redirect("/login");
      }

      res.flash("success", "Registration successful! Please log in.");
      db.end();
      return res.redirect("/login");
    });
  });
}

async function storeResetToken(userId, token, expiry) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `UPDATE Users SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?`;
    db.query(sql, [token, new Date(expiry), userId], (err, result) => {
      db.end();
      if (err) return reject(err);
      resolve(result);
    });
  });
}

async function verifyResetToken(userId, token) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `SELECT reset_token, reset_token_expiry FROM Users WHERE user_id = ?`;
    db.query(sql, [userId], (err, results) => {
      db.end();
      if (err) return reject(err);

      const user = results[0];
      if (!user || !user.reset_token || !user.reset_token_expiry) {
        return resolve(false);
      }

      const isValid =
        user.reset_token === token &&
        new Date(user.reset_token_expiry) > new Date();
      resolve(isValid);
    });
  });
}

async function updateUserPassword(userId, hashedPassword) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `UPDATE Users SET password = ? WHERE user_id = ?`;
    db.query(sql, [hashedPassword, userId], (err, result) => {
      db.end();
      if (err) return reject(err);
      resolve(result);
    });
  });
}

async function clearResetToken(userId) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `UPDATE Users SET reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?`;
    db.query(sql, [userId], (err, result) => {
      db.end();
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function createUserWithOauth({
  name,
  email,
  password,
  provider,
  providerAccountId,
}) {
  console.log();
  return new Promise((resolve, reject) => {
    const db = createConnection();

    db.beginTransaction((err) => {
      if (err) {
        db.end();
        return reject(err);
      }

      // 1️⃣ Insert into Users
      const userSql = `
          INSERT INTO Users (name, email, password)
          VALUES (?, ?, ?)
        `;
      db.query(userSql, [name, email, password || null], (err, userResult) => {
        if (err) {
          return db.rollback(() => {
            db.end();
            reject(err);
          });
        }

        const userId = userResult.insertId;

        // 2️⃣ Insert into OauthAccounts
        const oauthSql = `
            INSERT INTO OauthAccounts (user_id, provider, providerAccountId)
            VALUES (?, ?, ?)
          `;
        db.query(
          oauthSql,
          [userId, provider, providerAccountId],
          (err, oauthResult) => {
            if (err) {
              return db.rollback(() => {
                db.end();
                reject(err);
              });
            }

            // 3️⃣ Commit transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  db.end();
                  reject(err);
                });
              }

              db.end();
              resolve({
                id: userId,
                name,
                email,
                provider,
                providerAccountId,
              });
            });
          }
        );
      });
    });
  });
}

function getUserWithOauthId(email, provider) {
  return new Promise((resolve, reject) => {
    const db = createConnection();

    const sql = `
        SELECT 
          u.user_id,
          u.name,
          u.email,
          oa.providerAccountId,
          oa.provider,
          oa.created_at
        FROM Users u
        LEFT JOIN OauthAccounts oa 
          ON oa.user_id = u.user_id AND oa.provider = ?
        WHERE u.email = ?
      `;

    db.query(sql, [provider, email], (err, results) => {
      db.end(); // close after query

      if (err) {
        console.error("❌ Error fetching user:", err.message);
        return reject(err);
      }

      resolve(results[0] || null); // return first user or null
    });
  });
}

function linkUserWithOauth(userId, provider, providerAccountId) {
  return new Promise((resolve, reject) => {
    const db = createConnection();

    const sql = `
        INSERT INTO OauthAccounts (user_id, provider, providerAccountId, created_at)
        VALUES (?, ?, ?, NOW())
      `;

    db.query(sql, [userId, provider, providerAccountId], (err, result) => {
      if (err) {
        console.error("❌ Error linking user with OAuth:", err.message);
        reject(err);
        return;
      }

      resolve(result);
    });

    db.end();
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const db = createConnection();

    const sql = `
        SELECT 
          user_id,
          name,
          email,
          password,   -- include password since it's needed for login check
          created_at
        FROM Users
        WHERE email = ?
        LIMIT 1
      `;

    db.query(sql, [email], (err, results) => {
      db.end(); // close after query

      if (err) {
        console.error("❌ Error fetching user by email:", err.message);
        return reject(err);
      }

      resolve(results[0] || null); // return first row or null
    });
  });
}

function getUserBalance(user_id) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `SELECT Balance FROM users WHERE user_id = ?`;

    db.query(sql, [user_id], (err, results) => {
      db.end();
      if (err) {
        console.error("❌ Error fetching balance:", err.message);
        return reject(err);
      }
      if (results.length === 0) return resolve(0);
      resolve(results[0].Balance); // ✅ return the number only
    });
  });
}

function updateUserBalance(user_id, newBalance) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `UPDATE users SET Balance = ? WHERE user_id = ?`;

    db.query(sql, [newBalance, user_id], (err, result) => {
      db.end();
      if (err) {
        console.error("❌ Error updating balance:", err.message);
        return reject(err);
      }
      resolve(result);
    });
  });
}

function getPortfolio(user_id) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `SELECT * FROM Portfolio WHERE user_id = ?`;

    db.query(sql, [user_id], (err, results) => {
      db.end();
      if (err) {
        console.error("❌ Error fetching portfolio:", err.message);
        return reject(err);
      }
      resolve(results);
    });
  });
}

function upsertPortfolioHolding(
  user_id,
  type,
  symbol,
  name,
  qty,
  avgPrice,
  lastPrice
) {
  return new Promise((resolve, reject) => {
    const db = createConnection();

    // Check if holding exists
    const checkSql = `SELECT * FROM Portfolio WHERE user_id = ? AND type = ? AND symbol = ?`;

    db.query(checkSql, [user_id, type, symbol], (err, results) => {
      if (err) {
        db.end();
        return reject(err);
      }

      if (results.length > 0) {
        // Update existing holding
        const existing = results[0];
        const newQty = existing.quantity + qty;

        if (newQty <= 0) {
          // Delete if quantity is 0 or less
          const deleteSql = `DELETE FROM Portfolio WHERE portfolio_id = ?`;
          db.query(deleteSql, [existing.portfolio_id], (err) => {
            db.end();
            if (err) return reject(err);
            resolve({ action: "deleted" });
          });
        } else {
          // Update quantity and average price
          const totalCost =
            existing.avg_price * existing.quantity + avgPrice * qty;
          const newAvgPrice = totalCost / newQty;

          const updateSql = `UPDATE Portfolio SET quantity = ?, avg_price = ?, last_price = ? WHERE portfolio_id = ?`;
          db.query(
            updateSql,
            [newQty, newAvgPrice, lastPrice, existing.portfolio_id],
            (err) => {
              db.end();
              if (err) return reject(err);
              resolve({ action: "updated", newQty, newAvgPrice });
            }
          );
        }
      } else {
        // Insert new holding
        const insertSql = `INSERT INTO Portfolio (user_id, type, symbol, name, quantity, avg_price, last_price) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(
          insertSql,
          [user_id, type, symbol, name, qty, avgPrice, lastPrice],
          (err, result) => {
            db.end();
            if (err) return reject(err);
            resolve({ action: "inserted", id: result.insertId });
          }
        );
      }
    });
  });
}

function insertTrade(user_id, type, side, symbol, name, qty, price, total) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `INSERT INTO Trades (user_id, type, side, symbol, name, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      sql,
      [user_id, type, side, symbol, name, qty, price, total],
      (err, result) => {
        db.end();
        if (err) {
          console.error("❌ Error inserting trade:", err.message);
          return reject(err);
        }
        resolve({ trade_id: result.insertId });
      }
    );
  });
}

function getUserTrades(user_id, limit = 50) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `SELECT * FROM Trades WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?`;

    db.query(sql, [user_id, limit], (err, results) => {
      db.end();
      if (err) {
        console.error("❌ Error fetching trades:", err.message);
        return reject(err);
      }
      resolve(results);
    });
  });
}

function getUserWatchlist(user_id) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `SELECT * FROM Watchlist WHERE user_id = ?`;

    db.query(sql, [user_id], (err, results) => {
      db.end();
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function addToWatchlist(user_id, type, symbol, name) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `INSERT INTO Watchlist (user_id, type, symbol, name) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE symbol = symbol`;

    db.query(sql, [user_id, type, symbol, name], (err, result) => {
      db.end();
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function removeFromWatchlist(user_id, symbol) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `DELETE FROM Watchlist WHERE user_id = ? AND symbol = ?`;

    db.query(sql, [user_id, symbol], (err, result) => {
      db.end();
      if (err) return reject(err);
      resolve(result);
    });
  });
}

async function getUserCourses(email) {
  return new Promise((resolve, reject) => {
    const db = createConnection();

    const sql = `
      SELECT * FROM Enrollments WHERE user_id = ?
    `;

    db.query(sql, [email], (err, results) => {
      db.end();

      if (err) {
        console.error("❌ Error fetching user courses:", err.message);
        return reject(err);
      }

      resolve(results);
    });
  });
}

function getAllNumberOfUsers() {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `SELECT COUNT(*) AS userCount FROM Users`;

    db.query(sql, (err, results) => {
      db.end();

      if (err) {
        console.error("❌ Error fetching user count:", err.message);
        return reject(err);
      }

      resolve(results[0].userCount);
    });
  });
}

async function executeTrade(userId, { type, side, symbol, name, qty, price }) {
  console.log("Order Receieved");
  const quantity = parseFloat(qty);
  const priceNum = parseFloat(price);
  const total = quantity * priceNum;

  // Get balance
  const balance = await getUserBalance(userId);

  if (side === "BUY") {
    if (balance < total) throw new Error("Insufficient balance");
    await updateUserBalance(userId, balance - total);
    await upsertPortfolioHolding(
      userId,
      type,
      symbol,
      name,
      quantity,
      priceNum,
      priceNum
    );
  } else if (side === "SELL") {
    const portfolio = await getPortfolio(userId);
    const holding = portfolio.find(
      (h) => h.type === type && h.symbol === symbol
    );
    if (!holding || holding.quantity < quantity)
      throw new Error("Insufficient holdings");
    await updateUserBalance(userId, balance + total);
    await upsertPortfolioHolding(
      userId,
      type,
      symbol,
      name,
      -quantity,
      priceNum,
      priceNum
    );
  }

  await insertTrade(
    userId,
    type,
    side,
    symbol,
    name,
    quantity,
    priceNum,
    total
  );

  return { success: true, total, message: `Trade executed successfully` };
}

module.exports = {
 executeTrade,
  storeResetToken,
  verifyResetToken,
  updateUserPassword,
  clearResetToken,
  createConnection,
  addUser,
  createUserWithOauth,
  getUserWithOauthId,
  linkUserWithOauth,
  getUserByEmail,
  getUserBalance,
  getUserCourses,
  getAllNumberOfUsers,
  updateUserBalance,
  getPortfolio,
  upsertPortfolioHolding,
  insertTrade,
  getUserTrades,
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
