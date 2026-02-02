import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, deleteProduct } from '../services/productService'
import type { Product } from '../types'
import { formatCurrency } from '../lib/utils'
import toast from 'react-hot-toast'

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await fetchProducts({})
      setProducts(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      setProducts((prev) => prev.filter((product) => product._id !== id))
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Manage products</h1>
          <p className="mt-2 text-sm text-slate-400">Create, update, or remove marketplace products.</p>
        </div>
        <Link to="/admin/products/new" className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900">
          Add new product
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-3xl bg-slate-900/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <article key={product._id} className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <img src={product.thumbnail} alt={product.title} className="h-24 w-24 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                  <p className="text-xs text-slate-500">{product.techStack.join(', ')}</p>
                  <p className="mt-2 text-sm text-slate-400">{product.difficulty}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 text-sm">
                <p className="text-lg font-semibold text-cyan-400">{formatCurrency(product.price)}</p>
                <div className="flex gap-3">
                  <Link to={`/admin/products/${product._id}`} className="rounded-2xl border border-slate-700 px-3 py-2 text-xs text-slate-200">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(product._id)} className="rounded-2xl border border-red-500 px-3 py-2 text-xs text-red-400">
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
          {products.length === 0 && (
            <p className="text-center text-sm text-slate-400">No products yet.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ManageProducts
