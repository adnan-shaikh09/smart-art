// testimonialsController.js
const { query, queryOne } = require('../config/database');

const getAll = async (req, res) => {
  try {
    const items = await query('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC');
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const items = await query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
};

const create = async (req, res) => {
  try {
    const { client_name, client_business, client_location, rating, message } = req.body;
    if (!client_name || !message) return res.status(400).json({ success: false, message: 'Name and message required' });
    const result = await query(
      'INSERT INTO testimonials (client_name, client_business, client_location, rating, message) VALUES (?, ?, ?, ?, ?)',
      [client_name, client_business || '', client_location || '', parseInt(rating) || 5, message]
    );
    res.status(201).json({ success: true, message: 'Testimonial added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add testimonial' });
  }
};

const update = async (req, res) => {
  try {
    const { client_name, client_business, client_location, rating, message, is_active } = req.body;
    const existing = await queryOne('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    await query(
      'UPDATE testimonials SET client_name=?, client_business=?, client_location=?, rating=?, message=?, is_active=? WHERE id=?',
      [client_name || existing.client_name, client_business ?? existing.client_business, client_location ?? existing.client_location, parseInt(rating) || existing.rating, message || existing.message, is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active, req.params.id]
    );
    res.json({ success: true, message: 'Testimonial updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update testimonial' });
  }
};

const remove = async (req, res) => {
  try {
    await query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete testimonial' });
  }
};

module.exports = { getAll, getAllAdmin, create, update, remove };
