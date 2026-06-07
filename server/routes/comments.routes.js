/**
 * File: server/routes/comments.routes.js
 * Purpose: full REST for /comments + ownership checks (stage E).
 * Owner: Partner B
 * Stage: B (שלב ב) + E (שלב ה)
 */
const express = require('express');
const commentsQueries = require('../db/comments.queries');
const router = express.Router();

// GET /comments?postId=1  (flat jsonplaceholder-style; the nested version lives in posts.routes.js)
router.get('/', async (req, res) => {
  // TODO (B): require postId in query -> else 400
});

// POST /comments   body: { postId, userId, body }
router.post('/', async (req, res) => {
  // TODO (B): validate -> 400; create -> 201
});

// PUT /comments/:id   body: { userId, body }  -- ONLY if the comment belongs to userId
router.put('/:id', async (req, res) => {
  // TODO (B): getCommentById -> 404 / compare user_id -> 403 / update -> 200
});

// DELETE /comments/:id?userId=...  -- ONLY if the comment belongs to userId
router.delete('/:id', async (req, res) => {
  // TODO (B): same ownership check -> delete -> 204
});

module.exports = router;

/* EXAM NOTE: למה גם /comments וגם /posts/:id/comments? כך בדיוק ב-jsonplaceholder -
 * שתי דרכים לאותו מידע. הראוט השטוח נוח ל-POST/PUT/DELETE, המקונן נוח לקריאה לפי post. */
