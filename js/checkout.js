// ========================================
// CodeKart - Checkout Module
// ========================================

// Get cart from storage
function getCart() {
  return CodeKart.getFromStorage('cart', []);
}

// Render checkout items
function renderCheckoutItems() {
  const container = document.getElementById('checkout-items');
  if (!container) return;
  
  const cart = getCart();
  
  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--gray);">No items in cart</p>';
    return;
  }
  
  container.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <div class="checkout-item-image">
        <img src="${item.thumbnail}" alt="${item.title}">
      </div>
      <div class="checkout-item-info">
        <h4>${item.title}</h4>
        <p>${item.quantity} x ${CodeKart.formatCurrency(item.price)}</p>
      </div>
      <div class="cart-item-total">${CodeKart.formatCurrency(item.price * item.quantity)}</div>
    </div>
  `).join('');
}

// Initialize checkout page
function initCheckoutPage() {
  // Load cart and display items
  const cart = CodeKart.getFromStorage('cart', []);
  
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  // Render checkout items
  renderCheckoutItems();
  
  // Update checkout totals
  updateCheckoutTotals();
  
  // Load payment QR code if available
  loadPaymentQRCode();
  
  // Listen for cart updates from other tabs/pages
  window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
      const updatedCart = JSON.parse(e.newValue || '[]');
      if (updatedCart.length === 0) {
        window.location.href = 'cart.html';
      } else {
        renderCheckoutItems();
        updateCheckoutTotals();
      }
    }
  });
  
  // Re-check cart when page becomes visible (handles back/forward navigation)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      const currentCart = CodeKart.getFromStorage('cart', []);
      if (currentCart.length === 0) {
        window.location.href = 'cart.html';
      } else {
        renderCheckoutItems();
        updateCheckoutTotals();
      }
    }
  });
}

// Load payment QR code
function loadPaymentQRCode() {
  const paymentSettings = CodeKart.getFromStorage('paymentSettings', { qrCode: '', upiId: '' });
  const qrSection = document.getElementById('qr-payment-section');
  const qrDisplay = document.getElementById('qr-code-display');
  const qrAmount = document.getElementById('qr-amount');
  
  if (qrSection && qrDisplay) {
    if (paymentSettings.qrCode) {
      qrSection.style.display = 'block';
      qrDisplay.innerHTML = `<img src="${paymentSettings.qrCode}" alt="Payment QR Code" style="max-width: 200px; border-radius: 8px;">`;
      
      // Update amount
      const cart = CodeKart.getFromStorage('cart', []);
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      if (qrAmount) {
        qrAmount.textContent = CodeKart.formatCurrency(subtotal);
      }
    } else {
      qrSection.style.display = 'none';
    }
  }
}

// Update checkout totals
function updateCheckoutTotals() {
  const cart = CodeKart.getFromStorage('cart', []);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const checkoutSubtotal = document.getElementById('checkout-subtotal');
  const checkoutTotal = document.getElementById('checkout-total');
  const checkoutTotalDisplay = document.getElementById('checkout-total-display');
  
  if (checkoutSubtotal) checkoutSubtotal.textContent = CodeKart.formatCurrency(subtotal);
  if (checkoutTotal) checkoutTotal.textContent = CodeKart.formatCurrency(subtotal);
  if (checkoutTotalDisplay) checkoutTotalDisplay.textContent = CodeKart.formatCurrency(subtotal);
}

// Get order by ID
function getOrderById(orderId) {
  const orders = CodeKart.getFromStorage('orders', []);
  return orders.find(o => o.id === orderId);
}

// Render success page
function renderSuccessPage() {
  const orderId = CodeKart.getUrlParam('order');
  if (!orderId) {
    window.location.href = 'index.html';
    return;
  }
  
  const order = getOrderById(orderId);
  if (!order) {
    CodeKart.showToast('Order not found', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    return;
  }
  
  // Update order ID display
  const orderIdEl = document.getElementById('order-id');
  if (orderIdEl) {
    orderIdEl.textContent = orderId;
  }
  
  // Update order details
  const orderDetailsEl = document.getElementById('success-order-details');
  if (orderDetailsEl) {
    orderDetailsEl.innerHTML = `
      <p><strong>Items:</strong> ${order.items.length}</p>
      <p><strong>Total:</strong> ${CodeKart.formatCurrency(order.total)}</p>
      <p><strong>Email:</strong> ${order.customer.email}</p>
    `;
  }
}

// Initialize success page
function initSuccessPage() {
  renderSuccessPage();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('success-content')) {
    initSuccessPage();
  }
  
  if (document.getElementById('checkout-form')) {
    initCheckoutPage();
  }
});
