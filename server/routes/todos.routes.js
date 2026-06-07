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
  // TODO (A): pass req.query to todosQueries.getTodos, res.json(rows)
});

// GET /todos/:id -> 404 if not found
router.get('/:id', async (req, res) => {
  // TODO (A)
});

// POST /todos   body: { userId, title }
router.post('/', async (req, res) => {
  // TODO (A): validate body (missing fields -> 400), create, res.status(201).json(newTodo)
});

// PUT /todos/:id   body: { title?, completed? }  (toggle checkbox = PUT with completed)
router.put('/:id', async (req, res) => {
  // TODO (A): update; 404 if affectedRows === 0; return the updated row
});

// DELETE /todos/:id
router.delete('/:id', async (req, res) => {
  // TODO (A): delete; 404 if nothing deleted; res.status(204).end()
});

module.exports = router;

/* EXAM NOTES:
 * - קודי סטטוס בפרויקט: 200 OK, 201 Created (POST מוצלח), 204 No Content (DELETE),
 *   400 Bad Request (ולידציה), 404 Not Found, 500 Internal Server Error.
 * - PUT אצלנו מעדכן את השדות שנשלחו (סמנטית קרוב ל-PATCH - נקודה לדיון בבחינה).
 */
