/**
 * File: server/db/users.queries.js
 * Purpose: all SQL for the users table (NEVER touches the passwords table!).
 * Owner: Partner A
 * Stage: B (שלב ב) + C (עמוד Info)
 */
const pool = require('./connection');

// SELECT id, username, name, email, phone FROM users  (explicit columns - no password leak possible)
async function getAllUsers() {
  const [rows] = await pool.query(
    'SELECT id, username, name, email, phone FROM users ORDER BY id'
  );
  return rows;
}

// Single user by id (used by the Info page). Return undefined if not found.
async function getUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, username, name, email, phone FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
}

module.exports = { getAllUsers, getUserById };

/* EXAM NOTES:
 * - תמיד SELECT עם רשימת עמודות מפורשת, לא SELECT * - כך גם אם מישהו ישנה סכמה,
 *   סיסמאות לא ידלפו (וממילא הסיסמה בטבלה אחרת - הגנה כפולה).
 * - ה-? בשאילתה = שאילתה פרמטרית: הערך נשלח לדרייבר בנפרד מטקסט ה-SQL,
 *   ולכן קלט זדוני כמו ' OR '1'='1 לא יכול לשנות את השאילתה (מניעת SQL Injection).
 */
