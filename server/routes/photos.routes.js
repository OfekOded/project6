const express = require('express');
const photosQueries = require('../db/photos.queries');
const albumsQueries = require('../db/albums.queries');
const { parseId } = require('../utils/validate');
const router = express.Router();

// GET /photos?albumId=&q=&_sort=&_order=&_limit=&_page=
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.albumId !== undefined && req.query.albumId !== '') {
      const albumId = parseId(req.query.albumId);
      if (albumId === null) return res.status(400).json({ error: 'albumId must be a positive integer' });
      filters.albumId = albumId;
    }
    if (req.query.q) filters.q = String(req.query.q);

    const photos = await photosQueries.getPhotos(filters, req.query);
    res.json(photos);
  } catch (err) {
    console.error('GET /photos', err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /photos/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const photo = await photosQueries.getPhotoById(id);
    if (!photo) return res.status(404).json({ error: 'photo not found' });
    res.json(photo);
  } catch (err) {
    console.error('GET /photos/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

// POST /photos   body: { userId, albumId, title, url, thumbnailUrl }
// Only the owner of the album may add photos to it.
router.post('/', async (req, res) => {
  try {
    const userId = parseId(req.body.userId);
    const albumId = parseId(req.body.albumId);
    if (userId === null || albumId === null) {
      return res.status(400).json({ error: 'userId and albumId must be positive integers' });
    }
    const { title, url, thumbnailUrl } = req.body;
    if (!title || !title.trim() || !url || !url.trim()) {
      return res.status(400).json({ error: 'title and url are required' });
    }

    const album = await albumsQueries.getAlbumById(albumId);
    if (!album) return res.status(404).json({ error: 'album not found' });
    if (album.user_id !== userId) return res.status(403).json({ error: 'not your album' });

    const photo = await photosQueries.createPhoto({
      albumId,
      title: title.trim(),
      url: url.trim(),
      thumbnailUrl: (thumbnailUrl && thumbnailUrl.trim()) || url.trim(),
    });
    res.status(201).json(photo);
  } catch (err) {
    console.error('POST /photos', err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /photos/:id   body: { userId, title?, url?, thumbnailUrl? }  -- owner of the album only
router.put('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });
    const userId = parseId(req.body.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });

    const photo = await photosQueries.getPhotoById(id);
    if (!photo) return res.status(404).json({ error: 'photo not found' });
    if (photo.user_id !== userId) return res.status(403).json({ error: 'not your photo' });

    const updated = await photosQueries.updatePhoto(id, {
      title: req.body.title,
      url: req.body.url,
      thumbnailUrl: req.body.thumbnailUrl,
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /photos/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

// DELETE /photos/:id?userId=...  -- owner of the album only
router.delete('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });
    const userId = parseId(req.query.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });

    const photo = await photosQueries.getPhotoById(id);
    if (!photo) return res.status(404).json({ error: 'photo not found' });
    if (photo.user_id !== userId) return res.status(403).json({ error: 'not your photo' });

    await photosQueries.deletePhoto(id);
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /photos/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
