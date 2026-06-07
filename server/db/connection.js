/**
 * File: server/db/connection.js
 * Purpose: single shared mysql2 connection POOL for the whole server.
 * Owner: Partner A | SHARED INFRA - FROZEN after kickoff (Partner B never edits).
 * Stage: B (שלב ב)
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

module.exports = pool;

/* EXAM NOTES:
 * - למה pool ולא connection בודד? ה-pool מחזיק כמה חיבורים פתוחים וממחזר אותם,
 *   כך שכמה בקשות במקביל לא נחנקות ואין צורך לפתוח/לסגור חיבור בכל שאילתה.
 * - mysql2/promise מאפשר async/await:  const [rows] = await pool.query(...)
 * - פרטי החיבור ב-.env ולא בקוד: סודות לא נכנסים ל-Git, וכל סטודנט מגדיר סביבה משלו.
 */
