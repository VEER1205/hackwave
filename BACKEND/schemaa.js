  const mysql = require("mysql2");
  const fs = require("fs");
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

function getPortFolio(email) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = `select PortfolioRate from users WHERE email = ?`; // adjust this if you're selecting specific columns

    db.query(sql, [email], (err, results) => {
      db.end();

      if (err) {
        console.error("❌ Error fetching portfolio:", err.message);
        return reject(err);
      }

      resolve(results); // contains price and asset_name etc.
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

module.exports = {
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
    getPortFolio,
    getUserCourses
  };



    