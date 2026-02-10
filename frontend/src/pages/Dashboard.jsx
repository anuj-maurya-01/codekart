import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  const stats = [
    { label: 'Total Orders', value: '0', icon: '📦' },
    { label: 'Downloads', value: '0', icon: '⬇️' },
    { label: 'Favorite Projects', value: '0', icon: '❤️' },
    { label: 'Total Spent', value: '₹0', icon: '💰' }
  ]

  const quickLinks = [
    { title: 'Browse Projects', description: 'Discover new coding projects', icon: '🔍', link: '/products' },
    { title: 'My Orders', description: 'View your order history', icon: '📋', link: '/my-orders' },
    { title: 'Account Settings', description: 'Manage your profile', icon: '⚙️', link: '#' },
    { title: 'Need Help?', description: 'Get support', icon: '💬', link: '#' }
  ]

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-primary-100">Manage your orders and explore new projects</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.link}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{link.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                <p className="text-gray-600 text-sm">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-600 mb-4">Your recent orders and downloads will appear here</p>
            <Link to="/products" className="btn-primary">
              Browse Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
