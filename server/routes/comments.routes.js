/**
 * File: server/routes/comments.routes.js
 * Purpose: full REST for /comments + ownership checks (stage E).
 * Owner: Partner B
 * Stage: B (שלב ב) + E (שלב ה) + Final polish (input validation)
 */
const express = require('express');
const commentsQueries = require('../db/comments.queries');
const postsQueries = require('../db/posts.queries');
const { parseId } = require('../utils/validate');
const router = express.Router();

// GET /comments?postId=1  (flat jsonplaceholder-style; the nested version lives in posts.routes.js)
router.get('/', async (req, res) => {
  try {
    const postId = parseId(req.query.postId);
    if (postId === null) return res.status(400).json({ error: 'postId must be a positive integer' });

    const comments = await commentsQueries.getCommentsByPost(postId);
    res.json(comments);
  } catch (err) {
    console.error('GET /comments', err);
    res.status(500).json({ error: 'server error' });
  }
});

// POST /comments   body: { postId, userId, body }
router.post('/', async (req, res) => {
  try {
    const { body } = req.body;
    const postId = parseId(req.body.postId);
    const userId = parseId(req.body.userId);
    if (postId === null || userId === null) {
      return res.status(400).json({ error: 'postId and userId must be positive integers' });
    }
    if (!body || !body.trim()) {
      return res.status(400).json({ error: 'body is required' });
    }
    // Make sure the post exists before attaching a comment to it.
    const post = await postsQueries.getPostById(postId);
    if (!post) return res.status(404).json({ error: 'post not found' });

    const comment = await commentsQueries.createComment({ postId, userId, body: body.trim() });
    res.status(201).json(comment);
  } catch (err) {
    console.error('POST /comments', err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /comments/:id   body: { userId, body }  -- ONLY if the comment belongs to userId
router.put('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const userId = parseId(req.body.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });

    const comment = await commentsQueries.getCommentById(id);
    if (!comment) return res.status(404).json({ error: 'comment not found' });
    if (comment.user_id !== userId) {
      return res.status(403).json({ error: 'not your comment' });
    }
    if (!req.body.body || !req.body.body.trim()) {
      return res.status(400).json({ error: 'body is required' });
    }

    const updated = await commentsQueries.updateComment(id, { body: req.body.body.trim() });
    res.json(updated);
  } catch (err) {
    console.error('PUT /comments/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

// DELETE /comments/:id?userId=...  -- ONLY if the comment belongs to userId
router.delete('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const userId = parseId(req.query.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });

    const comment = await commentsQueries.getCommentById(id);
    if (!comment) return res.status(404).json({ error: 'comment not found' });
    if (comment.user_id !== userId) {
      return res.status(403).json({ error: 'not your comment' });
    }
    await commentsQueries.deleteComment(id);
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /comments/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;

/* EXAM NOTE: למה גם /comments וגם /posts/:id/comments? כך בדיוק ב-jsonplaceholder -
 * שתי דרכים לאותו מידע. הראוט השטוח נוח ל-POST/PUT/DELETE, המקונן נוח לקריאה לפי post.
 * שניהם משתמשים באותה פונקציית query (getCommentsByPost) - אין כפילות לוגיקה.
 * parseId על כל id/postId/userId: קלט לא-מספרי נעצר ב-400, ובדיקת הבעלות היא מספר מול מספר. */
