/**
 * File: client/src/storage.js
 * Purpose: the only place that touches Local Storage (current logged-in user).
 * Owner: Partner A
 * Stage: C (שלב ג)
 */
const KEY = 'currentUser';

// Returns the user object or null. (localStorage holds strings -> JSON.parse)
export function getCurrentUser() {
  // TODO (A): read localStorage.getItem(KEY), JSON.parse, handle null
}

// `user` arrives from POST /login WITHOUT a password field - store as-is.
export function saveCurrentUser(user) {
  // TODO (A): localStorage.setItem(KEY, JSON.stringify(user))
}

// Logout: remove the key.
export function clearCurrentUser() {
  // TODO (A): localStorage.removeItem(KEY)
}

/* EXAM NOTES:
 * - Local Storage שורד רענון וסגירת דפדפן - לכן משתמש נשאר מחובר עד Logout (דרישת שלב ג).
 * - לעולם לא שומרים בו סיסמה - השרת ממילא לא מחזיר אותה.
 * - ריכוז הגישה ל-LS בקובץ אחד = מקום אחד לתקן אם משנים מבנה.
 */
