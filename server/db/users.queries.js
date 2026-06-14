const pool = require('./connection');

// SELECT id, username, name, email, phone FROM users  (explicit columns - no password leak possible)
async function getAllUsers() {
  const [rows] = await pool.execute(
    'SELECT id, username, name, email, phone FROM users ORDER BY id'
  );
  return rows;
}

// Single user by id (used by the Info page). Return undefined if not found.
async function getUserById(id) {
  const [rows] = await pool.execute(
    'SELECT id, username, name, email, phone FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
}

module.exports = { getAllUsers, getUserById };
