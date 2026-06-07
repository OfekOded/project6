/**
 * File: client/src/pages/Todos.jsx
 * Purpose: /users/:username/todos - the active user's todos: list sorted by id with a
 *          completed checkbox, filters (criteria), add / update / delete (stage D).
 * Owner: Partner A
 * Stage: D (שלב ד)
 */
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import { getCurrentUser } from '../storage';
import './Todos.css';

export default function Todos() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  // TODO (A): state: todos[], newTitle, filter ('all' | 'done' | 'open')

  // TODO (A): loadTodos() -> GET `${API_URL}/todos?userId=${user.id}` (+ &completed=... per filter)
  //           server already returns ORDER BY id; call from useEffect on mount + when filter changes

  // TODO (A): handleAdd()        -> POST /todos { userId: user.id, title }   -> reload/append
  // TODO (A): handleToggle(todo) -> PUT /todos/:id { completed: !todo.completed }
  // TODO (A): handleRename(todo) -> PUT /todos/:id { title }
  // TODO (A): handleDelete(id)   -> DELETE /todos/:id -> remove from state

  return (
    <div className="todos-page">
      {/* TODO (A): filter controls, add form, <ul> of todos -
          each row: <input type="checkbox" checked={!!todo.completed} ...> + title + edit/delete buttons */}
    </div>
  );
}
