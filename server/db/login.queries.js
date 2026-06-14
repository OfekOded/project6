const pool = require('./connection');

// JOIN users + passwords by username. Returns one row with the profile fields,
// blocked / is_admin flags and the password. The ROUTE strips `password` before
// anything leaves the server.
async function getUserWithPassword(username) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.username, u.name, u.email, u.phone, u.blocked, u.is_admin, p.password
     FROM users u
     JOIN passwords p ON p.user_id = u.id
     WHERE u.username = ?`,
    [username]
  );
  return rows[0];
}

module.exports = { getUserWithPassword };
