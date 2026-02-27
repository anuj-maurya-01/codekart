// ========================================
// CodeKart - Admin Module
// ========================================

// Get all orders
function getAllOrders() {
  return CodeKart.getFromStorage('orders', []);
}

// Get all products
async function getAllProductsAdmin() {
  // First ensure products are loaded
  await loadProducts();
  return getAllProducts();
}

// Save products
function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

// Render admin stats
async function renderAdminStats() {
  const orders = getAllOrders();
  const products = await getAllProductsAdmin();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  
  const statsContainer = document.getElementById('admin-stats');
  if (!statsContainer) return;
  
  statsContainer.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-icon">&#128230;</div>
        <h3>${orders.length}</h3>
        <p>Total Orders</p>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon">&#128176;</div>
        <h3>${CodeKart.formatCurrency(totalRevenue)}</h3>
        <p>Total Revenue</p>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon">&#128230;</div>
        <h3>${products.length}</h3>
        <p>Total Products</p>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon">&#9203;</div>
        <h3>${pendingOrders}</h3>
        <p>Pending Orders</p>
      </div>
    </div>
  `;
}

// Render admin orders table
async function renderAdminOrders() {
  const orders = getAllOrders();
  const container = document.getElementById('admin-orders-body');
  if (!container) return;
  
  if (orders.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state" style="padding: 40px;">
            <div class="empty-state-icon">&#128230;</div>
            <h3>No orders yet</h3>
            <p>Orders will appear here when customers make purchases.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  container.innerHTML = orders.map(order => `
    <tr>
      <td><strong>${order.id}</strong></td>
      <td>${order.customer.name}<br><small>${order.customer.email}</small></td>
      <td>${order.items.length} item(s)<br><small>${CodeKart.formatCurrency(order.total)}</small></td>
      <td>${CodeKart.formatDate(order.createdAt)}</td>
      <td><span class="status-badge status-${order.status}">${order.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="table-action-btn edit" onclick="updateOrderStatus('${order.id}')">Update</button>
          <button class="table-action-btn view" onclick="addDeliveryLink('${order.id}')">Link</button>
          <button class="table-action-btn delete" onclick="deleteOrder('${order.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Render admin products table
async function renderAdminProducts() {
  const products = await getAllProductsAdmin();
  const container = document.getElementById('admin-products-body');
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state" style="padding: 40px;">
            <div class="empty-state-icon">&#128230;</div>
            <h3>No products yet</h3>
            <p>Add products to start selling.</p>
            <button class="btn btn-primary" onclick="showAddProductForm()">Add Product</button>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  container.innerHTML = products.map(product => `
    <tr>
      <td><img src="${product.thumbnail}" alt="${product.title}" style="width: 60px; height: 45px; object-fit: cover; border-radius: 5px;"></td>
      <td>${product.title}</td>
      <td>${product.techStack.slice(0, 2).join(', ')}</td>
      <td>${CodeKart.formatCurrency(product.price)}</td>
      <td><span class="status-badge status-${product.difficulty.toLowerCase()}">${product.difficulty}</span></td>
      <td>
        <div class="table-actions">
          <button class="table-action-btn edit" onclick="editProduct(${product.id})">Edit</button>
          <button class="table-action-btn delete" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Update order status
function updateOrderStatus(orderId) {
  const orders = getAllOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    CodeKart.showToast('Order not found', 'error');
    return;
  }
  
  const statuses = ['pending', 'processing', 'delivered', 'cancelled'];
  const currentIndex = statuses.indexOf(order.status);
  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
  
  order.status = nextStatus;
  CodeKart.saveToStorage('orders', orders);
  
  CodeKart.showToast(`Order status updated to ${nextStatus}`, 'success');
  renderAdminOrders();
  renderAdminStats();
}

// Add delivery link
function addDeliveryLink(orderId) {
  const orders = getAllOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    CodeKart.showToast('Order not found', 'error');
    return;
  }
  
  const link = prompt('Enter download link for this order:', order.deliveryLink || 'https://example.com/download/');
  
  if (link !== null) {
    order.deliveryLink = link;
    CodeKart.saveToStorage('orders', orders);
    CodeKart.showToast('Download link added', 'success');
  }
}

// Delete order
function deleteOrder(orderId) {
  if (!confirm('Are you sure you want to delete this order?')) return;
  
  let orders = getAllOrders();
  orders = orders.filter(o => o.id !== orderId);
  CodeKart.saveToStorage('orders', orders);
  
  CodeKart.showToast('Order deleted', 'success');
  renderAdminOrders();
  renderAdminStats();
}

// Delete product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  let products = await getAllProductsAdmin();
  products = products.filter(p => p.id !== productId);
  saveProducts(products);
  
  CodeKart.showToast('Product deleted', 'success');
  renderAdminProducts();
}

// Reset products to default
async function resetProducts() {
  if (!confirm('Are you sure you want to reset products to default? All custom products will be lost.')) return;
  
  const products = await resetProductsToDefault();
  if (products) {
    renderAdminProducts();
    renderAdminStats();
  }
}

// Edit product
async function editProduct(productId) {
  const products = await getAllProductsAdmin();
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    CodeKart.showToast('Product not found', 'error');
    return;
  }
  
  showProductForm(product);
}

// Show add/edit product form
function showProductForm(product = null) {
  const isEdit = product !== null;
  const modalHtml = `
    <div class="modal-overlay" id="product-form-modal">
      <div class="modal" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <h2>${isEdit ? 'Edit' : 'Add'} Product</h2>
          <button class="modal-close" onclick="CodeKart.closeModal('product-form-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <form id="product-form">
            <input type="hidden" id="product-id" value="${product ? product.id : ''}">
            
            <div class="form-group">
              <label for="product-title">Title *</label>
              <input type="text" id="product-title" required value="${product ? product.title : ''}">
            </div>
            
            <div class="form-group">
              <label for="product-description">Description *</label>
              <textarea id="product-description" required>${product ? product.description : ''}</textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="product-price">Price (₹) *</label>
                <input type="number" id="product-price" step="0.01" min="0" required value="${product ? product.price : ''}">
              </div>
              <div class="form-group">
                <label for="product-difficulty">Difficulty *</label>
                <select id="product-difficulty" required>
                  <option value="Beginner" ${product && product.difficulty === 'Beginner' ? 'selected' : ''}>Beginner</option>
                  <option value="Intermediate" ${product && product.difficulty === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                  <option value="Advanced" ${product && product.difficulty === 'Advanced' ? 'selected' : ''}>Advanced</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="product-image">Product Image</label>
              <input type="file" id="product-image" accept="image/*">
              <input type="hidden" id="product-thumbnail" value="${product ? product.thumbnail : ''}">
              <div id="image-preview" style="margin-top: 10px;">
                ${product ? `<img src="${product.thumbnail}" alt="Preview" style="max-width: 200px; border-radius: 8px;">` : ''}
              </div>
              <small style="color: var(--gray);">Or enter URL below:</small>
            </div>
            
            <div class="form-group">
              <label for="product-thumbnail-url">Thumbnail URL (alternative)</label>
              <input type="url" id="product-thumbnail-url" value="${product ? product.thumbnail : ''}" placeholder="https://example.com/image.jpg">
            </div>
            
            <div class="form-group">
              <label for="product-tech">Tech Stack (comma separated)</label>
              <input type="text" id="product-tech" value="${product ? product.techStack.join(', ') : ''}" placeholder="HTML, CSS, JavaScript">
            </div>
            
            <div class="form-group">
              <label for="product-delivery">Delivery Type</label>
              <select id="product-delivery">
                <option value="Instant Download" ${product && product.deliveryType === 'Instant Download' ? 'selected' : ''}>Instant Download</option>
                <option value="Email Delivery" ${product && product.deliveryType === 'Email Delivery' ? 'selected' : ''}>Email Delivery</option>
              </select>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
              <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Add'} Product</button>
              <button type="button" class="btn btn-secondary" onclick="CodeKart.closeModal('product-form-modal')">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  CodeKart.openModal('product-form-modal');
  
  // Image upload handling with compression
  const imageInput = document.getElementById('product-image');
  const thumbnailInput = document.getElementById('product-thumbnail');
  const thumbnailUrlInput = document.getElementById('product-thumbnail-url');
  const imagePreview = document.getElementById('image-preview');
  
  // Compress image function
  function compressImage(file, maxWidth = 1200, quality = 0.92) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  
  if (imageInput) {
    imageInput.addEventListener('change', async function(e) {
      const file = e.target.files[0];
      if (file) {
        // Check file size
        if (file.size > 2000000) {
          CodeKart.showToast('Image too large. Compressing...', 'warning');
        }
        
        // Compress and show preview
        const compressedImage = await compressImage(file);
        thumbnailInput.value = compressedImage;
        imagePreview.innerHTML = `<img src="${compressedImage}" alt="Preview" style="max-width: 200px; border-radius: 8px;">`;
      }
    });
  }
  
  // If URL is provided, use that instead
  if (thumbnailUrlInput) {
    thumbnailUrlInput.addEventListener('input', function(e) {
      if (e.target.value) {
        thumbnailInput.value = e.target.value;
        imagePreview.innerHTML = `<img src="${e.target.value}" alt="Preview" style="max-width: 200px; border-radius: 8px;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📦</text></svg>'">`;
      }
    });
  }
  
  // Form submission
  const form = document.getElementById('product-form');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('product-id').value;
    const title = document.getElementById('product-title').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const difficulty = document.getElementById('product-difficulty').value;
    let thumbnail = document.getElementById('product-thumbnail').value.trim();
    const techStackInput = document.getElementById('product-tech').value;
    const deliveryType = document.getElementById('product-delivery').value;
    
    // If no thumbnail from file, try URL input
    if (!thumbnail) {
      thumbnail = document.getElementById('product-thumbnail-url').value.trim();
    }
    
    // Use default placeholder if still no image
    if (!thumbnail) {
      thumbnail = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📦</text></svg>';
    }
    
    const techStack = techStackInput ? techStackInput.split(',').map(t => t.trim()) : ['HTML', 'CSS', 'JavaScript'];
    
    const products = await getAllProductsAdmin();
    
    if (id) {
      // Update existing product
      const index = products.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        products[index] = {
          ...products[index],
          title,
          description,
          price,
          difficulty,
          thumbnail,
          techStack,
          deliveryType
        };
      }
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        title,
        description,
        price,
        difficulty,
        thumbnail,
        techStack,
        deliveryType,
        gallery: [thumbnail],
        features: ['Responsive design', 'Clean code', 'Documentation included'],
        rating: 5.0,
        reviews: 0,
        sales: 0
      };
      products.push(newProduct);
    }
    
    saveProducts(products);
    CodeKart.showToast(`Product ${id ? 'updated' : 'added'} successfully!`, 'success');
    CodeKart.closeModal('product-form-modal');
    renderAdminProducts();
  });
}

