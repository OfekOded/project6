const express = require('express');
const usersQueries = require('../db/users.queries');
const { parseId } = require('../utils/validate');
const router = express.Router();

// Resolve the requester and confirm they are an admin. Returns the admin user, or null.
// Identity comes from the request (the client declares who it is); a production app would
// read it from a signed session/token instead of a query/body field.
async function getAdmin(adminIdRaw) {
  const adminId = parseId(adminIdRaw);
  if (adminId === null) return null;
  const user = await usersQueries.getUserById(adminId);
  return user && user.is_admin ? user : null;
}

// GET /admin/users?adminId=...  -> full user list (incl. blocked / is_admin) for the panel
router.get('/users', async (req, res) => {
  try {
    const admin = await getAdmin(req.query.adminId);
    if (!admin) return res.status(403).json({ error: 'admin only' });

    const users = await usersQueries.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('GET /admin/users', err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /admin/users/:id/block   body: { adminId, blocked }
router.put('/users/:id/block', async (req, res) => {
  try {
    const admin = await getAdmin(req.body.adminId);
    if (!admin) return res.status(403).json({ error: 'admin only' });

    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });
    if (id === admin.id) return res.status(400).json({ error: 'an admin cannot block themselves' });

    const target = await usersQueries.getUserById(id);
    if (!target) return res.status(404).json({ error: 'user not found' });

    const blocked = req.body.blocked ? 1 : 0;
    await usersQueries.setBlocked(id, blocked);
    res.json({ ...target, blocked });
  } catch (err) {
    console.error('PUT /admin/users/:id/block', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
