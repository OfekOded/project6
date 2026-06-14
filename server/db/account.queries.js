const pool = require('./connection');

// Verify the current password and set a new one. Returns:
//   true  - password changed
//   false - the supplied current password did not match
//   null  - no password row for this user (should not happen for a real user)
async function changePassword(userId, currentPassword, newPassword) {
  const [rows] = await pool.execute('SELECT password FROM passwords WHERE user_id = ?', [userId]);
  if (rows.length === 0) return null;
  if (rows[0].password !== currentPassword) return false;

  await pool.execute('UPDATE passwords SET password = ? WHERE user_id = ?', [newPassword, userId]);
  return true;
}

module.exports = { changePassword };
