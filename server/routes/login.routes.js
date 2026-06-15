const express = require('express');
const loginQueries = require('../db/login.queries');
const { verifyPassword } = require('../db/password.util');
const router = express.Router();

// POST /login   body: { username, password }
// Success -> 200 + user WITHOUT the password field. Failure -> 401 + { error }.
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    const user = await loginQueries.getUserWithPassword(username);
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: 'wrong username or password' });
    }
    if (user.blocked) {
      return res.status(403).json({ error: 'this account is blocked' });
    }

    delete user.password;
    res.json(user);
  } catch (err) {
    console.error('POST /login', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
