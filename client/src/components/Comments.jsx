/**
 * File: client/src/components/Comments.jsx
 * Purpose: comments of one post - list + add; edit/delete only the active user's own comments (stage E).
 *          Used inside the Posts page: <Comments postId={...} currentUser={...} />
 * Owner: Partner B
 * Stage: E (שלב ה)
 */
import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './Comments.css';

export default function Comments({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBody, setNewBody] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody] = useState('');

  async function loadComments() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments`);
      if (!res.ok) throw new Error();
      setComments(await res.json());
    } catch {
      setError('Could not load comments.');
    } finally {
      setLoading(false);
    }
  }

  // Reload whenever a different post is opened.
  useEffect(() => { loadComments(); }, [postId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    if (!newBody.trim()) { setError('Write something first.'); return; }
    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId: currentUser.id, body: newBody }),
      });
      if (!res.ok) throw new Error();
      setNewBody('');
      loadComments();
    } catch {
      setError('Could not add the comment.');
    }
  }

  function startEdit(c) { setEditingId(c.id); setEditBody(c.body); setError(''); }
  function cancelEdit() { setEditingId(null); }

  async function saveEdit(c) {
    setError('');
    try {
      const res = await fetch(`${API_URL}/comments/${c.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, body: editBody }),
      });
      if (res.status === 403) { setError('You can only edit your own comments.'); return; }
      if (!res.ok) throw new Error();
      setEditingId(null);
      loadComments();
    } catch {
      setError('Could not save the comment.');
    }
  }

  async function handleDelete(c) {
    setError('');
    try {
      const res = await fetch(`${API_URL}/comments/${c.id}?userId=${currentUser.id}`, {
        method: 'DELETE',
      });
      if (res.status === 403) { setError('You can only delete your own comments.'); return; }
      if (!res.ok && res.status !== 204) throw new Error();
      loadComments();
    } catch {
      setError('Could not delete the comment.');
    }
  }

  return (
    <div className="comments-box">
      {loading && <p className="muted">Loading comments…</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && comments.length === 0 && <p className="muted">No comments yet.</p>}

      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.id} className="comment">
            {editingId === c.id ? (
              <div className="comment-edit">
                <textarea className="input" rows={2} value={editBody}
                          onChange={(e) => setEditBody(e.target.value)} />
                <div className="comment-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => saveEdit(c)}>Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="comment-author">{c.user_name || c.user_username}</div>
                <div className="comment-body">{c.body}</div>
                {/* Own-only buttons: a UX convenience. The server enforces it again with 403. */}
                {c.user_id === currentUser.id && (
                  <div className="comment-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(c)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      <form className="comment-form" onSubmit={handleAdd}>
        <textarea className="input" rows={2} placeholder="Add a comment…" value={newBody}
                  onChange={(e) => setNewBody(e.target.value)} />
        <button type="submit" className="btn btn-primary btn-sm">Comment</button>
      </form>
    </div>
  );
}
