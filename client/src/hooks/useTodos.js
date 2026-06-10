import { useState, useEffect } from 'react';
import { getJson, postJson, putJson, deleteJson } from '../apiClient';

export default function useTodos(userId) {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');

  function todosUrl() {
    const completedParam = filter === 'done' ? '&completed=1' : filter === 'open' ? '&completed=0' : '';
    return `/todos?userId=${userId}${completedParam}`;
  }

  async function loadTodos() {
    if (!userId) return;

    setLoading(true);
    setLoadError('');
    try {
      setTodos(await getJson(todosUrl()));
    } catch {
      setLoadError('Could not load todos. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadFilteredTodos() {
      if (!userId) return;

      setLoading(true);
      setLoadError('');
      try {
        const completedParam = filter === 'done' ? '&completed=1' : filter === 'open' ? '&completed=0' : '';
        const data = await getJson(`/todos?userId=${userId}${completedParam}`);
        if (active) setTodos(data);
      } catch {
        if (active) setLoadError('Could not load todos. Is the server running?');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFilteredTodos();
    return () => { active = false; };
  }, [filter, userId]);

  async function addTodo(title) {
    if (!userId) return false;

    setActionError('');
    try {
      await postJson('/todos', { userId, title });
      loadTodos();
      return true;
    } catch {
      setActionError('Could not add the todo.');
      return false;
    }
  }

  async function toggleTodo(todo) {
    setActionError('');
    try {
      await putJson(`/todos/${todo.id}`, { completed: !todo.completed });
      loadTodos();
    } catch {
      setActionError('Could not update the todo.');
    }
  }

  async function renameTodo(todo, title) {
    setActionError('');
    try {
      await putJson(`/todos/${todo.id}`, { title });
      loadTodos();
    } catch {
      setActionError('Could not rename the todo.');
    }
  }

  async function deleteTodo(id) {
    setActionError('');
    try {
      await deleteJson(`/todos/${id}`);
      setTodos((curr) => curr.filter((todo) => todo.id !== id));
    } catch {
      setActionError('Could not delete the todo.');
    }
  }

  return {
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
  };
}
