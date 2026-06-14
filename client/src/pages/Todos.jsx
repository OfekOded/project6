import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../storage';
import useTodos from '../hooks/useTodos';
import AppHeader from '../components/AppHeader';
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
    <>
      <AppHeader active="todos" />
      <main className="page todos-page">
        <div className="page-head">
          <h1>Todos</h1>
          <p className="page-sub">Track what needs to get done.</p>
        </div>

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
      </main>
    </>
  );
}
