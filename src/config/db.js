const { Pool } = require("pg");
require("dotenv").config();

// const db = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'locker',
//   password: '12345678',
// //   port: 5432,
//   idleTimeoutMillis: 300,
// });
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  idleTimeoutMillis: 300,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database.");
});

module.exports = db;
