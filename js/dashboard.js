// ========================================
// CodeKart - Dashboard Module
// ========================================

// Get user orders
function getUserOrders(userId) {
  const orders = CodeKart.getFromStorage('orders', []);
  return orders.filter(order => order.userId === userId);
}

// Render user stats
function renderUserStats() {
  const user = CodeKart.getCurrentUser();
  if (!user) return;
  
  const orders = getUserOrders(user.id);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  
  const statsContainer = document.getElementById('user-stats');
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
        <h3>${CodeKart.formatCurrency(totalSpent)}</h3>
        <p>Total Spent</p>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon">&#9203;</div>
        <h3>${pendingOrders}</h3>
        <p>Pending Orders</p>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon">&#9989;</div>
        <h3>${deliveredOrders}</h3>
        <p>Delivered</p>
      </div>
    </div>
  `;
}

// Render user orders
function renderUserOrders() {
  const user = CodeKart.getCurrentUser();
  if (!user) return;
  
  const orders = getUserOrders(user.id);
  const container = document.getElementById('orders-table-body');
  if (!container) return;
  
  if (orders.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state" style="padding: 40px;">
            <div class="empty-state-icon">&#128230;</div>
            <h3>No orders yet</h3>
            <p>You haven't placed any orders yet.</p>
            <a href="products.html" class="btn btn-primary">Browse Projects</a>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  container.innerHTML = orders.map(order => `
    <tr>
      <td><strong>${order.id}</strong></td>
      <td>${CodeKart.formatDate(order.createdAt)}</td>
      <td>${order.items.length} item(s)</td>
      <td>${CodeKart.formatCurrency(order.total)}</td>
      <td><span class="status-badge status-${order.status}">${order.status}</span></td>
      <td>
        <button class="table-action-btn view" onclick="viewOrderDetails('${order.id}')">View</button>
        ${order.deliveryLink ? `<a href="${order.deliveryLink}" class="table-action-btn view" target="_blank">Download</a>` : ''}
      </td>
    </tr>
  `).join('');
}

// View order details
function viewOrderDetails(orderId) {
  const orders = CodeKart.getFromStorage('orders', []);
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    CodeKart.showToast('Order not found', 'error');
    return;
  }
  
  const modalHtml = `
    <div class="modal-overlay" id="order-details-modal">
      <div class="modal" style="max-width: 700px;">
        <div class="modal-header">
          <h2>Order Details - ${order.id}</h2>
          <button class="modal-close" onclick="CodeKart.closeModal('order-details-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px;">Order Information</h4>
            <p><strong>Date:</strong> ${CodeKart.formatDate(order.createdAt)}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
            <p><strong>Total:</strong> ${CodeKart.formatCurrency(order.total)}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px;">Customer Information</h4>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            ${order.customer.notes ? `<p><strong>Notes:</strong> ${order.customer.notes}</p>` : ''}
          </div>
          
          <div>
            <h4 style="margin-bottom: 10px;">Items</h4>
            ${order.items.map(item => `
              <div style="display: flex; align-items: center; gap: 15px; padding: 10px 0; border-bottom: 1px solid var(--gray-light);">
                <img src="${item.thumbnail}" alt="${item.title}" style="width: 60px; height: 45px; object-fit: cover; border-radius: 5px;">
                <div style="flex: 1;">
                  <p style="font-weight: 600;">${item.title}</p>
                  <p style="font-size: 14px; color: var(--gray);">${item.quantity} x ${CodeKart.formatCurrency(item.price)}</p>
                </div>
                <div style="font-weight: 600; color: var(--primary);">${CodeKart.formatCurrency(item.price * item.quantity)}</div>
              </div>
            `).join('')}
          </div>
          
          ${order.deliveryLink ? `
            <div style="margin-top: 20px; padding: 15px; background: var(--gray-light); border-radius: 8px;">
              <p style="margin-bottom: 10px;"><strong>Download Link:</strong></p>
              <a href="${order.deliveryLink}" class="btn btn-success" target="_blank">Download Project</a>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  CodeKart.openModal('order-details-modal');
}

// Initialize dashboard page
function initDashboardPage() {
  if (!requireAuth()) return;
  
  renderUserStats();
  renderUserOrders();
  
  // Update user info
  const user = CodeKart.getCurrentUser();
  const userNameEl = document.getElementById('user-name');
  const userEmailEl = document.getElementById('user-email');
  
  if (userNameEl && user) userNameEl.textContent = user.name || user.email.split('@')[0];
  if (userEmailEl && user) userEmailEl.textContent = user.email;
  
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('dashboard-content')) {
    initDashboardPage();
  }
});
