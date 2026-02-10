const Settings = require('../models/Settings');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
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
};

// @desc    Get single setting
// @route   GET /api/settings/:key
// @access  Public
exports.getSetting = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update setting
// @route   POST /api/settings
// @access  Admin
exports.upsertSetting = async (req, res) => {
  try {
    const { key, value, type } = req.body;
    
    // If file was uploaded, use the file path
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
};

// @desc    Delete setting
// @route   DELETE /api/settings/:key
// @access  Admin
exports.deleteSetting = async (req, res) => {
  try {
    await Settings.findOneAndDelete({ key: req.params.key });
    res.json({ success: true, message: 'Setting deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get UPI QR code
// @route   GET /api/settings/upi-qr
// @access  Public
exports.getUpiQr = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: 'upi_qr_code' });
    res.json({ success: true, data: setting ? setting.value : null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
