const express = require('express');
const router = express.Router();
const { getAll, update } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');
router.get('/', getAll);
router.put('/', protect, update);
module.exports = router;
