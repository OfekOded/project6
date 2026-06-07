/**
 * File: server/db/todos.queries.js
 * Purpose: all SQL for the todos table.
 * Owner: Partner A
 * Stage: B (שלב ב) + D (שלב ד)
 */
const pool = require('./connection');

// List with optional filters: { userId, completed } -> WHERE built dynamically, ORDER BY id
async function getTodos(filters) {
  // TODO (A): start with 'SELECT ... FROM todos', collect conditions + params arrays,
  //           append 'WHERE'/'AND' as needed, always 'ORDER BY id' (stage D requirement).
}

async function getTodoById(id) {
  // TODO (A): SELECT ... WHERE id = ?
}

// Returns the created row (use result.insertId, then fetch it)
async function createTodo({ userId, title }) {
  // TODO (A): INSERT INTO todos (user_id, title) VALUES (?, ?)  - completed defaults to 0
}

// Partial update: only update fields that were actually sent
async function updateTodo(id, { title, completed }) {
  // TODO (A): UPDATE todos SET ... WHERE id = ?
}

async function deleteTodo(id) {
  // TODO (A): DELETE FROM todos WHERE id = ?  -> return result.affectedRows
}

module.exports = { getTodos, getTodoById, createTodo, updateTodo, deleteTodo };

/* EXAM NOTES:
 * - "מה זו מחיקה?" (שאלה מפורשת במסמך!): כאן מחיקה פיזית (DELETE FROM).
 *   האלטרנטיבה: מחיקה לוגית - עמודת is_deleted, ו-GET שמסנן אותה. יתרונות: שחזור,
 *   היסטוריה, שמירת שלמות FK. חסרונות: כל שאילתה מסתבכת. ראו EXAM_PREP.md סעיף 5.
 * - affectedRows מאפשר להחזיר 404 אם המחיקה/העדכון לא מצאו שורה.
 */
