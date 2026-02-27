// ========================================
// CodeKart - Products Module
// ========================================

// Load products from JSON file
async function loadProducts() {
  try {
    // First check localStorage for any existing products
    const storedProducts = localStorage.getItem('products');
    
    if (storedProducts) {
      // Use products from localStorage (includes custom/admin-added products)
      return JSON.parse(storedProducts);
    }
    
    // If no localStorage products, load from JSON
    let jsonProducts = [];
    try {
      const response = await fetch('data/products.json');
      jsonProducts = await response.json();
      
      // Store in localStorage for future use
      localStorage.setItem('products', JSON.stringify(jsonProducts));
      
      return jsonProducts;
    } catch (jsonError) {
      console.log('Could not load JSON, no products available');
      return [];
    }
  } catch (error) {
    console.error('Error loading products:', error);
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
  }
}

// Reset products to default (from JSON)
async function resetProductsToDefault() {
  try {
    const response = await fetch('data/products.json');
    const products = await response.json();
    
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('productsLoaded', 'true');
    
    CodeKart.showToast('Products reset to default', 'success');
    return products;
  } catch (error) {
    console.error('Error resetting products:', error);
    CodeKart.showToast('Error resetting products', 'error');
    return null;
  }
}

// Check if products are custom (admin-added)
function hasCustomProducts() {
  const products = getAllProducts();
  return products.length > 0 && products[0]?.id > 1000000;
}

// Add a new product
function addProduct(productData) {
  const products = getAllProducts();
  
  const newProduct = {
    id: Date.now(), // Use timestamp for unique ID
    title: productData.title,
    description: productData.description,
    price: parseFloat(productData.price),
    difficulty: productData.difficulty || 'Intermediate',
    thumbnail: productData.thumbnail || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📦</text></svg>',
    techStack: productData.techStack || ['HTML', 'CSS', 'JavaScript'],
    deliveryType: productData.deliveryType || 'Instant Download',
    gallery: productData.gallery || [productData.thumbnail],
    features: productData.features || ['Responsive design', 'Clean code', 'Documentation included'],
    rating: 5.0,
    reviews: 0,
    sales: 0
  };
  
  products.push(newProduct);
  localStorage.setItem('products', JSON.stringify(products));
  
  return newProduct;
}

// Update an existing product
function updateProduct(productId, productData) {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === parseInt(productId));
  
  if (index === -1) {
    return null;
  }
  
  products[index] = {
    ...products[index],
    title: productData.title,
    description: productData.description,
    price: parseFloat(productData.price),
    difficulty: productData.difficulty,
    thumbnail: productData.thumbnail,
    techStack: productData.techStack,
    deliveryType: productData.deliveryType,
    gallery: productData.gallery || [productData.thumbnail]
  };
  
  localStorage.setItem('products', JSON.stringify(products));
  
  return products[index];
}

// Delete a product
function deleteProduct(productId) {
  const products = getAllProducts();
  const filteredProducts = products.filter(p => p.id !== parseInt(productId));
  
  localStorage.setItem('products', JSON.stringify(filteredProducts));
  
  return filteredProducts;
}

// Get all products
function getAllProducts() {
  return JSON.parse(localStorage.getItem('products')) || [];
}

// Get product by ID
function getProductById(id) {
  const products = getAllProducts();
  return products.find(p => p.id === parseInt(id));
}

// Get featured products
function getFeaturedProducts(limit = 6) {
  const products = getAllProducts();
  
  // First try to get products with high sales
  let featured = products.filter(p => p.sales > 100);
  
  // If not enough featured products, add other products sorted by rating
  if (featured.length < limit) {
    const remainingProducts = products
      .filter(p => !featured.includes(p))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    featured = [...featured, ...remainingProducts];
  }
  
  return featured.slice(0, limit);
}

// Search products
function searchProducts(query) {
  const products = getAllProducts();
  const searchTerm = query.toLowerCase();
  
  return products.filter(product => 
    product.title.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.techStack.some(tech => tech.toLowerCase().includes(searchTerm))
  );
}

