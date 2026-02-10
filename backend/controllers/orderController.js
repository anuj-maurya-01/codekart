const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderEmail, sendOrderConfirmation, sendPaymentReceipt } = require('../utils/email');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { customerInfo, items, totalAmount, notes } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    // Verify products and prices
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }
      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity || 1
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user ? req.user._id : null,
      customerInfo,
      items: orderItems,
      totalAmount,
      notes
    });

    // Get all products for email
    const products = await Product.find({
      _id: { $in: orderItems.map(item => item.product) }
    });

    // Send emails
    await sendOrderEmail(order, products);
    await sendOrderConfirmation(order);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns order or is admin
    if (order.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = 'delivered';
    order.deliveryLink = req.body.deliveryLink || '';
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get order stats
// @route   GET /api/orders/stats
// @access  Private/Admin
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    const revenue = await Order.aggregate([
      { $match: { status: { $in: ['pending', 'processing', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        totalRevenue: revenue[0]?.total || 0,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload payment screenshot
// @route   POST /api/orders/:id/payment
// @access  Private
exports.uploadPaymentScreenshot = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a payment screenshot'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns order
    if (order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    order.paymentScreenshot = req.file.path;
    order.paymentStatus = 'paid';
    await order.save();

    // Send payment confirmation email
    await sendPaymentReceipt(order);

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create Stripe checkout session
// @route   POST /api/orders/create-checkout-session
// @access  Public
exports.createStripeCheckoutSession = async (req, res) => {
  try {
    const { items, customerInfo, totalAmount } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    // Verify products and prices
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }
      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity || 1
      });
    }

    // Create order first with pending payment
    const order = await Order.create({
      user: req.user ? req.user._id : null,
      customerInfo,
      items: orderItems,
      totalAmount,
      notes: req.body.notes || '',
      paymentStatus: 'pending'
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderItems.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.title,
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects paise for INR
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?canceled=true&order_id=${order._id}`,
      metadata: {
        orderId: order._id.toString()
      },
      customer_email: customerInfo.email
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
      orderId: order._id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Confirm Stripe payment
// @route   POST /api/orders/confirm-payment
// @access  Public
exports.confirmPayment = async (req, res) => {
  try {
    const { sessionId, orderId } = req.body;

    // Verify the payment with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentStatus = 'paid';
    order.status = 'processing';
    order.stripeSessionId = sessionId;
    await order.save();

    // Get all products for email
    const products = await Product.find({
      _id: { $in: order.items.map(item => item.product) }
    });

    // Send emails
    await sendOrderEmail(order, products);
    await sendOrderConfirmation(order);

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
