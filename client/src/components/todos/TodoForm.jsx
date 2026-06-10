import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmed = title.trim();
    if (!trimmed) {
      setError('Write a todo title first.');
      return;
    }

    const added = await onAdd(trimmed);
    if (added) setTitle('');
  }

  return (
    <form className="todo-form card" onSubmit={handleSubmit}>
      <h2>New todo</h2>
      <div className="todo-add-row">
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit" className="btn btn-primary">Add</button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
}
