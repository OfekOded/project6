/**
 * File: server/routes/login.routes.js
 * Purpose: POST /login - verify username+password against the DB (stage C).
 * Owner: Partner A
 * Stage: C (שלב ג)
 */
const express = require('express');
const loginQueries = require('../db/login.queries');
const router = express.Router();

// POST /login   body: { username, password }
// Success -> 200 + user WITHOUT the password field. Failure -> 401 + { error }.
router.post('/', async (req, res) => {
  // TODO (A):
  // 1. validate req.body has username + password -> else 400
  // 2. const user = await loginQueries.getUserWithPassword(username)
  // 3. if (!user || user.password !== password) -> res.status(401).json({ error: 'wrong username or password' })
  //    (same message for both cases - do not reveal whether the username exists)
  // 4. delete user.password;  res.json(user)
});

module.exports = router;

/* EXAM NOTES (חשוב לבחינה!):
 * - הסיסמה לעולם לא נשלחת חזרה ללקוח ולא נשמרת ב-Local Storage - נמחקת מהאובייקט בשרת.
 * - רמת קורס: השוואת טקסט פשוט מול ה-DB. בעולם אמיתי: bcrypt.hash בהרשמה +
 *   bcrypt.compare בכניסה. hash הוא חד-כיווני + salt ייחודי לכל משתמש, כך שגם דליפת
 *   DB לא חושפת סיסמאות. לא מומש כאן בכוונה - מחוץ לחומר הקורס (whitelist בלבד).
 * - 401 Unauthorized = זהות לא אומתה; 400 = בקשה לא תקינה; 403 = מאומת אבל אסור.
 * - הודעת שגיאה אחידה ("שם משתמש או סיסמה שגויים") כדי לא לחשוף אילו שמות קיימים.
 */
