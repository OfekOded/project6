const express = require('express');
const usersQueries = require('../db/users.queries');
const accountQueries = require('../db/account.queries');
const { parseId } = require('../utils/validate');
const router = express.Router();

const PASSWORD_MIN = 6;

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
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const user = await usersQueries.getUserById(id);
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json(user);
  } catch (err) {
    console.error('GET /users/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /users/:id   body: { userId, name?, email?, phone? }  -- change your own details only
router.put('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });
    const userId = parseId(req.body.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });
    if (userId !== id) return res.status(403).json({ error: 'you can only edit your own profile' });

    if (req.body.name !== undefined && !String(req.body.name).trim()) {
      return res.status(400).json({ error: 'name cannot be empty' });
    }

    const user = await usersQueries.getUserById(id);
    if (!user) return res.status(404).json({ error: 'user not found' });

    const updated = await usersQueries.updateUserDetails(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /users/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /users/:id/password   body: { userId, currentPassword, newPassword }  -- your own password only
router.put('/:id/password', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });
    const userId = parseId(req.body.userId);
    if (userId === null || userId !== id) {
      return res.status(403).json({ error: 'you can only change your own password' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length < PASSWORD_MIN) {
      return res.status(400).json({ error: `password must be at least ${PASSWORD_MIN} characters` });
    }

    const result = await accountQueries.changePassword(id, currentPassword, newPassword);
    if (result === null) return res.status(404).json({ error: 'user not found' });
    if (result === false) return res.status(401).json({ error: 'current password is incorrect' });
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /users/:id/password', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
