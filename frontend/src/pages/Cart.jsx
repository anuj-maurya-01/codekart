import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any projects yet</p>
          <Link to="/products" className="btn-primary">
            Browse Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={item._id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Link to={`/products/${item._id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                    {item.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{item.category?.replace('-', ' ')}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.techStack?.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-gray-900 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-primary-600">₹{item.price * item.quantity}</p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-gray-500">₹{item.price} each</p>
                    )}
                  </div>
                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">₹{getCartTotal()}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">₹{getCartTotal()}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/checkout" className="btn-primary flex-1 text-center">
                Proceed to Checkout
              </Link>
              <button onClick={clearCart} className="btn-outline text-red-600 border-red-300 hover:bg-red-50">
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-6 text-center">
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
