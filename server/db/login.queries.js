/**
 * File: server/db/login.queries.js
 * Purpose: the ONLY read access to the passwords table (login verification).
 * Owner: Partner A
 * Stage: C (שלב ג)
 */
const pool = require('./connection');

// JOIN users + passwords by username. Returns one row { id, username, name, email, phone, password }
// or undefined. The ROUTE strips `password` before anything leaves the server.
async function getUserWithPassword(username) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.username, u.name, u.email, u.phone, p.password
     FROM users u
     JOIN passwords p ON p.user_id = u.id
     WHERE u.username = ?`,
    [username]
  );
  return rows[0];
}

module.exports = { getUserWithPassword };

/* EXAM NOTES:
 * - הפרדת אחריות: רק הקובץ הזה (ו-register.queries.js) נוגעים ב-passwords.
 *   קל להראות למעריך "איפה בכל הקוד נקראת הסיסמה" - בשורה אחת.
 * - JOIN במקום שתי שאילתות: שליפה אחת של המשתמש והסיסמה יחד - גם יעיל וגם חומר לבחינה.
 */
