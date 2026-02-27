// ========================================
// CodeKart - Main JavaScript Utilities
// ========================================

// Toast Notifications
function showToast(message, type = 'success') {
  const toastContainer = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '&#10004;',
    error: '&#10006;',
    warning: '&#9888;',
    info: '&#8505;'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Local Storage Helpers
function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${key}`, error);
    return false;
  }
}

// Session Storage Helpers
function getFromSession(key, defaultValue = null) {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from sessionStorage: ${key}`, error);
    return defaultValue;
  }
}

function saveToSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to sessionStorage: ${key}`, error);
    return false;
  }
}

// Format Currency
function formatCurrency(amount) {
  return '₹' + parseFloat(amount).toFixed(2);
}

// Generate Order ID
function generateOrderId() {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Format Date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Get URL Parameters
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Debounce Function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Validate Email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate Password
function validatePassword(password) {
  return password.length >= 6;
}

// Show Loading Spinner
function showLoader(element) {
  if (element) {
    element.innerHTML = '<div class="loader"></div>';
  }
}

// Hide Loading Spinner
function hideLoader(element, content = '') {
  if (element) {
    element.innerHTML = content;
  }
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on outside click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Escape key closes modal
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

// Update Cart Badge
function updateCartBadge() {
  const cart = getFromStorage('cart', []);
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Mobile Menu Functions
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const closeBtn = document.querySelector('.mobile-close-btn');
  
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', function() {
      navMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (navMenu.classList.contains('active') && 
          !navMenu.contains(e.target) && 
          !menuBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

// Check if user is logged in
function isLoggedIn() {
  return getFromSession('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
  return getFromSession('currentUser');
}

// Check if user is admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// Logout user
function logout() {
  sessionStorage.removeItem('currentUser');
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  initMobileMenu();
  
  // Add active class to current nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

// Export functions for use in other files
window.CodeKart = {
  showToast,
  getFromStorage,
  saveToStorage,
  getFromSession,
  saveToSession,
  formatCurrency,
  generateOrderId,
  formatDate,
  getUrlParam,
  debounce,
  validateEmail,
  validatePassword,
  showLoader,
  hideLoader,
  openModal,
  closeModal,
  updateCartBadge,
  isLoggedIn,
  getCurrentUser,
  isAdmin,
  logout
};
