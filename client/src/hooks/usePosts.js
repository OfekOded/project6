import { useState, useEffect } from 'react';
import { getJson, postJson, putJson, deleteJson } from '../apiClient';

export default function usePosts(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');

  async function loadPosts() {
    if (!userId) return;

    setLoading(true);
    setLoadError('');
    try {
      setPosts(await getJson(`/posts?userId=${userId}`));
    } catch {
      setLoadError('Could not load posts. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadUserPosts() {
      if (!userId) return;

      setLoading(true);
      setLoadError('');
      try {
        const data = await getJson(`/posts?userId=${userId}`);
        if (active) setPosts(data);
      } catch {
        if (active) setLoadError('Could not load posts. Is the server running?');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUserPosts();
    return () => { active = false; };
  }, [userId]);

  async function addPost({ title, body }) {
    if (!userId) return false;

    setActionError('');
    try {
      await postJson('/posts', { userId, title, body });
      loadPosts();
      return true;
    } catch {
      setActionError('Could not create the post.');
      return false;
    }
  }

  async function savePost(post, changes) {
    if (!userId) return false;

    setActionError('');
    try {
      await putJson(`/posts/${post.id}`, { userId, ...changes });
      loadPosts();
      return true;
    } catch (err) {
      if (err.status === 403) {
        setActionError('You can only edit your own posts.');
        return false;
      }
      setActionError('Could not save changes.');
      return false;
    }
  }

  async function deletePost(post) {
    if (!userId) return false;

    setActionError('');
    try {
      await deleteJson(`/posts/${post.id}?userId=${userId}`);
      loadPosts();
      return true;
    } catch (err) {
      if (err.status === 403) {
        setActionError('You can only delete your own posts.');
        return false;
      }
      setActionError('Could not delete the post.');
      return false;
    }
  }

  return {
    posts,
    loading,
    loadError,
    actionError,
    addPost,
    savePost,
    deletePost,
  };
}
