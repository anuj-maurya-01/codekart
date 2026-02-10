import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await productAPI.getById(id)
        setProduct(response.data.data)
        
        // Fetch related products
        const relatedRes = await productAPI.getAll({
          category: response.data.data.category,
          limit: 4
        })
        setRelatedProducts(relatedRes.data.data.filter(p => p._id !== id).slice(0, 4))
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700'
      case 'advanced':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    )
  }

  const images = [product.thumbnail, ...(product.images || [])]

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{product.title}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary-500' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`badge ${getDifficultyColor(product.difficulty)}`}>
                  {product.difficulty}
                </span>
                <span className="badge bg-gray-100 text-gray-600">
                  {product.category?.replace('-', ' ')}
                </span>
                {product.featured && (
                  <span className="badge bg-yellow-100 text-yellow-700">Featured</span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary-600">₹{product.price}</span>
                {product.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-gray-500">({product.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {product.techStack?.map((tech) => (
                    <span key={tech} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Delivery Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="font-medium">{product.deliveryType === 'instant' ? 'Instant Download' : product.deliveryTime}</span>
                </div>
                {product.fileSize && (
                  <p className="text-sm text-gray-500">File Size: {product.fileSize}</p>
                )}
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails
