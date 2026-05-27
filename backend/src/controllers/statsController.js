// statsController.js
const { query } = require('../config/database');

const getAll = async (req, res) => {
  try {
    const stats = await query('SELECT * FROM stats ORDER BY sort_order ASC');
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

const update = async (req, res) => {
  try {
    const { id, value, label, suffix } = req.body;
    await query('UPDATE stats SET value=?, label=?, suffix=? WHERE id=?', [value, label, suffix, id]);
    res.json({ success: true, message: 'Stat updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update stat' });
  }
};

module.exports = { getAll, update };
