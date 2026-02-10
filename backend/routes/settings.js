const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Settings = require('../models/Settings');
const { protect, isAdmin } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    res.json({ success: true, data: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get UPI QR code
// @route   GET /api/settings/upi-qr
// @access  Public
router.get('/upi-qr', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: 'upi_qr_code' });
    res.json({ success: true, data: setting ? setting.value : null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create or update setting
// @route   POST /api/settings
// @access  Admin
router.post('/', protect, isAdmin, upload.single('file'), async (req, res) => {
  try {
    const { key, value, type } = req.body;
    const fileValue = req.file ? req.file.path : value;
    
    let setting = await Settings.findOne({ key });
    
    if (setting) {
      setting.value = fileValue;
      setting.type = type || setting.type;
      await setting.save();
    } else {
      setting = await Settings.create({ key, value: fileValue, type: type || 'string' });
    }
    
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete setting
// @route   DELETE /api/settings/:key
// @access  Admin
router.delete('/:key', protect, isAdmin, async (req, res) => {
  try {
    await Settings.findOneAndDelete({ key: req.params.key });
    res.json({ success: true, message: 'Setting deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
