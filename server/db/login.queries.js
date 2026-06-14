const pool = require('./connection');

// JOIN users + passwords by username. Returns one row { id, username, name, email, phone, password }
// or undefined. The ROUTE strips `password` before anything leaves the server.
async function getUserWithPassword(username) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.username, u.name, u.email, u.phone, p.password
     FROM users u
     JOIN passwords p ON p.user_id = u.id
     WHERE u.username = ?`,
    [username]
  );
  return rows[0];
}

module.exports = { getUserWithPassword };
