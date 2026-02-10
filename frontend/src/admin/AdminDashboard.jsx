import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderAPI } from '../services/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await orderAPI.getStats()
        setStats(response.data.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: 'bg-blue-500' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: '⏳', color: 'bg-yellow-500' },
    { label: 'Delivered', value: stats?.deliveredOrders || 0, icon: '✅', color: 'bg-green-500' },
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: '💰', color: 'bg-purple-500' }
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                stats?.recentOrders?.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">#{order._id.toString().slice(-6)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-gray-900">{order.customerInfo?.name}</p>
                        <p className="text-sm text-gray-500">{order.customerInfo?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/products/add" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">➕</div>
          <h3 className="font-semibold text-gray-900">Add Product</h3>
        </Link>
        <Link to="/admin/products" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="font-semibold text-gray-900">Manage Products</h3>
        </Link>
        <Link to="/admin/orders" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">🛒</div>
          <h3 className="font-semibold text-gray-900">View Orders</h3>
        </Link>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center cursor-pointer">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold text-gray-900">Analytics</h3>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
