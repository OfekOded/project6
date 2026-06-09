/**
 * File: server/db/comments.queries.js
 * Purpose: all SQL for the comments table.
 * Owner: Partner B
 * Stage: B (שלב ב) + E (שלב ה)
 */
const pool = require('./connection');

// JOIN users so the client gets the commenter's display name without us storing it on the comment.
// (Single source of truth: rename a user and old comments show the new name automatically.)
const SELECT_WITH_AUTHOR = `
  SELECT c.id, c.post_id, c.user_id, c.body, c.created_at,
         u.username AS user_username, u.name AS user_name
  FROM comments c
  JOIN users u ON u.id = c.user_id
`;

// All comments of one post, ORDER BY id (used by GET /posts/:id/comments and GET /comments?postId=)
async function getCommentsByPost(postId) {
  const [rows] = await pool.query(
    `${SELECT_WITH_AUTHOR} WHERE c.post_id = ? ORDER BY c.id`,
    [postId]
  );
  return rows;
}

// Single comment incl. user_id - needed for ownership checks in the route. undefined if not found.
async function getCommentById(id) {
  const [rows] = await pool.query(`${SELECT_WITH_AUTHOR} WHERE c.id = ?`, [id]);
  return rows[0];
}

async function createComment({ postId, userId, body }) {
  const [result] = await pool.query(
    'INSERT INTO comments (post_id, user_id, body) VALUES (?, ?, ?)',
    [postId, userId, body]
  );
  return getCommentById(result.insertId); // returns the row WITH the author name
}

async function updateComment(id, { body }) {
  await pool.query('UPDATE comments SET body = ? WHERE id = ?', [body, id]);
  return getCommentById(id);
}

async function deleteComment(id) {
  const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = {
  getCommentsByPost,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};

/* EXAM NOTES:
 * - למה JOIN ולא לשמור שם המגיב בטבלת comments? נורמליזציה: שם המשתמש נשמר במקום אחד (users).
 *   כך אין כפילות מידע ואין סכנה שהשם בתגובה "יתיישן" אחרי שינוי פרופיל.
 * - getCommentById מחזיר גם user_id - הראוט משווה אותו ל-userId של המבקש כדי לאכוף בעלות (403).
 */
