import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserDashboard from './pages/UserDashboard'
import MyOrders from './pages/MyOrders'
import OrderSuccess from './pages/OrderSuccess'
import NotFound from './pages/NotFound'
import AdminDashboard from './admin/AdminDashboard'
import ManageProducts from './admin/ManageProducts'
import ManageOrders from './admin/ManageOrders'
import ProductForm from './admin/ProductForm'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}> 
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="products/new" element={<ProductForm mode="create" />} />
            <Route path="products/:id" element={<ProductForm mode="edit" />} />
            <Route path="orders" element={<ManageOrders />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
