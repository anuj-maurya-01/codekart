import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productAPI.getFeatured()
        setFeaturedProducts(response.data.data)
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const categories = [
    { name: 'Web Development', slug: 'web-development', icon: '🌐', count: 50 },
    { name: 'Mobile Apps', slug: 'mobile-apps', icon: '📱', count: 30 },
    { name: 'Data Science', slug: 'data-science', icon: '📊', count: 25 },
    { name: 'Machine Learning', slug: 'machine-learning', icon: '🤖', count: 20 },
    { name: 'Desktop Apps', slug: 'desktop-apps', icon: '💻', count: 15 },
    { name: 'Games', slug: 'games', icon: '🎮', count: 35 }
  ]

  const steps = [
    {
      step: '1',
      title: 'Browse Projects',
      description: 'Explore our collection of ready-made coding projects'
    },
    {
      step: '2',
      title: 'Add to Cart',
      description: 'Select the projects you need and add them to your cart'
    },
    {
      step: '3',
      title: 'Checkout',
      description: 'Complete your purchase securely'
    },
    {
      step: '4',
      title: 'Download',
      description: 'Get instant access to your project files'
    }
  ]

  const features = [
    {
      icon: '⚡',
      title: 'Instant Download',
      description: 'Get immediate access to your purchased projects'
    },
    {
      icon: '📚',
      title: 'Well Documented',
      description: 'Every project comes with detailed documentation'
    },
    {
      icon: '🎓',
      title: 'Learning Resource',
      description: 'Perfect for learning and portfolio building'
    },
    {
      icon: '🔧',
      title: 'Easy to Customize',
      description: 'Clean, modular code that is easy to modify'
    },
    {
      icon: '💬',
      title: 'Support Included',
      description: 'Get help if you run into any issues'
    },
    {
      icon: '✅',
      title: 'Quality Assured',
      description: 'All projects are tested and verified'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-200 via-dark-100 to-primary-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg3D%22%20fill%none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium mb-6">
                Premium Coding Projects
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Buy Ready-Made
                <span className="text-gradient block">Coding Projects</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Save weeks of development time with our professionally built, 
                production-ready coding projects. Perfect for students, developers, and entrepreneurs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/products" className="btn-primary text-lg px-8 py-4">
                  Browse Projects
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link to="/products?featured=true" className="btn-outline border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4">
                  Featured Projects
                </Link>
              </div>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-gray-400 text-sm">Projects</div>
                </div>
                <div className="w-px h-12 bg-gray-700"></div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">10k+</div>
                  <div className="text-gray-400 text-sm">Downloads</div>
                </div>
                <div className="w-px h-12 bg-gray-700"></div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">5★</div>
                  <div className="text-gray-400 text-sm">Rating</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative w-full h-96">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-primary-500/30 to-primary-700/30 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-green-400">✓</span>
                      </div>
                      <span className="text-gray-300">React E-commerce</span>
                      <span className="ml-auto text-primary-400">₹49</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-400">✓</span>
                      </div>
                      <span className="text-gray-300">Node.js API</span>
                      <span className="ml-auto text-primary-400">₹39</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-purple-400">✓</span>
                      </div>
                      <span className="text-gray-300">ML Pipeline</span>
                      <span className="ml-auto text-primary-400">₹79</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection of coding projects across various categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="group bg-gray-50 rounded-xl p-6 text-center hover:bg-primary-50 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{category.count} projects</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Projects</h2>
              <p className="text-gray-600">Handpicked projects loved by our customers</p>
            </div>
            <Link to="/products?featured=true" className="hidden sm:flex items-center text-primary-600 font-medium hover:text-primary-700">
              View All
              <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link to="/products?featured=true" className="btn-primary">
              View All Featured
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started with your project in just a few simple steps
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CodeKart?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed with your projects
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your Development?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who save time with our premium coding projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Projects
            </Link>
            <Link to="/signup" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
