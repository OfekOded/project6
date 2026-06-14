const pool = require('./connection');
const { parseListOptions } = require('../utils/validate');

const PHOTO_COLUMNS = 'id, album_id, title, url, thumbnail_url';
const PHOTO_SORT = ['id', 'title', 'album_id'];

// List with optional filters ({ albumId, q }) and list options (_sort/_order/_limit/_page).
async function getPhotos(filters = {}, options = {}) {
  let sql = `SELECT ${PHOTO_COLUMNS} FROM photos`;
  const params = [];
  const conditions = [];

  if (filters.albumId) { conditions.push('album_id = ?'); params.push(filters.albumId); }
  if (filters.q) { conditions.push('title LIKE ?'); params.push(`%${filters.q}%`); }
  if (conditions.length) sql += ` WHERE ${conditions.join(' AND ')}`;

  const { orderClause, limitClause } = parseListOptions(options, { allowedSort: PHOTO_SORT });
  sql += orderClause + limitClause;

  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Includes the owning user's id (via the album) so the route can enforce ownership.
async function getPhotoById(id) {
  const [rows] = await pool.execute(
    `SELECT p.id, p.album_id, p.title, p.url, p.thumbnail_url, a.user_id
     FROM photos p
     JOIN albums a ON a.id = p.album_id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
}

async function createPhoto({ albumId, title, url, thumbnailUrl }) {
  const [result] = await pool.execute(
    'INSERT INTO photos (album_id, title, url, thumbnail_url) VALUES (?, ?, ?, ?)',
    [albumId, title, url, thumbnailUrl]
  );
  return getPhotoById(result.insertId);
}

async function updatePhoto(id, { title, url, thumbnailUrl }) {
  const fields = [];
  const params = [];
  if (title !== undefined) { fields.push('title = ?'); params.push(title); }
  if (url !== undefined) { fields.push('url = ?'); params.push(url); }
  if (thumbnailUrl !== undefined) { fields.push('thumbnail_url = ?'); params.push(thumbnailUrl); }
  if (fields.length === 0) return getPhotoById(id);

  params.push(id);
  await pool.execute(`UPDATE photos SET ${fields.join(', ')} WHERE id = ?`, params);
  return getPhotoById(id);
}

async function deletePhoto(id) {
  const [result] = await pool.execute('DELETE FROM photos WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { getPhotos, getPhotoById, createPhoto, updatePhoto, deletePhoto };
