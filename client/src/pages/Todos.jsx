/**
 * File: client/src/pages/Todos.jsx
 * Purpose: /users/:username/todos - active user's todos page.
 * Owner: Partner A
 * Stage: D
 */
import { Navigate, Link } from 'react-router-dom';
import { getCurrentUser } from '../storage';
import useTodos from '../hooks/useTodos';
import TodoForm from '../components/todos/TodoForm';
import TodoFilters from '../components/todos/TodoFilters';
import TodoItem from '../components/todos/TodoItem';
import '../styles/Todos.css';

export default function Todos() {
  const user = getCurrentUser();
  const {
    todos,
    filter,
    setFilter,
    loading,
    loadError,
    actionError,
    addTodo,
    toggleTodo,
    renameTodo,
    deleteTodo,
  } = useTodos(user?.id);

  function handleRename(todo) {
    const title = window.prompt('Edit todo title', todo.title);
    if (title === null) return;

    const trimmed = title.trim();
    if (trimmed) renameTodo(todo, trimmed);
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="todos-page">
      <header className="todos-header">
        <Link className="back-link" to={`/users/${user.username}`}>Back</Link>
        <h1>Todos</h1>
      </header>

      <TodoForm onAdd={addTodo} />
      <TodoFilters filter={filter} onChange={setFilter} />

      {actionError && <p className="error-text">{actionError}</p>}
      {loading && <p className="muted">Loading todos...</p>}
      {loadError && <p className="error-text">{loadError}</p>}
      {!loading && !loadError && todos.length === 0 && (
        <p className="muted">No todos match this view.</p>
      )}

      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onRename={handleRename}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}
