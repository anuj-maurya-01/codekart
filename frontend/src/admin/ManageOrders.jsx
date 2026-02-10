import { useState, useEffect } from 'react'
import { orderAPI } from '../services/api'
import { toast } from 'react-toastify'

const ManageOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [deliveryLink, setDeliveryLink] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentImage, setPaymentImage] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const response = await orderAPI.getAllOrders(params)
      setOrders(response.data.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleDeliver = async () => {
    try {
      await orderAPI.deliverOrder(selectedOrder._id, { deliveryLink })
      toast.success('Order marked as delivered')
      setShowModal(false)
      setDeliveryLink('')
      setSelectedOrder(null)
      fetchOrders()
    } catch (error) {
      toast.error('Failed to update order')
    }
  }

  const openDeliverModal = (order) => {
    setSelectedOrder(order)
    setDeliveryLink(order.deliveryLink || '')
    setShowModal(true)
  }

  const viewPaymentScreenshot = (order) => {
    if (order.paymentScreenshot) {
      setPaymentImage(order.paymentScreenshot)
      setShowPaymentModal(true)
    } else {
      toast.error('No payment screenshot for this order')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'processing': return 'bg-blue-100 text-blue-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPaymentStatusColor = (status) => {
    return status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-auto"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List - Mobile Friendly Card Layout */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-gray-900">#{order._id.toString().slice(-6)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-4">
                <p className="text-gray-900 font-medium">{order.customerInfo?.name}</p>
                <p className="text-sm text-gray-500">{order.customerInfo?.email}</p>
                {order.customerInfo?.phone && (
                  <p className="text-sm text-gray-500">{order.customerInfo.phone}</p>
                )}
              </div>

              {/* Items */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-sm text-gray-600">{order.items?.length} item(s) - ₹{order.totalAmount}</p>
              </div>

              {/* Payment Status */}
              <div className="mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Payment Pending'}
                </span>
                {order.paymentScreenshot && (
                  <button
                    onClick={() => viewPaymentScreenshot(order)}
                    className="ml-2 text-blue-600 hover:text-blue-700 text-xs font-medium"
                  >
                    View Payment
                  </button>
                )}
              </div>

              {/* Actions */}
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <button
                  onClick={() => openDeliverModal(order)}
                  className="w-full sm:w-auto bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Deliver Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mark Order as Delivered</h2>
            <p className="text-gray-600 mb-4">
              Order #{selectedOrder?._id.toString().slice(-6)}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Download Link</label>
              <input
                type="url"
                value={deliveryLink}
                onChange={(e) => setDeliveryLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="input-field"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDeliver}
                className="btn-primary flex-1"
              >
                Confirm Delivery
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Screenshot Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Screenshot</h2>
            <p className="text-gray-600 mb-4">
              Order #{selectedOrder?._id.toString().slice(-6)}
            </p>
            <img
              src={`http://localhost:5000/${paymentImage}`}
              alt="Payment Screenshot"
              className="w-full rounded-lg shadow-md"
            />
            <button
              onClick={() => setShowPaymentModal(false)}
              className="btn-outline mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageOrders
