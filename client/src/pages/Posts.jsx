/**
 * File: client/src/pages/Posts.jsx
 * Purpose: /users/:username/posts - the active user's posts sorted by id; comments shown
 *          on demand (expand); add / edit / delete with ownership rules (stage E).
 * Owner: Partner B
 * Stage: E (שלב ה)
 */
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { API_URL } from '../config';
import { getCurrentUser } from '../storage';
import Comments from '../components/Comments';
import './Posts.css';

export default function Posts() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  // TODO (B): state: posts[], openPostId (which post's comments are expanded), newTitle, newBody

  // TODO (B): loadPosts() -> GET `${API_URL}/posts?userId=${user.id}` in useEffect (sorted by id)

  // TODO (B): handleAdd()    -> POST /posts { userId: user.id, title, body } -> 201 -> reload
  // TODO (B): handleEdit(p)  -> PUT /posts/:id { userId: user.id, title, body }
  //                             (server returns 403 if not the owner - show the error)
  // TODO (B): handleDelete(p)-> DELETE /posts/:id?userId=${user.id}
  // TODO (B): toggleComments(postId) -> setOpenPostId(...)  -> renders <Comments postId=... />

  return (
    <div className="posts-page">
      {/* TODO (B): add-post form + list of posts; each post: title, body,
          "show comments" button -> <Comments postId={post.id} currentUser={user} />,
          edit/delete buttons (all posts here belong to the active user) */}
    </div>
  );
}
