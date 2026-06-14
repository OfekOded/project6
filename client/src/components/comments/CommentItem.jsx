import { useState } from 'react';

export default function CommentItem({ comment, currentUser, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);

  function startEdit() {
    setEditing(true);
    setEditBody(comment.body);
  }

  function cancelEdit() {
    setEditing(false);
  }

  async function saveEdit() {
    const saved = await onSave(comment, editBody);
    if (saved) setEditing(false);
  }

  return (
    <li className="comment">
      {editing ? (
        <div className="comment-edit">
          <textarea
            className="input"
            rows={2}
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
          />
          <div className="comment-actions">
            <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
            <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="comment-head">
            <span className="avatar avatar-sm" aria-hidden="true">
              {(comment.user_name || comment.user_username || '?').trim().charAt(0).toUpperCase()}
            </span>
            <span className="comment-author">{comment.user_name || comment.user_username}</span>
          </div>
          <div className="comment-body">{comment.body}</div>
          {comment.user_id === currentUser.id && (
            <div className="comment-actions">
              <button className="btn btn-ghost btn-sm" onClick={startEdit}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(comment)}>Delete</button>
            </div>
          )}
        </>
      )}
    </li>
  );
}