// Show add product button
function showAddProductForm() {
  showProductForm();
}

// Payment Settings Functions
function getPaymentSettings() {
  return CodeKart.getFromStorage('paymentSettings', { qrCode: '', upiId: '' });
}

function savePaymentSettings() {
  const qrInput = document.getElementById('payment-qr-upload');
  const upiIdInput = document.getElementById('payment-upi-id');
  const settings = getPaymentSettings();
  
  if (qrInput && qrInput.files && qrInput.files[0]) {
    const file = qrInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      settings.qrCode = e.target.result;
      settings.upiId = upiIdInput ? upiIdInput.value.trim() : '';
      CodeKart.saveToStorage('paymentSettings', settings);
      CodeKart.showToast('Payment settings saved!', 'success');
      loadPaymentSettings();
    };
    reader.readAsDataURL(file);
  } else {
    settings.upiId = upiIdInput ? upiIdInput.value.trim() : '';
    CodeKart.saveToStorage('paymentSettings', settings);
    CodeKart.showToast('Payment settings saved!', 'success');
  }
}

function loadPaymentSettings() {
  const settings = getPaymentSettings();
  const qrImg = document.getElementById('qr-preview-img');
  const noQrMsg = document.getElementById('no-qr-msg');
  const upiIdInput = document.getElementById('payment-upi-id');
  
  if (qrImg && noQrMsg) {
    if (settings.qrCode) {
      qrImg.src = settings.qrCode;
      qrImg.style.display = 'block';
      noQrMsg.style.display = 'none';
    } else {
      qrImg.style.display = 'none';
      noQrMsg.style.display = 'block';
    }
  }
  
  if (upiIdInput && settings.upiId) {
    upiIdInput.value = settings.upiId;
  }
}

// Initialize admin page
async function initAdminPage() {
  if (!requireAdmin()) return;
  
  await renderAdminStats();
  await renderAdminOrders();
  await renderAdminProducts();
  
  // Logout button
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('admin-content')) {
    initAdminPage();
  }
});
