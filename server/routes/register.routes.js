/**
 * File: server/routes/register.routes.js
 * Purpose: POST /register - create a new user + password row (stage C).
 * Owner: Partner B
 * Stage: C (שלב ג)
 */
const express = require('express');
const registerQueries = require('../db/register.queries');
const router = express.Router();

// POST /register   body: { username, password, name, email, phone }
// Success -> 201 + new user WITHOUT password. Taken username -> 409. Bad body -> 400.
router.post('/', async (req, res) => {
  // TODO (B):
  // 1. validate required fields (username, password, name) -> else 400
  // 2. if (await registerQueries.usernameExists(username)) -> res.status(409).json({ error: 'username taken' })
  // 3. const user = await registerQueries.createUserWithPassword({...}, password)
  // 4. res.status(201).json(user)   // password is never echoed back
});

module.exports = router;

/* EXAM NOTES:
 * - 409 Conflict = הבקשה תקינה אבל מתנגשת במצב קיים (username תפוס).
 * - ולידציה בצד שרת חובה גם אם הטופס בלקוח בודק - ללקוח אי אפשר להאמין
 *   (כל אחד יכול לשלוח בקשה ישירות ב-postman).
 */
