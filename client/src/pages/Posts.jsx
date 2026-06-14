import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../storage';
import usePosts from '../hooks/usePosts';
import AppHeader from '../components/AppHeader';
import PostForm from '../components/posts/PostForm';
import PostItem from '../components/posts/PostItem';
import '../styles/Posts.css';

export default function Posts() {
  const user = getCurrentUser();
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
    <>
      <AppHeader active="posts" />
      <main className="page posts-page">
        <div className="page-head">
          <h1>Posts</h1>
          <p className="page-sub">Share an update and discuss in the comments.</p>
        </div>

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
      </main>
    </>
  );
}
