import { useState, useEffect } from 'react';
import { getJson, postJson, deleteJson } from '../apiClient';

export default function usePhotos(albumId, userId) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadPhotos() {
    setLoading(true);
    setError('');
    try {
      setPhotos(await getJson(`/albums/${albumId}/photos`));
    } catch {
      setError('Could not load photos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadAlbumPhotos() {
      setLoading(true);
      setError('');
      try {
        const data = await getJson(`/albums/${albumId}/photos`);
        if (active) setPhotos(data);
      } catch {
        if (active) setError('Could not load photos.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAlbumPhotos();
    return () => { active = false; };
  }, [albumId]);

  async function addPhoto({ title, url, thumbnailUrl }) {
    setError('');
    try {
      await postJson('/photos', { userId, albumId, title, url, thumbnailUrl });
      loadPhotos();
      return true;
    } catch (err) {
      setError(err.status === 403 ? 'You can only add photos to your own albums.' : 'Could not add the photo.');
      return false;
    }
  }

  async function deletePhoto(photo) {
    setError('');
    try {
      await deleteJson(`/photos/${photo.id}?userId=${userId}`);
      loadPhotos();
    } catch (err) {
      setError(err.status === 403 ? 'You can only delete your own photos.' : 'Could not delete the photo.');
    }
  }

  return { photos, loading, error, addPhoto, deletePhoto };
}
