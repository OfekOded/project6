import { useState, useEffect } from 'react';
import { getJson, postJson, putJson, deleteJson } from '../apiClient';

export default function useAlbums(userId) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');

  async function loadAlbums() {
    if (!userId) return;
    setLoading(true);
    setLoadError('');
    try {
      setAlbums(await getJson(`/albums?userId=${userId}`));
    } catch {
      setLoadError('Could not load albums. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadUserAlbums() {
      if (!userId) return;
      setLoading(true);
      setLoadError('');
      try {
        const data = await getJson(`/albums?userId=${userId}`);
        if (active) setAlbums(data);
      } catch {
        if (active) setLoadError('Could not load albums. Is the server running?');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUserAlbums();
    return () => { active = false; };
  }, [userId]);

  async function addAlbum(title) {
    if (!userId) return false;
    setActionError('');
    try {
      await postJson('/albums', { userId, title });
      loadAlbums();
      return true;
    } catch {
      setActionError('Could not create the album.');
      return false;
    }
  }

  async function renameAlbum(album, title) {
    if (!userId) return false;
    setActionError('');
    try {
      await putJson(`/albums/${album.id}`, { userId, title });
      loadAlbums();
      return true;
    } catch (err) {
      setActionError(err.status === 403 ? 'You can only edit your own albums.' : 'Could not save changes.');
      return false;
    }
  }

  async function deleteAlbum(album) {
    if (!userId) return false;
    setActionError('');
    try {
      await deleteJson(`/albums/${album.id}?userId=${userId}`);
      loadAlbums();
      return true;
    } catch (err) {
      setActionError(err.status === 403 ? 'You can only delete your own albums.' : 'Could not delete the album.');
      return false;
    }
  }

  return { albums, loading, loadError, actionError, addAlbum, renameAlbum, deleteAlbum };
}