// Filter products by tech stack
function filterByTechStack(products, tech) {
  if (!tech || tech === 'all') return products;
  return products.filter(product => 
    product.techStack.some(t => t.toLowerCase() === tech.toLowerCase())
  );
}

// Filter products by difficulty
function filterByDifficulty(products, difficulty) {
  if (!difficulty || difficulty === 'all') return products;
  return products.filter(product => 
    product.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
}

// Sort products
function sortProducts(products, sortBy) {
  const sorted = [...products];
  
  switch(sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'popular':
      return sorted.sort((a, b) => b.sales - a.sales);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

// Get unique tech stacks
function getUniqueTechStacks() {
  const products = getAllProducts();
  const techStacks = new Set();
  products.forEach(product => {
    product.techStack.forEach(tech => techStacks.add(tech));
  });
  return Array.from(techStacks).sort();
}

// Get unique difficulties
function getUniqueDifficulties() {
  const products = getAllProducts();
  const difficulties = new Set();
  products.forEach(product => difficulties.add(product.difficulty));
  return Array.from(difficulties);
}

// Render product card
function renderProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <span class="product-badge">${product.difficulty}</span>
      <div class="product-image">
        <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
        <div class="product-actions">
          <button class="product-action-btn" onclick="quickView(${product.id})" title="Quick View">&#128065;</button>
          <button class="product-action-btn" onclick="addToCart(${product.id})" title="Add to Cart">&#128722;</button>
        </div>
      </div>
      <div class="product-content">
        <div class="product-tech">
          ${product.techStack.slice(0, 3).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-meta">
          <span class="product-price">${CodeKart.formatCurrency(product.price)}</span>
          <span class="product-rating">
            &#9733; ${product.rating} <span>(${product.reviews})</span>
          </span>
        </div>
        <div class="product-footer">
          <a href="product.html?id=${product.id}" class="btn btn-outline btn-sm">View Details</a>
          <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

// Render products grid
function renderProductsGrid(products, containerId = 'products-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">&#128269;</div>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = products.map(renderProductCard).join('');
}

// Render featured products on home page
async function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  
  await loadProducts();
  const featured = getFeaturedProducts(8);
  renderProductsGrid(featured, 'featured-products');
}

// Render categories
function renderCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;
  
  const categories = [
    { name: 'E-Commerce', icon: '&#128722;', count: 3 },
    { name: 'Portfolio', icon: '&#128100;', count: 2 },
    { name: 'Dashboard', icon: '&#128202;', count: 4 },
    { name: 'Social', icon: '&#128101;', count: 2 },
    { name: 'Productivity', icon: '&#128203;', count: 3 },
    { name: 'Entertainment', icon: '&#127926;', count: 2 }
  ];
  
  container.innerHTML = categories.map(cat => `
    <div class="category-card" onclick="filterByCategory('${cat.name}')">
      <div class="category-icon">${cat.icon}</div>
      <h3>${cat.name}</h3>
      <p>${cat.count} Projects</p>
    </div>
  `).join('');
}

// Filter by category (simulated)
function filterByCategory(category) {
  window.location.href = `products.html?category=${encodeURIComponent(category)}`;
}

// Quick view function
function quickView(productId) {
  const product = getProductById(productId);
  if (!product) return;
  
  // Show quick view modal
  const modalHtml = `
    <div class="modal-overlay" id="quick-view-modal">
      <div class="modal" style="max-width: 800px;">
        <div class="modal-header">
          <h2>${product.title}</h2>
          <button class="modal-close" onclick="CodeKart.closeModal('quick-view-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="product-detail-grid">
            <div>
              <img src="${product.thumbnail}" alt="${product.title}" style="width: 100%; border-radius: 8px;">
            </div>
            <div>
              <div class="product-tech" style="margin-bottom: 15px;">
                ${product.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
              </div>
              <p style="margin-bottom: 15px; color: var(--gray);">${product.description.substring(0, 150)}...</p>
              <div class="product-price-large" style="font-size: 28px; margin-bottom: 20px;">${CodeKart.formatCurrency(product.price)}</div>
              <button class="btn btn-primary btn-lg" onclick="CodeKart.closeModal('quick-view-modal'); addToCart(${product.id});" style="width: 100%;">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  CodeKart.openModal('quick-view-modal');
}

// Add to cart (global function)
function addToCart(productId, quantity = 1) {
  const product = getProductById(productId);
  if (!product) {
    CodeKart.showToast('Product not found', 'error');
    return;
  }
  
  let cart = CodeKart.getFromStorage('cart', []);
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
  
  CodeKart.saveToStorage('cart', cart);
  CodeKart.updateCartBadge();
  CodeKart.showToast(`${product.title} added to cart!`, 'success');
}

// Initialize products page
async function initProductsPage() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;
  
  await loadProducts();
  
  // Get filter parameters
  const searchQuery = CodeKart.getUrlParam('search') || '';
  const techFilter = CodeKart.getUrlParam('tech') || 'all';
  const difficultyFilter = CodeKart.getUrlParam('difficulty') || 'all';
  const sortBy = CodeKart.getUrlParam('sort') || 'popular';
  
  // Set filter values in UI
  const searchInput = document.getElementById('search-input');
  const techSelect = document.getElementById('tech-filter');
  const difficultySelect = document.getElementById('difficulty-filter');
  const sortSelect = document.getElementById('sort-filter');
  
  if (searchInput) searchInput.value = searchQuery;
  if (techSelect) techSelect.value = techFilter;
  if (difficultySelect) difficultySelect.value = difficultyFilter;
  if (sortSelect) sortSelect.value = sortBy;
  
  // Apply filters
  let products = getAllProducts();
  
  if (searchQuery) {
    products = searchProducts(searchQuery);
  }
  
  products = filterByTechStack(products, techFilter);
  products = filterByDifficulty(products, difficultyFilter);
  products = sortProducts(products, sortBy);
  
  // Update results count
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) {
    resultsCount.textContent = `${products.length} products found`;
  }
  
  renderProductsGrid(products);
}

// Initialize filters
function initFilters() {
  const techSelect = document.getElementById('tech-filter');
  const difficultySelect = document.getElementById('difficulty-filter');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-filter');
  
  if (techSelect) {
    const techStacks = getUniqueTechStacks();
    techSelect.innerHTML = '<option value="all">All Technologies</option>' +
      techStacks.map(tech => `<option value="${tech}">${tech}</option>`).join('');
  }
  
  if (difficultySelect) {
    const difficulties = getUniqueDifficulties();
    difficultySelect.innerHTML = '<option value="all">All Levels</option>' +
      difficulties.map(diff => `<option value="${diff}">${diff}</option>`).join('');
  }
  
  // Add event listeners
  const applyFilters = debounce(() => {
    const params = new URLSearchParams();
    
    if (searchInput && searchInput.value) {
      params.set('search', searchInput.value);
    }
    if (techSelect && techSelect.value !== 'all') {
      params.set('tech', techSelect.value);
    }
    if (difficultySelect && difficultySelect.value !== 'all') {
      params.set('difficulty', difficultySelect.value);
    }
    if (sortSelect && sortSelect.value !== 'popular') {
      params.set('sort', sortSelect.value);
    }
    
    const newUrl = params.toString() ? `products.html?${params.toString()}` : 'products.html';
    window.location.href = newUrl;
  }, 500);
  
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  
  if (techSelect) {
    techSelect.addEventListener('change', applyFilters);
  }
  
  if (difficultySelect) {
    difficultySelect.addEventListener('change', applyFilters);
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }
}

// Search functionality
function initSearch() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('header-search');
  
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
      }
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initSearch();
  initFilters();
  renderCategories();
});
