const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send order notification to admin
exports.sendOrderEmail = async (order, products) => {
  const productList = order.items.map(item => {
    const product = products.find(p => p._id.toString() === item.product.toString());
    return `
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">${item.title}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">₹${item.price}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">${item.quantity}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">₹${item.price * item.quantity}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a202c; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f7fafc; padding: 20px; border: 1px solid #e2e8f0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #4a5568; color: white; padding: 12px; }
        .total { font-size: 18px; font-weight: bold; text-align: right; padding: 10px 0; }
        .footer { background: #2d3748; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛒 New Order Received!</h1>
        </div>
        <div class="content">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${order.customerInfo.name}</p>
          <p><strong>Email:</strong> ${order.customerInfo.email}</p>
          ${order.customerInfo.phone ? `<p><strong>Phone:</strong> ${order.customerInfo.phone}</p>` : ''}
          
          <h3>Products Ordered</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${productList}
            </tbody>
          </table>
          
          <div class="total">
            <p><strong>Total Amount: ₹${order.totalAmount}</strong></p>
          </div>
          
          ${order.notes ? `
          <h3>Customer Notes</h3>
          <p>${order.notes}</p>
          ` : ''}
        </div>
        <div class="footer">
          <p>CodeKart - Premium Coding Projects</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `🎉 New Order #${order._id.toString().slice(-6)} - ₹${order.totalAmount}`,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order email sent to admin');
  } catch (error) {
    console.error('Error sending order email:', error);
  }
};

// Send order confirmation to customer
exports.sendOrderConfirmation = async (order) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a202c; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f7fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .success-icon { font-size: 48px; text-align: center; display: block; margin: 20px 0; }
        .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #2d3748; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
        </div>
        <div class="content">
          <span class="success-icon">🎉</span>
          <h2 style="text-align: center;">Thank you for your order!</h2>
          <p style="text-align: center;">Hi ${order.customerInfo.name},</p>
          <p style="text-align: center;">We've received your order and will process it shortly.</p>
          
          <div class="order-details">
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-6)}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <p style="text-align: center; color: #718096;">You'll receive another email with your download link once your order is processed.</p>
        </div>
        <div class="footer">
          <p>CodeKart - Premium Coding Projects</p>
          <p>Need help? Contact us at support@codekart.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.customerInfo.email,
    subject: `Order Confirmed - CodeKart #${order._id.toString().slice(-6)}`,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to customer');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

// Send payment confirmation email to customer
exports.sendPaymentReceipt = async (order) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a202c; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f7fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .success-icon { font-size: 48px; text-align: center; display: block; margin: 20px 0; }
        .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #2d3748; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 Payment Received!</h1>
        </div>
        <div class="content">
          <span class="success-icon">✅</span>
          <h2 style="text-align: center;">Payment Successful!</h2>
          <p style="text-align: center;">Hi ${order.customerInfo.name},</p>
          <p style="text-align: center;">We've received your payment. Thank you!</p>
          
          <div class="order-details">
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-6)}</p>
            <p><strong>Amount Paid:</strong> ₹${order.totalAmount}</p>
            <p><strong>Payment Status:</strong> Paid</p>
          </div>
          
          <p style="text-align: center; color: #718096;">Your order is now being processed. You'll receive your download link soon.</p>
        </div>
        <div class="footer">
          <p>CodeKart - Premium Coding Projects</p>
          <p>Need help? Contact us at support@codekart.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.customerInfo.email,
    subject: `Payment Received - CodeKart #${order._id.toString().slice(-6)}`,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Payment receipt email sent to customer');
  } catch (error) {
    console.error('Error sending payment receipt email:', error);
  }
};
