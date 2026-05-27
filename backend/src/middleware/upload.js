const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const UPLOADS_BASE = path.join(__dirname, '../../uploads');

// Ensure base uploads dir exists
if (!fs.existsSync(UPLOADS_BASE)) {
  fs.mkdirSync(UPLOADS_BASE, { recursive: true });
}

// Disk storage — store actual files (required for video)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = req.uploadSubDir || 'general';
    const dir = path.join(UPLOADS_BASE, subDir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase() || '.mp4';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

// No file filter — accept ALL formats
// No file size limit — accept ANY size
const upload = multer({
  storage,
  // fileFilter: not set — accept everything
  // limits: not set — no restrictions at all
});

module.exports = { upload };
