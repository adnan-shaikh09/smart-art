const express = require('express');
const router  = express.Router();
const {
  submit, getAll, getOne, updateStatus, getStats, remove
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.post('/',              submit);          // Public: submit enquiry
router.get('/stats',  protect, getStats);       // Admin: counts by status
router.get('/',       protect, getAll);         // Admin: list all
router.get('/:id',    protect, getOne);         // Admin: single (marks as read)
router.patch('/:id/status', protect, updateStatus); // Admin: update status
router.delete('/:id', protect, remove);         // Admin: delete

module.exports = router;
