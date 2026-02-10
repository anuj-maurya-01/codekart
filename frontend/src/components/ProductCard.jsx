import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

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

  return (
    <div className="card group">
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
              Featured
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge ${getDifficultyColor(product.difficulty)}`}>
            {product.difficulty}
          </span>
          <span className="badge bg-gray-100 text-gray-600">
            {product.category?.replace('-', ' ')}
          </span>
        </div>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.shortDescription || product.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.techStack?.slice(0, 3).map((tech) => (
            <span key={tech} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-600">₹{product.price}</span>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm text-gray-600">{product.rating}</span>
                <span className="text-sm text-gray-400">({product.reviewCount})</span>
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              addToCart(product)
            }}
            disabled={!product.inStock}
            className="btn-primary py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
