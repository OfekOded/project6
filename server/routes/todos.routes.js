const express = require('express');
const todosQueries = require('../db/todos.queries');
const { parseId, parseBool01 } = require('../utils/validate');
const router = express.Router();

// GET /todos
// GET /todos?userId=1            (the client uses this for the active user's list)
// GET /todos?userId=1&completed=1  ("לפי קריטריונים ו/או שאילתות" - stage D)
router.get('/', async (req, res) => {
  try {
    // Validate the OPTIONAL filters at the boundary - reject bad values with 400.
    const filters = {};
    if (req.query.userId !== undefined && req.query.userId !== '') {
      const userId = parseId(req.query.userId);
      if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });
      filters.userId = userId;
    }
    if (req.query.completed !== undefined && req.query.completed !== '') {
      const completed = parseBool01(req.query.completed);
      if (completed === null) return res.status(400).json({ error: 'completed must be 0 or 1' });
      filters.completed = completed;
    }

    const todos = await todosQueries.getTodos(filters);
    res.json(todos);
  } catch (err) {
    console.error('GET /todos', err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /todos/:id -> 404 if not found
router.get('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const todo = await todosQueries.getTodoById(id);
    if (!todo) return res.status(404).json({ error: 'todo not found' });
    res.json(todo);
  } catch (err) {
    console.error('GET /todos/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

// POST /todos   body: { userId, title }
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    const userId = parseId(req.body.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }

    const todo = await todosQueries.createTodo({ userId, title: title.trim() });
    res.status(201).json(todo);
  } catch (err) {
    console.error('POST /todos', err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /todos/:id   body: { title?, completed? }  (toggle checkbox = PUT with completed)
router.put('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const { title, completed } = req.body;
    if (title === undefined && completed === undefined) {
      return res.status(400).json({ error: 'nothing to update' });
    }

    const updated = await todosQueries.updateTodo(id, { title, completed });
    if (!updated) return res.status(404).json({ error: 'todo not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /todos/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

// DELETE /todos/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const deleted = await todosQueries.deleteTodo(id);
    if (deleted === 0) return res.status(404).json({ error: 'todo not found' });
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /todos/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
