/**
 * File: client/src/pages/Posts.jsx
 * Purpose: /users/:username/posts - the active user's posts sorted by id; comments shown
 *          on demand (expand); add / edit / delete with ownership rules (stage E).
 * Owner: Partner B
 * Stage: E (שלב ה)
 */
import { useState, useEffect } from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import { getCurrentUser } from '../storage';
import Comments from '../components/Comments';
import './Posts.css';

export default function Posts() {
  const user = getCurrentUser();
  // Route guard: not logged in -> back to /login.
  if (!user) return <Navigate to="/login" replace />;

  const { username } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');

  // new-post form
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  // which post's comments are open, and which post is being edited
  const [openPostId, setOpenPostId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  async function loadPosts() {
    setLoading(true);
    setLoadError('');
    try {
      const res = await fetch(`${API_URL}/posts?userId=${user.id}`);
      if (!res.ok) throw new Error();
      setPosts(await res.json());
    } catch {
      setLoadError('Could not load posts. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  // Load once on mount. (user.id is stable for the session.)
  useEffect(() => { loadPosts(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(e) {
    e.preventDefault();
    setActionError('');
    if (!newTitle.trim() || !newBody.trim()) {
      setActionError('A post needs both a title and a body.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, title: newTitle, body: newBody }),
      });
      if (!res.ok) throw new Error();
      setNewTitle('');
      setNewBody('');
      loadPosts();
    } catch {
      setActionError('Could not create the post.');
    }
  }

  function startEdit(post) {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditBody(post.body);
    setActionError('');
  }
  function cancelEdit() { setEditingId(null); }

  async function saveEdit(post) {
    setActionError('');
    try {
      const res = await fetch(`${API_URL}/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, title: editTitle, body: editBody }),
      });
      if (res.status === 403) { setActionError('You can only edit your own posts.'); return; }
      if (!res.ok) throw new Error();
      setEditingId(null);
      loadPosts();
    } catch {
      setActionError('Could not save changes.');
    }
  }

  async function handleDelete(post) {
    if (!window.confirm('Delete this post and its comments?')) return;
    setActionError('');
    try {
      const res = await fetch(`${API_URL}/posts/${post.id}?userId=${user.id}`, {
        method: 'DELETE',
      });
      if (res.status === 403) { setActionError('You can only delete your own posts.'); return; }
      if (!res.ok && res.status !== 204) throw new Error();
      if (openPostId === post.id) setOpenPostId(null);
      loadPosts();
    } catch {
      setActionError('Could not delete the post.');
    }
  }

  function toggleComments(postId) {
    setOpenPostId((curr) => (curr === postId ? null : postId));
  }

  return (
    <div className="posts-page">
      <header className="posts-header">
        <Link className="back-link" to={`/users/${username}`}>← Back</Link>
        <h1>Posts</h1>
      </header>

      <form className="post-form card" onSubmit={handleAdd}>
        <h2>New post</h2>
        <div className="form-field">
          <label htmlFor="new-title">Title</label>
          <input id="new-title" className="input" value={newTitle}
                 onChange={(e) => setNewTitle(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="new-body">Body</label>
          <textarea id="new-body" className="input" rows={3} value={newBody}
                    onChange={(e) => setNewBody(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Add post</button>
      </form>

      {actionError && <p className="error-text">{actionError}</p>}

      {loading && <p className="muted">Loading posts…</p>}
      {loadError && <p className="error-text">{loadError}</p>}
      {!loading && !loadError && posts.length === 0 && (
        <p className="muted">No posts yet. Write your first one above.</p>
      )}

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-card card">
            {editingId === post.id ? (
              <div className="post-edit">
                <input className="input" value={editTitle}
                       onChange={(e) => setEditTitle(e.target.value)} />
                <textarea className="input" rows={3} value={editBody}
                          onChange={(e) => setEditBody(e.target.value)} />
                <div className="post-actions">
                  <button className="btn btn-primary" onClick={() => saveEdit(post)}>Save</button>
                  <button className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-body">{post.body}</p>
                <div className="post-meta muted">{formatDate(post.created_at)}</div>
                <div className="post-actions">
                  <button className="btn btn-ghost" onClick={() => toggleComments(post.id)}>
                    {openPostId === post.id ? 'Hide comments' : 'Show comments'}
                  </button>
                  <button className="btn btn-ghost" onClick={() => startEdit(post)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(post)}>Delete</button>
                </div>
                {openPostId === post.id && (
                  <Comments postId={post.id} currentUser={user} />
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// MySQL DATETIME -> readable local string. Returns '' for missing/invalid values.
function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '' : d.toLocaleString();
}
