/**
 * File: server/routes/register.routes.js
 * Purpose: POST /register - create a new user + password row (stage C).
 * Owner: Partner B
 * Stage: C (שלב ג)
 */
const express = require('express');
const registerQueries = require('../db/register.queries');
const router = express.Router();

// Minimum password length, enforced on the SERVER (the client check can be bypassed in Postman).
const PASSWORD_MIN = 6;

// POST /register   body: { username, password, name, email, phone }
// Success -> 201 + new user WITHOUT password. Taken username -> 409. Bad body -> 400.
router.post('/', async (req, res) => {
  try {
    const { username, password, name, email, phone } = req.body;

    // 1. validate required fields (server-side - the client form cannot be trusted)
    if (!username || !password || !name) {
      return res.status(400).json({ error: 'username, password and name are required' });
    }

    // 1b. password policy (server-side enforcement)
    if (password.length < PASSWORD_MIN) {
      return res.status(400).json({ error: `password must be at least ${PASSWORD_MIN} characters` });
    }

    // 2. username already taken?
    if (await registerQueries.usernameExists(username)) {
      return res.status(409).json({ error: 'username taken' });
    }

    // 3. create both rows in one transaction and return the user (no password echoed back)
    const user = await registerQueries.createUserWithPassword(
      { username, name, email, phone },
      password
    );
    res.status(201).json(user);
  } catch (err) {
    console.error('POST /register', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;

/* EXAM NOTES:
 * - 409 Conflict = הבקשה תקינה אבל מתנגשת במצב קיים (username תפוס). שונה מ-400 (בקשה פגומה).
 * - ולידציה בצד שרת חובה גם אם הטופס בלקוח בודק - כל אחד יכול לשלוח בקשה ישירות ב-postman.
 * - התשובה (201) מחזירה את המשתמש בלי שדה password - הסיסמה לעולם לא יוצאת מהשרת.
 */
