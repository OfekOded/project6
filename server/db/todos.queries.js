/**
 * File: server/db/todos.queries.js
 * Purpose: all SQL for the todos table.
 * Owner: Partner A
 * Stage: B (שלב ב) + D (שלב ד)
 */
const pool = require('./connection');

// List with optional filters: { userId, completed } -> WHERE built dynamically, ORDER BY id
async function getTodos(filters) {
  let sql = 'SELECT id, user_id, title, completed FROM todos';
  const conditions = [];
  const params = [];

  if (filters?.userId !== undefined && filters.userId !== null && filters.userId !== '') {
    conditions.push('user_id = ?');
    params.push(filters.userId);
  }
  if (filters?.completed !== undefined && filters.completed !== null && filters.completed !== '') {
    conditions.push('completed = ?');
    params.push(Number(filters.completed));
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }
  sql += ' ORDER BY id';

  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getTodoById(id) {
  const [rows] = await pool.execute(
    'SELECT id, user_id, title, completed FROM todos WHERE id = ?',
    [id]
  );
  return rows[0];
}

// Returns the created row (use result.insertId, then fetch it)
async function createTodo({ userId, title }) {
  const [result] = await pool.execute(
    'INSERT INTO todos (user_id, title) VALUES (?, ?)',
    [userId, title]
  );
  return getTodoById(result.insertId);
}

// Partial update: only update fields that were actually sent
async function updateTodo(id, { title, completed }) {
  const fields = [];
  const params = [];

  if (title !== undefined) {
    fields.push('title = ?');
    params.push(title);
  }
  if (completed !== undefined) {
    fields.push('completed = ?');
    params.push(completed ? 1 : 0);
  }
  if (fields.length === 0) return getTodoById(id);

  params.push(id);
  await pool.execute(`UPDATE todos SET ${fields.join(', ')} WHERE id = ?`, params);
  return getTodoById(id);
}

async function deleteTodo(id) {
  const [result] = await pool.execute('DELETE FROM todos WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { getTodos, getTodoById, createTodo, updateTodo, deleteTodo };

/* EXAM NOTES:
 * - "מה זו מחיקה?" (שאלה מפורשת במסמך!): כאן מחיקה פיזית (DELETE FROM).
 *   האלטרנטיבה: מחיקה לוגית - עמודת is_deleted, ו-GET שמסנן אותה. יתרונות: שחזור,
 *   היסטוריה, שמירת שלמות FK. חסרונות: כל שאילתה מסתבכת. ראו EXAM_PREP.md סעיף 5.
 * - affectedRows מאפשר להחזיר 404 אם המחיקה/העדכון לא מצאו שורה.
 */
