const pool = require('./connection');
const { hashPassword, verifyPassword } = require('./password.util');

async function changePassword(userId, currentPassword, newPassword) {
  const [rows] = await pool.execute('SELECT password FROM passwords WHERE user_id = ?', [userId]);
  if (rows.length === 0) return null;
  if (!verifyPassword(currentPassword, rows[0].password)) return false;

  await pool.execute('UPDATE passwords SET password = ? WHERE user_id = ?', [hashPassword(newPassword), userId]);
  return true;
}

module.exports = { changePassword };
