import { useState } from 'react';
import usePhotos from '../../hooks/usePhotos';

export default function AlbumPhotos({ album, currentUser }) {
  const { photos, loading, error, addPhoto, deletePhoto } = usePhotos(album.id, currentUser.id);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [formError, setFormError] = useState('');

  async function handleAdd(e) {
    e.preventDefault();
    setFormError('');
    if (!title.trim() || !url.trim()) {
      setFormError('A photo needs a title and an image URL.');
      return;
    }
    const ok = await addPhoto({ title: title.trim(), url: url.trim(), thumbnailUrl: url.trim() });
    if (ok) { setTitle(''); setUrl(''); }
  }

  return (
    <div className="album-photos">
      {loading && <p className="muted">Loading photos...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && photos.length === 0 && <p className="muted">No photos in this album yet.</p>}

      <ul className="photo-grid">
        {photos.map((photo) => (
          <li key={photo.id} className="photo-item">
            <img src={photo.thumbnail_url} alt={photo.title} loading="lazy" />
            <span className="photo-title">{photo.title}</span>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => deletePhoto(photo)}>Delete</button>
          </li>
        ))}
      </ul>

      <form className="photo-form" onSubmit={handleAdd}>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Photo title" />
        <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Image URL (https://...)" />
        <button type="submit" className="btn btn-primary btn-sm">Add photo</button>
        {formError && <p className="error-text">{formError}</p>}
      </form>
    </div>
  );
}
