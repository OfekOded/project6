const pool = require('./connection');
const { parseListOptions } = require('../utils/validate');

const ALBUM_COLUMNS = 'id, user_id, title';
const ALBUM_SORT = ['id', 'title', 'user_id'];

// List with optional filters ({ userId, q }) and list options (_sort/_order/_limit/_page).
async function getAlbums(filters = {}, options = {}) {
  let sql = `SELECT ${ALBUM_COLUMNS} FROM albums`;
  const params = [];
  const conditions = [];

  if (filters.userId) { conditions.push('user_id = ?'); params.push(filters.userId); }
  if (filters.q) { conditions.push('title LIKE ?'); params.push(`%${filters.q}%`); }
  if (conditions.length) sql += ` WHERE ${conditions.join(' AND ')}`;

  const { orderClause, limitClause } = parseListOptions(options, { allowedSort: ALBUM_SORT });
  sql += orderClause + limitClause;

  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getAlbumById(id) {
  const [rows] = await pool.execute(`SELECT ${ALBUM_COLUMNS} FROM albums WHERE id = ?`, [id]);
  return rows[0];
}

async function createAlbum({ userId, title }) {
  const [result] = await pool.execute(
    'INSERT INTO albums (user_id, title) VALUES (?, ?)',
    [userId, title]
  );
  return getAlbumById(result.insertId);
}

async function updateAlbum(id, { title }) {
  await pool.execute('UPDATE albums SET title = ? WHERE id = ?', [title, id]);
  return getAlbumById(id);
}

async function deleteAlbum(id) {
  const [result] = await pool.execute('DELETE FROM albums WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum };
