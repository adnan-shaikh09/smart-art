const express = require('express');
const router = express.Router();
const { getAll, updateMany } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const { verifyConnection } = require('../utils/emailService');

router.get('/', getAll);
router.put('/', protect, updateMany);

// Test SMTP connection
router.post('/test-smtp', protect, async (req, res) => {
  try {
    const result = await verifyConnection();
    if (result.ok) {
      res.json({ success: true, message: 'SMTP connection successful!' });
    } else {
      res.status(400).json({ success: false, message: `SMTP failed: ${result.reason}` });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'SMTP test error: ' + err.message });
  }
});

module.exports = router;
