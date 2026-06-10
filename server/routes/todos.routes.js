/**
 * File: server/routes/todos.routes.js
 * Purpose: full REST for /todos - GET (with criteria) / POST / PUT / DELETE (stage D).
 * Owner: Partner A
 * Stage: B (שלב ב) + D (שלב ד)
 */
const express = require('express');
const todosQueries = require('../db/todos.queries');
const router = express.Router();

// GET /todos
// GET /todos?userId=1            (the client uses this for the active user's list)
// GET /todos?userId=1&completed=1  ("לפי קריטריונים ו/או שאילתות" - stage D)
router.get('/', async (req, res) => {
  try {
    const todos = await todosQueries.getTodos(req.query);
    res.json(todos);
  } catch (err) {
    console.error('GET /todos', err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /todos/:id -> 404 if not found
router.get('/:id', async (req, res) => {
  try {
    const todo = await todosQueries.getTodoById(req.params.id);
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
    const { userId, title } = req.body;
    if (!userId || !title) {
      return res.status(400).json({ error: 'userId and title are required' });
    }

    const todo = await todosQueries.createTodo({ userId, title });
    res.status(201).json(todo);
  } catch (err) {
    console.error('POST /todos', err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /todos/:id   body: { title?, completed? }  (toggle checkbox = PUT with completed)
router.put('/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;
    if (title === undefined && completed === undefined) {
      return res.status(400).json({ error: 'nothing to update' });
    }

    const updated = await todosQueries.updateTodo(req.params.id, { title, completed });
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
    const deleted = await todosQueries.deleteTodo(req.params.id);
    if (deleted === 0) return res.status(404).json({ error: 'todo not found' });
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /todos/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;

/* EXAM NOTES:
 * - קודי סטטוס בפרויקט: 200 OK, 201 Created (POST מוצלח), 204 No Content (DELETE),
 *   400 Bad Request (ולידציה), 404 Not Found, 500 Internal Server Error.
 * - PUT אצלנו מעדכן את השדות שנשלחו (סמנטית קרוב ל-PATCH - נקודה לדיון בבחינה).
 */
