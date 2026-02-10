# CodeKart - E-commerce for Ready-Made Coding Projects

A complete, fully responsive Amazon-style e-commerce website for selling ready-made coding projects built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### Customer Features
- Browse and search coding projects
- Filter by category, difficulty, tech stack, and price
- Product details with galleries
- Shopping cart with quantity management
- Secure checkout with order confirmation
- User authentication (signup/login)
- Order history and tracking
- Email notifications

### Admin Features
- Dashboard with sales statistics
- Add, edit, and delete products
- Manage product inventory
- View and process orders
- Mark orders as delivered with download links
- Featured products management

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API requests
- **Context API** for state management
- **React Toastify** for notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Nodemailer** for email notifications
- **Bcryptjs** for password hashing

## 📁 Project Structure

```
codekart/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── orderController.js    # Order management
│   │   └── productController.js  # Product management
│   ├── middleware/
│   │   └── auth.js               # Auth & admin middleware
│   ├── models/
│   │   ├── Order.js              # Order schema
│   │   ├── Product.js            # Product schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── orders.js             # Order routes
│   │   └── products.js           # Product routes
│   ├── utils/
│   │   └── email.js              # Email utilities
│   ├── server.js                 # Entry point
│   ├── package.json
│   └── .env                      # Environment variables
│
└── frontend/
    ├── src/
    │   ├── admin/                # Admin pages
    │   │   ├── AdminDashboard.jsx
    │   │   ├── ManageOrders.jsx
    │   │   ├── ManageProducts.jsx
    │   │   ├── AddProduct.jsx
    │   │   └── EditProduct.jsx
    │   ├── components/           # Reusable components
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── AdminRoute.jsx
    │   ├── context/              # React Context
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── layouts/              # Page layouts
    │   │   ├── Layout.jsx
    │   │   └── AdminLayout.jsx
    │   ├── pages/                # Public pages
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetails.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── MyOrders.jsx
    │   ├── services/
    │   │   └── api.js            # Axios API service
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codekart
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@codekart.com

FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The server will start on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open on http://localhost:5173

## 🔧 Creating Admin User

To access the admin panel, you need to manually set a user's role to 'admin' in the database:

1. Register a new user through the frontend
2. In MongoDB, update the user document:
```javascript
db.users.updateOne(
  { email: "your_email@example.com" },
  { $set: { role: "admin" } }
)
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my` - Get user's orders
- `GET /api/orders/all` - Get all orders (admin)
- `PUT /api/orders/:id/deliver` - Mark order delivered (admin)

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: {
    500: '#5a6cf0', // Main brand color
    600: '#4350e1',
    700: '#3740c0',
  }
}
```

### Categories
Add or modify categories in the Product model:
```javascript
category: {
  type: String,
  enum: ['web-development', 'mobile-apps', 'data-science', 'machine-learning', ...]
}
```

## 📦 Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add API URL to environment variables

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
