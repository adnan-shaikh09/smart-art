const { query } = require('../config/database');

const getAll = async (req, res) => {
  try {
    const settings = await query('SELECT setting_key, setting_value, setting_type FROM site_settings');
    const obj = {};
    settings.forEach(s => { obj[s.setting_key] = s.setting_value; });
    res.json({ success: true, data: obj });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};

const updateMany = async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    res.json({ success: true, message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

module.exports = { getAll, updateMany };
