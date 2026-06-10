import { useState } from 'react';
import FormField from '../forms/FormField';

export default function PostForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim() || !body.trim()) {
      setError('A post needs both a title and a body.');
      return;
    }

    const added = await onAdd({ title, body });
    if (added) {
      setTitle('');
      setBody('');
    }
  }

  return (
    <form className="post-form card" onSubmit={handleSubmit}>
      <h2>New post</h2>
      <FormField id="new-title" label="Title" value={title} onChange={setTitle} />
      <FormField id="new-body" label="Body" value={body} onChange={setBody} rows={3} multiline />
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn btn-primary">Add post</button>
    </form>
  );
}
