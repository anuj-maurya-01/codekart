import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productAPI } from '../services/api'
import { toast } from 'react-toastify'

const AddProduct = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    category: 'web-development',
    difficulty: 'intermediate',
    techStack: '',
    thumbnail: '',
    images: '',
    features: '',
    deliveryType: 'instant',
    deliveryTime: 'Instant download',
    fileSize: '',
    inStock: true,
    featured: false
  })

  const categories = [
    'web-development',
    'mobile-apps',
    'data-science',
    'machine-learning',
    'desktop-apps',
    'games',
    'apis',
    'blockchain',
    'other'
  ]

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData(prev => ({ ...prev, [e.target.name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        techStack: formData.techStack.split(',').map(t => t.trim()).filter(t => t),
        images: formData.images.split(',').map(i => i.trim()).filter(i => i),
        features: formData.features.split('\n').map(f => f.trim()).filter(f => f)
      }

      await productAPI.create(data)
      toast.success('Product created successfully')
      navigate('/admin/products')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="E-commerce Website with React"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="input-field"
              placeholder="A brief summary..."
              maxLength={200}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="input-field"
              placeholder="Detailed description of the project..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="input-field"
              placeholder="49.99"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input-field"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="input-field"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              className="input-field"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL *</label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images (comma separated URLs)</label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              className="input-field"
              placeholder="https://..., https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type</label>
            <select
              name="deliveryType"
              value={formData.deliveryType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="instant">Instant Download</option>
              <option value="custom">Custom Delivery</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
            <input
              type="text"
              name="fileSize"
              value={formData.fileSize}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 25 MB"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600"
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 py-3 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn-outline flex-1 py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
