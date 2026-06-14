import { useState } from 'react';
import Comments from '../comments/Comments';

export default function PostItem({
  post,
  currentUser,
  commentsOpen,
  onToggleComments,
  onSave,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);
  const isOwner = post.user_id === currentUser.id;

  function startEdit() {
    setEditing(true);
    setEditTitle(post.title);
    setEditBody(post.body);
  }

  function cancelEdit() {
    setEditing(false);
  }

  async function saveEdit() {
    const saved = await onSave(post, { title: editTitle, body: editBody });
    if (saved) setEditing(false);
  }

  return (
    <li className="post-card card">
      {editing ? (
        <div className="post-edit">
          <input
            className="input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            className="input"
            rows={3}
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
          />
          <div className="post-actions">
            <button className="btn btn-primary" onClick={saveEdit}>Save</button>
            <button className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="post-title">{post.title}</h3>
          <p className="post-body">{post.body}</p>
          <div className="post-meta muted">by {post.user_name} · {formatDate(post.created_at)}</div>
          <div className="post-actions">
            <button className="btn btn-ghost" onClick={() => onToggleComments(post.id)}>
              {commentsOpen ? 'Hide comments' : 'Show comments'}
            </button>
            {isOwner && <button className="btn btn-ghost" onClick={startEdit}>Edit</button>}
            {isOwner && <button className="btn btn-danger" onClick={() => onDelete(post)}>Delete</button>}
          </div>
          {commentsOpen && (
            <Comments postId={post.id} currentUser={currentUser} />
          )}
        </>
      )}
    </li>
  );
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '' : d.toLocaleString();
}
