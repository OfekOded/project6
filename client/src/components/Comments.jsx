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
  // TODO (B): state: comments[], newBody

  // TODO (B): useEffect -> GET `${API_URL}/posts/${postId}/comments` (reload when postId changes)

  // TODO (B): handleAdd()    -> POST /comments { postId, userId: currentUser.id, body }
  // TODO (B): handleEdit(c)  -> PUT /comments/:id { userId: currentUser.id, body }
  // TODO (B): handleDelete(c)-> DELETE /comments/:id?userId=${currentUser.id}
  // UI rule: render edit/delete buttons ONLY when c.user_id === currentUser.id
  // (and the server enforces it again with 403 - the real protection).

  return (
    <div className="comments-box">
      {/* TODO (B): list of comments + add-comment form */}
    </div>
  );
}
