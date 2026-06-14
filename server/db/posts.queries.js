const pool = require('./connection');

// Explicit column list (never SELECT *) - shared by all reads here.
const POST_COLUMNS = 'id, user_id, title, body, created_at';

// List with optional filters: { userId } -> ORDER BY id (stage E: sorted by id)
async function getPosts(filters = {}) {
  let sql = `SELECT ${POST_COLUMNS} FROM posts`;
  const params = [];

  // Build the WHERE dynamically so the same function serves /posts and /posts?userId=
  if (filters.userId !== undefined && filters.userId !== null && filters.userId !== '') {
    sql += ' WHERE user_id = ?';
    params.push(filters.userId);
  }

  sql += ' ORDER BY id';
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Single post incl. user_id - needed for ownership checks in the route. undefined if not found.
async function getPostById(id) {
  const [rows] = await pool.execute(`SELECT ${POST_COLUMNS} FROM posts WHERE id = ?`, [id]);
  return rows[0];
}

// Insert then re-fetch the created row (so the caller gets id + created_at the DB generated).
async function createPost({ userId, title, body }) {
  const [result] = await pool.execute(
    'INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)',
    [userId, title, body]
  );
  return getPostById(result.insertId);
}

// Partial update: only the fields that were actually sent are changed.
async function updatePost(id, { title, body }) {
  const fields = [];
  const params = [];
  if (title !== undefined) { fields.push('title = ?'); params.push(title); }
  if (body !== undefined) { fields.push('body = ?'); params.push(body); }
  if (fields.length === 0) return getPostById(id); // nothing to change

  params.push(id);
  await pool.execute(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`, params);
  return getPostById(id);
}

// Physical delete. Returns affectedRows so the route can answer 404 when nothing matched.
async function deletePost(id) {
  const [result] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
