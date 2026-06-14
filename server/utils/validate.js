/**
 * File: server/utils/validate.js
 * Purpose: tiny server-side validators for route/query params (defense in depth).
 *          Used at the ROUTE boundary so no malformed value (NaN, 'abc', -3) ever
 *          reaches the mysql2 layer.
 * Owner: Partner A | Stage: Final polish
 */

// Parse a value that must be a POSITIVE INTEGER (route :id, userId, postId...).
// Returns the number, or null if it is not a valid positive integer.
// Rejects: undefined, null, '', 'abc', '1.5', '-3', '0'.
function parseId(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Parse a boolean-as-0/1 flag (e.g. the todos `completed` filter).
// Returns 0 or 1, or null if the value is anything else.
function parseBool01(value) {
  if (value === '0' || value === 0) return 0;
  if (value === '1' || value === 1) return 1;
  return null;
}

module.exports = { parseId, parseBool01 };

/* EXAM NOTES:
 * - ולידציה בצד שרת = שכבת הגנה אחרונה. גם אם הלקוח שלח קלט פגום (או מישהו פנה ישירות
 *   ב-Postman), הראוט מחזיר 400 לפני שהערך נוגע ב-DB - ולא מסתמך על כך ש-mysql2 "יסתדר".
 * - Number.isInteger(n) && n > 0 פוסל 'abc' (NaN), '1.5', '-3' ו-'0' בשורה אחת.
 */
