import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderAPI, settingsAPI } from '../services/api'
import { toast } from 'react-toastify'

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [upiQrCode, setUpiQrCode] = useState(null)
  const [paymentScreenshot, setPaymentScreenshot] = useState(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    notes: ''
  })

  // Fetch UPI QR code on mount
  useEffect(() => {
    const fetchUpiQr = async () => {
      try {
        const response = await settingsAPI.getUpiQr()
        if (response.data.data) {
          setUpiQrCode(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching UPI QR:', error)
      }
    }
    fetchUpiQr()
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setPaymentScreenshot(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Require payment screenshot
    if (!paymentScreenshot) {
      toast.error('Please upload your UPI payment screenshot before placing the order')
      return
    }
    
    setLoading(true)

    try {
      const orderData = {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        items: cart.map(item => ({
          product: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: getCartTotal(),
        notes: formData.notes
      }

      const response = await orderAPI.create(orderData)
      
      // Upload payment screenshot
      const formDataUpload = new FormData()
      formDataUpload.append('screenshot', paymentScreenshot)
      await orderAPI.uploadPayment(response.data.data._id, formDataUpload)
      
      setCurrentOrder({ ...response.data.data, paymentScreenshot: true })
      setOrderPlaced(true)
      toast.success('Order placed successfully! Payment received.')
      clearCart()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
      setLoading(false)
    }
  }

  const handleViewOrders = () => {
    navigate('/my-orders')
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <Link to="/products" className="btn-primary">Browse Projects</Link>
        </div>
      </div>
    )
  }

  // Show order placed confirmation page
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-4">Order ID: #{currentOrder?._id?.toString()?.slice(-6)}</p>
            
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <svg className="w-6 h-6 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 font-medium">Payment received! ✓</p>
            </div>

            <div className="space-y-3">
              <button onClick={handleViewOrders} className="btn-primary w-full">
                View My Orders
              </button>
              <Link to="/products" className="block text-gray-600 hover:text-gray-900">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="input-field"
                    placeholder="Any special requirements or notes about your order..."
                  ></textarea>
                </div>
              </div>

              {/* UPI Payment Section */}
              {upiQrCode ? (
                <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    UPI Payment
                  </h3>
                  
                  <div className="flex gap-6 mb-4">
                    <img 
                      src={`http://localhost:5000/${upiQrCode}`} 
                      alt="UPI QR Code" 
                      className="w-48 h-48 rounded-lg shadow-md"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2"><strong>Total to Pay:</strong> ₹{getCartTotal()}</p>
                      <p className="text-xs text-gray-500">1. Scan the QR code with any UPI app</p>
                      <p className="text-xs text-gray-500">2. Complete the payment</p>
                      <p className="text-xs text-gray-500">3. Take a screenshot of confirmation</p>
                      <p className="text-xs text-gray-500">4. Upload the screenshot below</p>
                    </div>
                  </div>

                  <label className="block mb-2">
                    <span className="text-sm font-medium text-gray-700">Upload Payment Screenshot</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {paymentScreenshot && (
                    <div className="mt-3 flex items-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Selected: {paymentScreenshot.name}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    UPI payment is not currently available. Please contact support.
                  </p>
                </div>
              )}

              {!isAuthenticated && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Creating an account allows you to track your orders and access them later.
                  </p>
                  <Link to="/login" className="text-sm text-yellow-700 hover:text-yellow-900 font-medium mt-2 inline-block">
                    Already have an account? Login
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !paymentScreenshot || !upiQrCode}
                className="btn-primary w-full mt-6 py-4 text-lg disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Place Order - ₹${getCartTotal()}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="divide-y divide-gray-200 mb-4">
                {cart.map((item) => (
                  <div key={item._id} className="py-4 flex gap-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{getCartTotal()}</span>
                </div>
              </div>

              {upiQrCode && (
                <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Pay via UPI
                  </h3>
                  <img 
                    src={`http://localhost:5000/${upiQrCode}`} 
                    alt="UPI QR Code" 
                    className="w-48 h-48 mx-auto rounded-lg"
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">Scan with any UPI app</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Order confirmation email sent to your inbox
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Download links delivered within 24 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    30-day money-back guarantee
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
