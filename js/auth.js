// ========================================
// CodeKart - Authentication Module
// ========================================

// Admin credentials (hardcoded)
const ADMIN_CREDENTIALS = {
  email: 'anujmaurya@codekartindia.com',
  password: 'Ashamaurya@2701135819'
};

// Get all users from storage
function getUsers() {
  return CodeKart.getFromStorage('users', []);
}

// Save users to storage
function saveUsers(users) {
  CodeKart.saveToStorage('users', users);
}

// Register new user
function register(name, email, password) {
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: 'Email already registered' };
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    name: name,
    email: email.toLowerCase(),
    password: password,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return { success: true, message: 'Registration successful' };
}

// Login user
function login(email, password) {
  // Check for admin login first
  if (email.toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const adminUser = {
      id: 0,
      name: 'Admin',
      email: ADMIN_CREDENTIALS.email,
      role: 'admin'
    };
    CodeKart.saveToSession('currentUser', adminUser);
    return { success: true, message: 'Admin login successful', user: adminUser };
  }
  
  // Check regular users
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }
  
  // Save session
  const sessionUser = { ...user };
  delete sessionUser.password;
  CodeKart.saveToSession('currentUser', sessionUser);
  
  return { success: true, message: 'Login successful', user: sessionUser };
}

// Logout user
function logout() {
  sessionStorage.removeItem('currentUser');
  CodeKart.showToast('Logged out successfully', 'success');
  
  // Redirect based on current page
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'dashboard.html' || currentPage === 'admin.html') {
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// Initialize signup page
function initSignupPage() {
  const form = document.getElementById('signup-form');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      CodeKart.showToast('Please fill in all fields', 'error');
      return;
    }
    
    if (name.length < 2) {
      CodeKart.showToast('Name must be at least 2 characters', 'error');
      return;
    }
    
    if (!CodeKart.validateEmail(email)) {
      CodeKart.showToast('Please enter a valid email address', 'error');
      return;
    }
    
    if (!CodeKart.validatePassword(password)) {
      CodeKart.showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      CodeKart.showToast('Passwords do not match', 'error');
      return;
    }
    
    // Register user
    const result = register(name, email, password);
    
    if (result.success) {
      CodeKart.showToast('Registration successful! Please login.', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      CodeKart.showToast(result.message, 'error');
    }
  });
}

// Initialize login page
function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;
  
  // Check if already logged in
  if (CodeKart.isLoggedIn()) {
    const redirect = CodeKart.getUrlParam('redirect') || 'dashboard.html';
    window.location.href = redirect;
    return;
  }
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validation
    if (!email || !password) {
      CodeKart.showToast('Please fill in all fields', 'error');
      return;
    }
    
    // Login user
    const result = login(email, password);
    
    if (result.success) {
      CodeKart.showToast('Login successful!', 'success');
      
      setTimeout(() => {
        const redirect = CodeKart.getUrlParam('redirect');
        
        if (result.user.role === 'admin') {
          window.location.href = 'admin.html';
        } else if (redirect) {
          window.location.href = redirect;
        } else {
          window.location.href = 'dashboard.html';
        }
      }, 1000);
    } else {
      CodeKart.showToast(result.message, 'error');
    }
  });
}

// Update UI based on login status
function updateAuthUI() {
  const loginLink = document.getElementById('login-link');
  const signupLink = document.getElementById('signup-link');
  const userMenu = document.getElementById('user-menu');
  const dashboardLink = document.getElementById('dashboard-link');
  const adminLink = document.getElementById('admin-link');
  const logoutLink = document.getElementById('logout-link');
  
  const user = CodeKart.getCurrentUser();
  
  if (user) {
    // Hide login/signup links
    if (loginLink) loginLink.style.display = 'none';
    if (signupLink) signupLink.style.display = 'none';
    
    // Show user menu
    if (userMenu) {
      userMenu.style.display = 'flex';
      const userName = userMenu.querySelector('.user-name');
      if (userName) userName.textContent = user.name || user.email.split('@')[0];
    }
    
    // Show dashboard link
    if (dashboardLink) dashboardLink.style.display = 'flex';
    
    // Show admin link for admin users
    if (adminLink && user.role === 'admin') {
      adminLink.style.display = 'flex';
    }
    
    // Setup logout
    if (logoutLink) {
      logoutLink.style.display = 'flex';
      logoutLink.onclick = logout;
    }
  } else {
    // Show login/signup links
    if (loginLink) loginLink.style.display = 'flex';
    if (signupLink) signupLink.style.display = 'flex';
    
    // Hide user menu
    if (userMenu) userMenu.style.display = 'none';
    if (dashboardLink) dashboardLink.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

// Check if page requires authentication
function requireAuth() {
  if (!CodeKart.isLoggedIn()) {
    CodeKart.showToast('Please login to access this page', 'warning');
    window.location.href = `login.html?redirect=${window.location.pathname}`;
    return false;
  }
  return true;
}

// Check if page requires admin
function requireAdmin() {
  if (!CodeKart.isLoggedIn()) {
    CodeKart.showToast('Please login to access this page', 'warning');
    window.location.href = `login.html?redirect=${window.location.pathname}`;
    return false;
  }
  
  if (!CodeKart.isAdmin()) {
    CodeKart.showToast('Access denied. Admin only.', 'error');
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  updateAuthUI();
  
  // Check if we're on auth pages
  if (document.getElementById('signup-form')) {
    initSignupPage();
  }
  
  if (document.getElementById('login-form')) {
    initLoginPage();
  }
});
