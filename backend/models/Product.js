const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a product title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'web-development',
      'mobile-apps',
      'data-science',
      'machine-learning',
      'desktop-apps',
      'games',
      'apis',
      'blockchain',
      'other'
    ]
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  techStack: [{
    type: String,
    required: true
  }],
  features: [{
    type: String
  }],
  thumbnail: {
    type: String,
    required: [true, 'Please provide a thumbnail image URL']
  },
  images: [{
    type: String
  }],
  deliveryType: {
    type: String,
    enum: ['instant', 'custom'],
    default: 'instant'
  },
  deliveryTime: {
    type: String,
    default: 'Instant download'
  },
  fileSize: {
    type: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search
productSchema.index({ title: 'text', description: 'text', techStack: 'text' });

module.exports = mongoose.model('Product', productSchema);
