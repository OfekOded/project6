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
