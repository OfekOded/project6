const pool = require('./connection');

const USER_COLUMNS = 'id, username, name, email, phone, blocked, is_admin';

// Explicit columns (never SELECT *) so the password, which lives in another table, can never leak.
async function getAllUsers() {
  const [rows] = await pool.execute(`SELECT ${USER_COLUMNS} FROM users ORDER BY id`);
  return rows;
}

// Single user by id (used by the Info page). Return undefined if not found.
async function getUserById(id) {
  const [rows] = await pool.execute(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`, [id]);
  return rows[0];
}

// Update profile details. Only the fields that were actually sent are changed.
async function updateUserDetails(id, { name, email, phone }) {
  const fields = [];
  const params = [];
  if (name !== undefined) { fields.push('name = ?'); params.push(name); }
  if (email !== undefined) { fields.push('email = ?'); params.push(email); }
  if (phone !== undefined) { fields.push('phone = ?'); params.push(phone); }
  if (fields.length === 0) return getUserById(id);

  params.push(id);
  await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
  return getUserById(id);
}

// Block / unblock a user (admin action). Returns affectedRows.
async function setBlocked(id, blocked) {
  const [result] = await pool.execute('UPDATE users SET blocked = ? WHERE id = ?', [blocked ? 1 : 0, id]);
  return result.affectedRows;
}

module.exports = { getAllUsers, getUserById, updateUserDetails, setBlocked };
