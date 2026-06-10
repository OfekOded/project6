/**
 * File: client/src/pages/Posts.jsx
 * Purpose: /users/:username/posts - active user's posts page.
 * Owner: Partner B
 * Stage: E
 */
import { useState } from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { getCurrentUser } from '../storage';
import usePosts from '../hooks/usePosts';
import PostForm from '../components/posts/PostForm';
import PostItem from '../components/posts/PostItem';
import '../styles/Posts.css';

export default function Posts() {
  const user = getCurrentUser();
  const { username } = useParams();
  const [openPostId, setOpenPostId] = useState(null);
  const { posts, loading, loadError, actionError, addPost, savePost, deletePost } = usePosts(user?.id);

  async function handleDelete(post) {
    if (!window.confirm('Delete this post and its comments?')) return;

    const deleted = await deletePost(post);
    if (deleted && openPostId === post.id) setOpenPostId(null);
  }

  function toggleComments(postId) {
    setOpenPostId((curr) => (curr === postId ? null : postId));
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="posts-page">
      <header className="posts-header">
        <Link className="back-link" to={`/users/${username}`}>Back</Link>
        <h1>Posts</h1>
      </header>

      <PostForm onAdd={addPost} />

      {actionError && <p className="error-text">{actionError}</p>}
      {loading && <p className="muted">Loading posts...</p>}
      {loadError && <p className="error-text">{loadError}</p>}
      {!loading && !loadError && posts.length === 0 && (
        <p className="muted">No posts yet. Write your first one above.</p>
      )}

      <ul className="post-list">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            currentUser={user}
            commentsOpen={openPostId === post.id}
            onToggleComments={toggleComments}
            onSave={savePost}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
