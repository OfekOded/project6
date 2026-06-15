const pool = require('./connection');
const { hashPassword } = require('./password.util');

// true/false - is this username already taken? (users.username is UNIQUE anyway - double check)
async function usernameExists(username) {
  const [rows] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
  return rows.length > 0;
}

// Two dependent INSERTs wrapped in a transaction: either BOTH rows are created, or NEITHER is.
// Returns the new user WITHOUT a password field.
async function createUserWithPassword({ username, name, email, phone }, password) {
  const conn = await pool.getConnection(); // a single connection for the whole transaction
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(
      'INSERT INTO users (username, name, email, phone) VALUES (?, ?, ?, ?)',
      [username, name, email ?? null, phone ?? null]
    );
    const id = result.insertId;

    await conn.execute('INSERT INTO passwords (user_id, password) VALUES (?, ?)', [id, hashPassword(password)]);

    await conn.commit();
    return { id, username, name, email: email ?? null, phone: phone ?? null };
  } catch (err) {
    await conn.rollback(); // undo the users insert if the passwords insert failed
    throw err;
  } finally {
    conn.release(); // ALWAYS return the connection to the pool
  }
}

module.exports = { usernameExists, createUserWithPassword };
