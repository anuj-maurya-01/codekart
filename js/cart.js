// ========================================
// CodeKart - Cart Module
// ========================================

// Get cart from storage
function getCart() {
  return CodeKart.getFromStorage('cart', []);
}

// Save cart to storage
function saveCart(cart) {
  CodeKart.saveToStorage('cart', cart);
  CodeKart.updateCartBadge();
}

// Add item to cart
function addToCart(productId, quantity = 1) {
  // This function is also defined in products.js, keeping here for cart-specific operations
  const product = getProductById(productId);
  if (!product) {
    CodeKart.showToast('Product not found', 'error');
    return false;
  }
  
  let cart = getCart();
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: quantity
    });
  }
  
  saveCart(cart);
  return true;
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  CodeKart.showToast('Item removed from cart', 'success');
}

// Update item quantity
function updateQuantity(productId, quantity) {
  if (quantity < 1) {
    removeFromCart(productId);
    return;
  }
  
  let cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
}

// Get cart total
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Clear cart
function clearCart() {
  saveCart([]);
  CodeKart.showToast('Cart cleared', 'success');
}

// Render cart items
function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  
  const cart = getCart();
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#128722;</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any projects to your cart yet.</p>
        <a href="products.html" class="btn btn-primary">Browse Projects</a>
      </div>
    `;
    return;
  }
  
  const headerHtml = `
    <div class="cart-header">
      <span>Product</span>
      <span>Price</span>
      <span>Quantity</span>
      <span>Total</span>
      <span></span>
    </div>
  `;
  
  const itemsHtml = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-product">
        <div class="cart-item-image">
          <img src="${item.thumbnail}" alt="${item.title}">
        </div>
        <div class="cart-item-info">
          <h4>${item.title}</h4>
          <p>${CodeKart.formatCurrency(item.price)} each</p>
        </div>
      </div>
      <div class="cart-item-price">${CodeKart.formatCurrency(item.price)}</div>
      <div class="cart-item-quantity">
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
        <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, parseInt(this.value))">
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
      </div>
      <div class="cart-item-total">${CodeKart.formatCurrency(item.price * item.quantity)}</div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove item">&times;</button>
    </div>
  `).join('');
  
  container.innerHTML = headerHtml + itemsHtml;
}

// Render cart summary
function renderCartSummary() {
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const itemCountEl = document.getElementById('cart-item-count');
  
  const subtotal = getCartTotal();
  const itemCount = getCartItemCount();
  
  if (subtotalEl) subtotalEl.textContent = CodeKart.formatCurrency(subtotal);
  if (totalEl) totalEl.textContent = CodeKart.formatCurrency(subtotal);
  if (itemCountEl) itemCountEl.textContent = `${itemCount} items`;
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

// Render checkout summary
function renderCheckoutSummary() {
  const subtotalEl = document.getElementById('checkout-subtotal');
  const totalEl = document.getElementById('checkout-total');
  
  const subtotal = getCartTotal();
  
  if (subtotalEl) subtotalEl.textContent = CodeKart.formatCurrency(subtotal);
  if (totalEl) totalEl.textContent = CodeKart.formatCurrency(subtotal);
}

// Initialize cart page
function initCartPage() {
  renderCartItems();
  renderCartSummary();
  
  // Apply coupon form
  const couponForm = document.getElementById('coupon-form');
  if (couponForm) {
    couponForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const couponInput = this.querySelector('input');
      const couponCode = couponInput.value.trim().toUpperCase();
      
      // Simulate coupon validation
      if (couponCode === 'SAVE10') {
        const subtotal = getCartTotal();
        const discount = subtotal * 0.1;
        const newTotal = subtotal - discount;
        
        document.getElementById('cart-subtotal').textContent = CodeKart.formatCurrency(subtotal);
        document.getElementById('cart-total').textContent = CodeKart.formatCurrency(newTotal);
        
        CodeKart.showToast('Coupon applied! 10% discount', 'success');
      } else if (couponCode === 'SAVE20') {
        const subtotal = getCartTotal();
        const discount = subtotal * 0.2;
        const newTotal = subtotal - discount;
        
        document.getElementById('cart-subtotal').textContent = CodeKart.formatCurrency(subtotal);
        document.getElementById('cart-total').textContent = CodeKart.formatCurrency(newTotal);
        
        CodeKart.showToast('Coupon applied! 20% discount', 'success');
      } else {
        CodeKart.showToast('Invalid coupon code', 'error');
      }
    });
  }
  
  // Proceed to checkout
  const checkoutBtn = document.getElementById('proceed-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      const cart = getCart();
      if (cart.length === 0) {
        CodeKart.showToast('Your cart is empty', 'warning');
        return;
      }
      
      if (!CodeKart.isLoggedIn()) {
        CodeKart.showToast('Please login to checkout', 'warning');
        setTimeout(() => {
          window.location.href = 'login.html?redirect=checkout.html';
        }, 1000);
        return;
      }
      
      window.location.href = 'checkout.html';
    });
  }
}

// Initialize checkout page
function initCheckoutPage() {
  const cart = getCart();
  
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  renderCheckoutItems();
  renderCheckoutSummary();
  
  // Pre-fill user info if logged in
  const user = CodeKart.getCurrentUser();
  if (user) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
  }
  
  // Checkout form submission
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const notes = document.getElementById('notes').value.trim();
      
      if (!name || !email) {
        CodeKart.showToast('Please fill in all required fields', 'error');
        return;
      }
      
      if (!CodeKart.validateEmail(email)) {
        CodeKart.showToast('Please enter a valid email address', 'error');
        return;
      }
      
      // Create order
      const orderId = CodeKart.generateOrderId();
      const order = {
        id: orderId,
        userId: user ? user.id : null,
        customer: { name, email, notes },
        items: cart,
        subtotal: getCartTotal(),
        total: getCartTotal(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        deliveryLink: null
      };
      
      // Save order
      const orders = CodeKart.getFromStorage('orders', []);
      orders.unshift(order);
      CodeKart.saveToStorage('orders', orders);
      
      // Clear cart
      clearCart();
      
      // Redirect to success page
      window.location.href = `success.html?order=${orderId}`;
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on cart page
  if (document.getElementById('cart-items')) {
    initCartPage();
  }
  
  // Check if we're on checkout page
  if (document.getElementById('checkout-form')) {
    initCheckoutPage();
  }
});
