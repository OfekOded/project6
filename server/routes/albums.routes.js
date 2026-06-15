const express = require('express');
const albumsQueries = require('../db/albums.queries');
const photosQueries = require('../db/photos.queries');
const { parseId } = require('../utils/validate');
const router = express.Router();

// GET /albums?userId=&q=&_sort=&_order=&_limit=&_page=
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.userId !== undefined && req.query.userId !== '') {
      const userId = parseId(req.query.userId);
      if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });
      filters.userId = userId;
    }
    if (req.query.q) filters.q = String(req.query.q);

    const albums = await albumsQueries.getAlbums(filters, req.query);
    res.json(albums);
  } catch (err) {
    console.error('GET /albums', err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /albums/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const album = await albumsQueries.getAlbumById(id);
    if (!album) return res.status(404).json({ error: 'album not found' });
    res.json(album);
  } catch (err) {
    console.error('GET /albums/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /albums/:id/photos  
router.get('/:id/photos', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const album = await albumsQueries.getAlbumById(id);
    if (!album) return res.status(404).json({ error: 'album not found' });

    const photos = await photosQueries.getPhotos({ albumId: id }, req.query);
    res.json(photos);
  } catch (err) {
    console.error('GET /albums/:id/photos', err);
    res.status(500).json({ error: 'server error' });
  }
});

// POST /albums   body: { userId, title }
router.post('/', async (req, res) => {
  try {
    const userId = parseId(req.body.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });
    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    const album = await albumsQueries.createAlbum({ userId, title: req.body.title.trim() });
    res.status(201).json(album);
  } catch (err) {
    console.error('POST /albums', err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /albums/:id   body: { userId, title }  -- ONLY if the album belongs to userId
router.put('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });
    const userId = parseId(req.body.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });

    const album = await albumsQueries.getAlbumById(id);
    if (!album) return res.status(404).json({ error: 'album not found' });
    if (album.user_id !== userId) return res.status(403).json({ error: 'not your album' });
    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }

    const updated = await albumsQueries.updateAlbum(id, { title: req.body.title.trim() });
    res.json(updated);
  } catch (err) {
    console.error('PUT /albums/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

// DELETE /albums/:id?userId=...  -- ONLY if the album belongs to userId
router.delete('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });
    const userId = parseId(req.query.userId);
    if (userId === null) return res.status(400).json({ error: 'userId must be a positive integer' });

    const album = await albumsQueries.getAlbumById(id);
    if (!album) return res.status(404).json({ error: 'album not found' });
    if (album.user_id !== userId) return res.status(403).json({ error: 'not your album' });

    await albumsQueries.deleteAlbum(id);
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /albums/:id', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
