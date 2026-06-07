/**
 * File: server/db/posts.queries.js
 * Purpose: all SQL for the posts table.
 * Owner: Partner B
 * Stage: B (שלב ב) + E (שלב ה)
 */
const pool = require('./connection');

// List with optional filters: { userId } -> ORDER BY id (stage E: sorted by id)
async function getPosts(filters) {
  // TODO (B)
}

// Single post incl. user_id - needed for ownership checks in the route
async function getPostById(id) {
  // TODO (B): SELECT ... WHERE id = ?
}

async function createPost({ userId, title, body }) {
  // TODO (B): INSERT ... ; return the new row (insertId)
}

async function updatePost(id, { title, body }) {
  // TODO (B): UPDATE ... WHERE id = ?
}

async function deletePost(id) {
  // TODO (B): DELETE FROM posts WHERE id = ?  (comments fall via ON DELETE CASCADE)
}

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };

/* EXAM NOTES:
 * - מחיקת post גוררת מחיקת comments אוטומטית בזכות ON DELETE CASCADE שהוגדר בסכמה -
 *   נקודה טובה להדגים למעריך (למחוק post ב-postman ולראות שהתגובות נעלמו).
 */
