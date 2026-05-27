const { query, queryOne } = require('../config/database');
const fs   = require('fs');
const path = require('path');

const UPLOADS_BASE = path.join(__dirname, '../../uploads');

// Detect media type from mimetype
const getMediaType = (mimetype = '') => {
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('image/')) return 'image';
  return 'video'; // default to video
};

// Build public URL from filename
const buildUrl = (subDir, filename) => `/uploads/${subDir}/${filename}`;

const getAll = async (req, res) => {
  try {
    const { category, featured } = req.query;
    let sql = `SELECT id, title, description, category, media_type,
                      is_featured, is_active, sort_order, created_at, image_url
               FROM gallery WHERE is_active = 1`;
    const params = [];
    if (category && category !== 'all') { sql += ' AND category = ?'; params.push(category); }
    if (featured === 'true') { sql += ' AND is_featured = 1'; }
    sql += ' ORDER BY sort_order ASC, created_at DESC';
    const items = await query(sql, params);
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('Gallery getAll error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const items = await query(
      `SELECT id, title, description, category, media_type,
              is_featured, is_active, sort_order, created_at, image_url
       FROM gallery ORDER BY sort_order ASC, created_at DESC`
    );
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, description, category, is_featured, sort_order } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Video/image file is required' });
    }

    const media_type = getMediaType(req.file.mimetype);
    const file_url   = buildUrl('gallery', req.file.filename);

    const result = await query(
      `INSERT INTO gallery
         (title, description, image_url, category, media_type, is_featured, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        title.trim(),
        description || '',
        file_url,
        category || 'general',
        media_type,
        is_featured ? 1 : 0,
        parseInt(sort_order) || 0,
      ]
    );

    console.log(`✅ Gallery item added: ${title} [${media_type}] → ${file_url}`);
    res.status(201).json({ success: true, message: 'Added successfully', id: result.insertId });
  } catch (err) {
    console.error('Gallery create error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { title, description, category, is_featured, is_active, sort_order } = req.body;
    const existing = await queryOne('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Item not found' });

    let image_url  = existing.image_url;
    let media_type = existing.media_type || 'video';

    if (req.file) {
      // Delete old file if it exists
      if (existing.image_url && existing.image_url.startsWith('/uploads/')) {
        const oldPath = path.join(UPLOADS_BASE, existing.image_url.replace('/uploads/', ''));
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.warn('Could not delete old file:', e.message); }
        }
      }
      image_url  = buildUrl('gallery', req.file.filename);
      media_type = getMediaType(req.file.mimetype);
    }

    await query(
      `UPDATE gallery
       SET title=?, description=?, image_url=?, category=?,
           media_type=?, is_featured=?, is_active=?, sort_order=?
       WHERE id=?`,
      [
        title       || existing.title,
        description !== undefined ? description : existing.description,
        image_url,
        category    || existing.category,
        media_type,
        is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
        is_active   !== undefined ? (is_active   ? 1 : 0) : existing.is_active,
        sort_order  !== undefined ? parseInt(sort_order) : existing.sort_order,
        req.params.id,
      ]
    );
    res.json({ success: true, message: 'Updated successfully' });
  } catch (err) {
    console.error('Gallery update error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const item = await queryOne('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    // Delete file from disk
    if (item.image_url && item.image_url.startsWith('/uploads/')) {
      const filePath = path.join(UPLOADS_BASE, item.image_url.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { console.warn('File delete warning:', e.message); }
      }
    }

    await query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const cats = await query('SELECT DISTINCT category FROM gallery WHERE is_active = 1');
    res.json({ success: true, data: cats.map(c => c.category) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getAllAdmin, create, update, remove, getCategories };
