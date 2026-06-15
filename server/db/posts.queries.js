const pool = require('./connection');

const POST_SELECT = `
  SELECT p.id, p.user_id, p.title, p.body, p.created_at,
         u.username AS user_username, u.name AS user_name
  FROM posts p
  JOIN users u ON u.id = p.user_id
`;

// List with optional filter { userId }. No userId -> every post (the "All posts" view).
async function getPosts(filters = {}) {
  let sql = POST_SELECT;
  const params = [];

  if (filters.userId !== undefined && filters.userId !== null && filters.userId !== '') {
    sql += ' WHERE p.user_id = ?';
    params.push(filters.userId);
  }

  sql += ' ORDER BY p.id';
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Single post incl. user_id + author. undefined if not found.
async function getPostById(id) {
  const [rows] = await pool.execute(`${POST_SELECT} WHERE p.id = ?`, [id]);
  return rows[0];
}

// Insert then re-fetch the created row (so the caller gets id, created_at and the author).
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
  if (fields.length === 0) return getPostById(id);

  params.push(id);
  await pool.execute(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`, params);
  return getPostById(id);
}

async function deletePost(id) {
  const [result] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
