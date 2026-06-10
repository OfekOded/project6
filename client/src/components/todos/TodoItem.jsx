export default function TodoItem({ todo, onToggle, onRename, onDelete }) {
  return (
    <li className="todo-item card">
      <label className="todo-check">
        <input
          type="checkbox"
          checked={!!todo.completed}
          onChange={() => onToggle(todo)}
        />
        <span className={todo.completed ? 'todo-title todo-title-done' : 'todo-title'}>
          {todo.title}
        </span>
      </label>
      <div className="todo-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onRename(todo)}>Edit</button>
        <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </li>
  );
}
