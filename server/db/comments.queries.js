/**
 * File: server/db/comments.queries.js
 * Purpose: all SQL for the comments table.
 * Owner: Partner B
 * Stage: B (שלב ב) + E (שלב ה)
 */
const pool = require('./connection');

// All comments of one post, ORDER BY id (used by GET /posts/:id/comments and GET /comments?postId=)
async function getCommentsByPost(postId) {
  // TODO (B)
}

// Single comment incl. user_id - needed for ownership checks in the route
async function getCommentById(id) {
  // TODO (B)
}

async function createComment({ postId, userId, body }) {
  // TODO (B)
}

async function updateComment(id, { body }) {
  // TODO (B)
}

async function deleteComment(id) {
  // TODO (B)
}

module.exports = {
  getCommentsByPost,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
