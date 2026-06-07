/**
 * File: server/db/register.queries.js
 * Purpose: inserts for registration - the ONLY write access to the passwords table.
 * Owner: Partner B
 * Stage: C (שלב ג)
 */
const pool = require('./connection');

// true/false - is this username already taken? (users.username is UNIQUE anyway - double check)
async function usernameExists(username) {
  // TODO (B): SELECT id FROM users WHERE username = ?  -> rows.length > 0
}

// Two INSERTs: users (get insertId), then passwords with that id. Returns the new user (no password).
async function createUserWithPassword({ username, name, email, phone }, password) {
  // TODO (B): 1) INSERT INTO users (...) VALUES (?, ?, ?, ?)
  //           2) INSERT INTO passwords (user_id, password) VALUES (insertId, ?)
  //           3) return { id: insertId, username, name, email, phone }
}

module.exports = { usernameExists, createUserWithPassword };

/* EXAM NOTES:
 * - שתי פעולות INSERT תלויות זו בזו. מושג לבחינה (לא חובה לממש): Transaction -
 *   BEGIN/COMMIT/ROLLBACK מבטיח ששתיהן יקרו יחד או בכלל לא (אטומיות).
 * - UNIQUE על username מגן ברמת ה-DB גם אם הבדיקה בקוד פוספסה (race condition).
 */
