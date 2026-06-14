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
  const [scope, setScope] = useState('mine');
  const { posts, loading, loadError, actionError, addPost, savePost, deletePost } = usePosts(user?.id, scope);

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

        <div className="posts-scope" aria-label="Posts filter">
          <button type="button" className={`btn ${scope === 'mine' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setScope('mine')}>My posts</button>
          <button type="button" className={`btn ${scope === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setScope('all')}>All posts</button>
        </div>

        {actionError && <p className="error-text">{actionError}</p>}
        {loading && <p className="muted">Loading posts...</p>}
        {loadError && <p className="error-text">{loadError}</p>}
        {!loading && !loadError && posts.length === 0 && (
          <p className="muted">
            {scope === 'mine' ? 'No posts yet. Write your first one above.' : 'No posts to show.'}
          </p>
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
