import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import { toast } from 'react-toastify'

const ManageProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll({ limit: 100 })
      setProducts(response.data.data)
      setPagination({
        total: response.data.total,
        page: response.data.page,
        pages: response.data.pages
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id)
        toast.success('Product deleted')
        fetchProducts()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product')
      }
    }
  }

  const toggleStock = async (product) => {
    try {
      await productAPI.update(product._id, { inStock: !product.inStock })
      fetchProducts()
      toast.success('Product updated')
    } catch (error) {
      toast.error('Failed to update product')
    }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
        <Link to="/admin/products/add" className="btn-primary">
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <p className="text-gray-600">
          Total Products: <span className="font-semibold text-gray-900">{pagination.total}</span>
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No products yet</p>
            <Link to="/admin/products/add" className="btn-primary">
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={product.thumbnail} alt={product.title} className="w-12 h-12 object-cover rounded-lg mr-4" />
                        <div>
                          <p className="font-medium text-gray-900">{product.title}</p>
                          <p className="text-sm text-gray-500">{product.difficulty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.category?.replace('-', ' ')}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStock(product)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {product.featured ? (
                        <span className="text-yellow-500">⭐</span>
                      ) : (
                        <span className="text-gray-300">☆</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageProducts
