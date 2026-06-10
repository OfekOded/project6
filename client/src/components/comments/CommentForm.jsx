import { useState } from 'react';

export default function CommentForm({ onAdd }) {
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmed = body.trim();
    if (!trimmed) {
      setError('Write something first.');
      return;
    }

    const added = await onAdd(trimmed);
    if (added) setBody('');
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className="input"
        rows={2}
        placeholder="Add a comment..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn btn-primary btn-sm">Comment</button>
    </form>
  );
}
