const { query, queryOne } = require('../config/database');

const getAll = async (req, res) => {
  try {
    const services = await query(
      'SELECT id, title, short_desc, description, icon, image_url, features, is_active, sort_order FROM services WHERE is_active = 1 ORDER BY sort_order ASC'
    );
    const parsed = services.map(s => {
      let features = [];
      try { features = s.features ? JSON.parse(s.features) : []; } catch(e) { features = []; }
      return { ...s, features };
    });
    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error('Services getAll error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch services: ' + err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const service = await queryOne('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (!service) return res.status(404).json({ success: false, message: 'Not found' });
    try { service.features = service.features ? JSON.parse(service.features) : []; } catch { service.features = []; }
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, description, short_desc, icon, features, is_active, sort_order } = req.body;
    if (!title || !description) return res.status(400).json({ success: false, message: 'Title and description required' });
    let featuresJson = '[]';
    try { featuresJson = JSON.stringify(typeof features === 'string' ? JSON.parse(features) : (features || [])); } catch { featuresJson = '[]'; }
    let image_url = null;
    if (req.file) image_url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await query(
      'INSERT INTO services (title, description, short_desc, icon, image_url, features, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, short_desc || '', icon || 'shop', image_url, featuresJson, is_active !== undefined ? is_active : 1, sort_order || 0]
    );
    res.status(201).json({ success: true, message: 'Created', id: result.insertId });
  } catch (err) {
    console.error('Service create error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { title, description, short_desc, icon, features, is_active, sort_order } = req.body;
    const existing = await queryOne('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
    let featuresJson = existing.features || '[]';
    try { featuresJson = JSON.stringify(typeof features === 'string' ? JSON.parse(features) : (features || [])); } catch {}
    let image_url = existing.image_url;
    if (req.file) image_url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    await query(
      'UPDATE services SET title=?, description=?, short_desc=?, icon=?, image_url=?, features=?, is_active=?, sort_order=? WHERE id=?',
      [title || existing.title, description || existing.description, short_desc ?? existing.short_desc, icon ?? existing.icon, image_url, featuresJson, is_active !== undefined ? is_active : existing.is_active, sort_order ?? existing.sort_order, req.params.id]
    );
    res.json({ success: true, message: 'Updated' });
  } catch (err) {
    console.error('Service update error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await query('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
