/**
 * File: server/routes/users.routes.js
 * Purpose: REST endpoints for /users (jsonplaceholder shape). Read-only at course level.
 * Owner: Partner A
 * Stage: B (שלב ב) + C (עמוד Info)
 */
const express = require('express');
const usersQueries = require('../db/users.queries');
const router = express.Router();

// GET /users -> all users (no passwords - the queries layer never selects them)
router.get('/', async (req, res) => {
  try {
    const users = await usersQueries.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('GET /users', err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /users/:id -> single user (Info page). 404 if not found.
router.get('/:id', async (req, res) => {
  try {
    const user = await usersQueries.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json(user);
  } catch (err) {
    console.error('GET /users/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;

/* EXAM NOTES:
 * - req.params.id מגיע מהנתיב (/users/3); req.query מגיע מ-?key=value; req.body מגוף JSON.
 * - יצירת user נעשית דרך POST /register (כולל סיסמה) - לכן אין כאן POST.
 */
