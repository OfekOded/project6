import { useState, useEffect } from 'react';
import { getJson, postJson, putJson, deleteJson } from '../apiClient';

export default function useComments(postId, currentUser) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadComments() {
    setLoading(true);
    setError('');
    try {
      setComments(await getJson(`/posts/${postId}/comments`));
    } catch {
      setError('Could not load comments.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadPostComments() {
      setLoading(true);
      setError('');
      try {
        const data = await getJson(`/posts/${postId}/comments`);
        if (active) setComments(data);
      } catch {
        if (active) setError('Could not load comments.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPostComments();
    return () => { active = false; };
  }, [postId]);

  async function addComment(body) {
    setError('');
    try {
      await postJson('/comments', { postId, userId: currentUser.id, body });
      loadComments();
      return true;
    } catch {
      setError('Could not add the comment.');
      return false;
    }
  }

  async function saveComment(comment, body) {
    setError('');
    try {
      await putJson(`/comments/${comment.id}`, { userId: currentUser.id, body });
      loadComments();
      return true;
    } catch (err) {
      if (err.status === 403) {
        setError('You can only edit your own comments.');
        return false;
      }
      setError('Could not save the comment.');
      return false;
    }
  }

  async function deleteComment(comment) {
    setError('');
    try {
      await deleteJson(`/comments/${comment.id}?userId=${currentUser.id}`);
      loadComments();
    } catch (err) {
      if (err.status === 403) {
        setError('You can only delete your own comments.');
        return;
      }
      setError('Could not delete the comment.');
    }
  }

  return {
    comments,
    loading,
    error,
    addComment,
    saveComment,
    deleteComment,
  };
}
