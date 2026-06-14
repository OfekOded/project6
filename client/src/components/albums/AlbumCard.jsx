import { useState } from 'react';
import AlbumPhotos from './AlbumPhotos';

export default function AlbumCard({ album, currentUser, onRename, onDelete }) {
  const [open, setOpen] = useState(false);

  function handleRename() {
    const title = window.prompt('Edit album title', album.title);
    if (title === null) return;
    const trimmed = title.trim();
    if (trimmed) onRename(album, trimmed);
  }

  function handleDelete() {
    if (window.confirm('Delete this album and all its photos?')) onDelete(album);
  }

  return (
    <li className="album-card card">
      <div className="album-head">
        <h3 className="album-title">{album.title}</h3>
        <div className="album-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen((o) => !o)}>
            {open ? 'Hide photos' : 'Show photos'}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleRename}>Rename</button>
          <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {open && <AlbumPhotos album={album} currentUser={currentUser} />}
    </li>
  );
}
