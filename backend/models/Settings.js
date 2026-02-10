const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'json', 'image'],
    default: 'string'
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
