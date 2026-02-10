const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  deliverOrder,
  updateOrderStatus,
  getOrderStats,
  uploadPaymentScreenshot,
  createStripeCheckoutSession,
  confirmPayment
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Configure multer for payment screenshot uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/payments/';
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

// Public route - create order
router.post('/', createOrder);

// Stripe checkout session
router.post('/create-checkout-session', createStripeCheckoutSession);

// Confirm payment
router.post('/confirm-payment', confirmPayment);

// Upload payment screenshot
router.post('/:id/payment', protect, upload.single('screenshot'), uploadPaymentScreenshot);

// Protected user routes
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrder);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.get('/admin/stats', protect, authorize('admin'), getOrderStats);
router.put('/:id/deliver', protect, authorize('admin'), deliverOrder);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
