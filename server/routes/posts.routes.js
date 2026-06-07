/**
 * File: server/routes/posts.routes.js
 * Purpose: full REST for /posts incl. nested GET /posts/:id/comments + ownership checks (stage E).
 * Owner: Partner B
 * Stage: B (שלב ב) + E (שלב ה)
 */
const express = require('express');
const postsQueries = require('../db/posts.queries');
const commentsQueries = require('../db/comments.queries');
const router = express.Router();

// GET /posts            GET /posts?userId=1  (active user's posts, sorted by id)
router.get('/', async (req, res) => {
  // TODO (B)
});

// GET /posts/:id -> 404 if not found
router.get('/:id', async (req, res) => {
  // TODO (B)
});

// GET /posts/:id/comments  (jsonplaceholder-style nested route - "לפי דרישה יוצגו ה-comments")
router.get('/:id/comments', async (req, res) => {
  // TODO (B): commentsQueries.getCommentsByPost(req.params.id)
});

// POST /posts   body: { userId, title, body }
router.post('/', async (req, res) => {
  // TODO (B): validate -> 400; create -> 201 + new post
});

// PUT /posts/:id   body: { userId, title?, body? }  -- ONLY if the post belongs to userId
router.put('/:id', async (req, res) => {
  // TODO (B): OWNERSHIP CHECK (stage E):
  //   const post = await postsQueries.getPostById(id);  if (!post) -> 404
  //   if (post.user_id !== Number(req.body.userId)) -> res.status(403).json({ error: 'not your post' })
  //   then update and return the updated row
});

// DELETE /posts/:id?userId=...  -- ONLY if the post belongs to userId
router.delete('/:id', async (req, res) => {
  // TODO (B): same ownership check (userId from req.query), then delete -> 204
});

module.exports = router;

/* EXAM NOTES:
 * - בדיקת בעלות חייבת להיות בשרת. הסתרת כפתור Delete בלקוח היא UX בלבד -
 *   כל אחד יכול לשלוח DELETE ב-postman; רק השרת באמת אוכף.
 * - מגבלה כנה (לומר בבחינה): בלי session/JWT השרת "מאמין" ל-userId שהלקוח מצהיר.
 *   בייצור הזהות נקבעת בצד השרת מתוך token, לא מתוך גוף הבקשה.
 * - הראוט המקונן /posts/:id/comments חי כאן (קובץ של B) ולכן אין התנגשות עם אף אחד.
 */
