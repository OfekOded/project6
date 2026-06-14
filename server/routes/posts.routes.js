/**
 * File: server/routes/posts.routes.js
 * Purpose: full REST for /posts incl. nested GET /posts/:id/comments + ownership checks (stage E).
 * Owner: Partner B
 * Stage: B (שלב ב) + E (שלב ה) + Final polish (input validation)
 */
const express = require('express');
const postsQueries = require('../db/posts.queries');
const commentsQueries = require('../db/comments.queries');
const { parseId } = require('../utils/validate');
const router = express.Router();

// GET /posts            GET /posts?userId=1  (active user's posts, sorted by id)
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.userId !== undefined && req.query.userId !== '') {
      const userId = parseId(req.query.userId);
      if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });
      filters.userId = userId;
    }

    const posts = await postsQueries.getPosts(filters);
    res.json(posts);
  } catch (err) {
    console.error('GET /posts', err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /posts/:id -> 404 if not found
router.get('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const post = await postsQueries.getPostById(id);
    if (!post) return res.status(404).json({ error: 'post not found' });
    res.json(post);
  } catch (err) {
    console.error('GET /posts/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /posts/:id/comments  (jsonplaceholder-style nested route)
router.get('/:id/comments', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const post = await postsQueries.getPostById(id);
    if (!post) return res.status(404).json({ error: 'post not found' });
    const comments = await commentsQueries.getCommentsByPost(id);
    res.json(comments);
  } catch (err) {
    console.error('GET /posts/:id/comments', err);
    res.status(500).json({ error: 'server error' });
  }
});

// POST /posts   body: { userId, title, body }
router.post('/', async (req, res) => {
  try {
    const { title, body } = req.body;
    const userId = parseId(req.body.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });
    if (!title || !title.trim() || !body || !body.trim()) {
      return res.status(400).json({ error: 'title and body are required' });
    }
    const post = await postsQueries.createPost({ userId, title: title.trim(), body: body.trim() });
    res.status(201).json(post);
  } catch (err) {
    console.error('POST /posts', err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /posts/:id   body: { userId, title?, body? }  -- ONLY if the post belongs to userId
router.put('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const userId = parseId(req.body.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });

    const post = await postsQueries.getPostById(id);
    if (!post) return res.status(404).json({ error: 'post not found' });

    // OWNERSHIP CHECK (stage E): the server is the real gatekeeper, not the hidden button.
    if (post.user_id !== userId) {
      return res.status(403).json({ error: 'not your post' });
    }
    if (req.body.title === undefined && req.body.body === undefined) {
      return res.status(400).json({ error: 'nothing to update' });
    }

    const updated = await postsQueries.updatePost(id, {
      title: req.body.title,
      body: req.body.body,
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /posts/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

// DELETE /posts/:id?userId=...  -- ONLY if the post belongs to userId
router.delete('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const userId = parseId(req.query.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });

    const post = await postsQueries.getPostById(id);
    if (!post) return res.status(404).json({ error: 'post not found' });
    if (post.user_id !== userId) {
      return res.status(403).json({ error: 'not your post' });
    }
    await postsQueries.deletePost(id);
    res.status(204).end(); // 204 No Content: success, nothing to return
  } catch (err) {
    console.error('DELETE /posts/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;

/* EXAM NOTES:
 * - בדיקת בעלות חייבת להיות בשרת. הסתרת כפתור Delete בלקוח היא UX בלבד -
 *   כל אחד יכול לשלוח DELETE ב-postman; רק השרת באמת אוכף (403 Forbidden).
 * - מגבלה כנה (לומר בבחינה): בלי session/JWT השרת "מאמין" ל-userId שהלקוח מצהיר
 *   (בגוף הבקשה ב-PUT, ב-query ב-DELETE). בייצור הזהות נקבעת בשרת מתוך token, לא מהבקשה.
 * - parseId על :id ועל userId: קלט לא-מספרי נעצר ב-400, וההשוואה לבעלות היא מספר מול מספר.
 * - הראוט המקונן /posts/:id/comments חי כאן (קובץ של B) ולכן אין התנגשות עם אף אחד.
 * - הסדר חשוב: '/:id/comments' מוגדר לפני '/:id' לא הכרחי כאן (נתיבים שונים), אבל ככלל
 *   נתיבים ספציפיים קודמים לכלליים כדי שלא "ייבלעו".
 */
