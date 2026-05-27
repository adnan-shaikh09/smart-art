const { query, queryOne } = require('../config/database');
const { sendEnquiryNotification, sendAutoReply } = require('../utils/emailService');

// POST /api/contact  — public form submission
const submit = async (req, res) => {
  try {
    const { name, email, phone, business_name, service_type, message } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Name is required' });
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message is required' });
    if (!phone && !email) return res.status(400).json({ success: false, message: 'Please provide phone or email' });

    const result = await query(
      'INSERT INTO contacts (name, email, phone, business_name, service_type, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), email?.trim() || null, phone?.trim() || null, business_name?.trim() || null, service_type || null, message.trim(), 'new']
    );

    // Fire-and-forget email notifications
    let adminEmail = process.env.ADMIN_NOTIFY_EMAIL || null;
    try {
      const setting = await queryOne("SELECT setting_value FROM site_settings WHERE setting_key = 'admin_notify_email'", []);
      if (setting?.setting_value) adminEmail = setting.setting_value;
    } catch (_) {}

    const contactData = { name, email, phone, business_name, service_type, message };
    sendEnquiryNotification(contactData, adminEmail).catch(() => {});
    if (email) sendAutoReply(contactData).catch(() => {});

    res.status(201).json({
      success: true,
      message: "Thank you! We'll contact you shortly.",
      id: result.insertId
    });
  } catch (err) {
    console.error('Contact submit error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to submit: ' + err.message });
  }
};

// GET /api/contact  — admin: list with filters
const getAll = async (req, res) => {
  try {
    const { status, page = 1, limit = 50, search } = req.query;
    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.max(1, parseInt(limit) || 50);
    const offset   = (pageNum - 1) * limitNum;

    let whereClauses = [];
    let params       = [];

    if (status && status !== 'all') {
      whereClauses.push('status = ?');
      params.push(status);
    }
    if (search && search.trim()) {
      whereClauses.push('(name LIKE ? OR phone LIKE ? OR email LIKE ? OR business_name LIKE ?)');
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    const whereStr = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

    // Fetch contact list
    const contacts = await query(
      `SELECT id, name, email, phone, business_name, service_type, message, status, created_at, updated_at
       FROM contacts ${whereStr}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    // Total count
    const countRows = await query(
      `SELECT COUNT(*) AS total FROM contacts ${whereStr}`,
      params
    );
    const total = Number(countRows[0]?.total) || 0;

    // Unread count
    const unreadRows = await query(
      "SELECT COUNT(*) AS unread FROM contacts WHERE status = 'new'",
      []
    );
    const unread = Number(unreadRows[0]?.unread) || 0;

    res.json({
      success: true,
      data: contacts,
      total,
      unread,
      page: pageNum,
      limit: limitNum
    });
  } catch (err) {
    console.error('Contacts getAll error:', err.message, err.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries: ' + err.message });
  }
};

// GET /api/contact/:id  — admin: single enquiry (auto marks as read)
const getOne = async (req, res) => {
  try {
    const id      = parseInt(req.params.id);
    const contact = await queryOne('SELECT * FROM contacts WHERE id = ?', [id]);
    if (!contact) return res.status(404).json({ success: false, message: 'Enquiry not found' });

    if (contact.status === 'new') {
      await query("UPDATE contacts SET status = 'read' WHERE id = ?", [id]);
      contact.status = 'read';
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    console.error('Contacts getOne error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiry' });
  }
};

// GET /api/contact/stats  — admin: counts by status
const getStats = async (req, res) => {
  try {
    const rows = await query(
      "SELECT status, COUNT(*) AS count FROM contacts GROUP BY status",
      []
    );
    const stats = { new: 0, read: 0, replied: 0, closed: 0, total: 0 };
    rows.forEach(r => {
      const count    = Number(r.count) || 0;
      stats[r.status] = count;
      stats.total    += count;
    });
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('Contacts getStats error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

// PATCH /api/contact/:id/status  — admin
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed    = ['new', 'read', 'replied', 'closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const id      = parseInt(req.params.id);
    const existing = await queryOne('SELECT id FROM contacts WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Enquiry not found' });

    await query('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    console.error('Contacts updateStatus error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

// DELETE /api/contact/:id  — admin
const remove = async (req, res) => {
  try {
    await query('DELETE FROM contacts WHERE id = ?', [parseInt(req.params.id)]);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err) {
    console.error('Contacts remove error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
};

module.exports = { submit, getAll, getOne, updateStatus, getStats, remove };
