const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log("🚀 ~ router.post ~ username:", username)

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, hashedPassword],
      (err) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).send("Error registering user");
        }
        res.status(201).send("User registered successfully");
      }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Error registering user");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }
    db.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
      async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).send("Internal server error");
        }
        if (results.rowCount === 0) {
          return res.status(401).send("Invalid credentials");
        }

        const user = results.rows[0];
        console.log("Retrieved User:", user);

        const isMatch = await bcrypt.compare(password, user?.password);
        if (!isMatch) {
          return res.status(401).send("Invalid credentials");
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        db.query(
            "SELECT r.* FROM reports r JOIN user_report_access ura ON r.id = ura.report_id WHERE ura.user_id = $1",
            [user.id],
            (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }
        
                const reports = result.rows;
                res.json({ user, token, reports });
            }
        );        
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
