import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../storage';
import useAlbums from '../hooks/useAlbums';
import AppHeader from '../components/AppHeader';
import AlbumCard from '../components/albums/AlbumCard';
import '../styles/Albums.css';

export default function Albums() {
  const user = getCurrentUser();
  const { albums, loading, loadError, actionError, addAlbum, renameAlbum, deleteAlbum } = useAlbums(user?.id);
  const [title, setTitle] = useState('');
  const [formError, setFormError] = useState('');

  if (!user) return <Navigate to="/login" replace />;

  async function handleAdd(e) {
    e.preventDefault();
    setFormError('');
    const trimmed = title.trim();
    if (!trimmed) {
      setFormError('Write an album title first.');
      return;
    }
    const ok = await addAlbum(trimmed);
    if (ok) setTitle('');
  }

  return (
    <>
      <AppHeader active="albums" />
      <main className="page albums-page">
        <div className="page-head">
          <h1>Albums</h1>
          <p className="page-sub">Your photo albums. Open one to see its photos.</p>
        </div>

        <form className="album-form card" onSubmit={handleAdd}>
          <h2>New album</h2>
          <div className="album-add-row">
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Album title" />
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
          {formError && <p className="error-text">{formError}</p>}
        </form>

        {actionError && <p className="error-text">{actionError}</p>}
        {loading && <p className="muted">Loading albums...</p>}
        {loadError && <p className="error-text">{loadError}</p>}
        {!loading && !loadError && albums.length === 0 && (
          <p className="muted">No albums yet. Create your first one above.</p>
        )}

        <ul className="album-list">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              currentUser={user}
              onRename={renameAlbum}
              onDelete={deleteAlbum}
            />
          ))}
        </ul>
      </main>
    </>
  );
}
