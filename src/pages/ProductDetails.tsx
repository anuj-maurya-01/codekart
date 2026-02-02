import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct } from '../services/productService'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../lib/utils'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return
      try {
        const data = await fetchProduct(id)
        setProduct(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 md:grid-cols-[1.2fr,1fr]">
          <div className="h-96 animate-pulse rounded-3xl bg-slate-900/60" />
          <div className="space-y-4">
            <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-900/60" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-900/60" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-900/60" />
            <div className="h-12 w-32 animate-pulse rounded-2xl bg-slate-900/60" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 text-center text-slate-300">
        <p>Product not found.</p>
        <Link to="/products" className="mt-4 inline-flex items-center rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900">
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4">
      <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
            <img src={product.thumbnail} alt={product.title} className="h-96 w-full object-cover" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.gallery.map((image) => (
              <img key={image} src={image} alt={product.title} className="h-40 w-full rounded-2xl border border-slate-800 object-cover" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-white">{product.title}</h1>
            <p className="mt-2 text-sm text-slate-400">{product.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-cyan-300">
            {product.techStack.map((tech) => (
              <span key={tech} className="rounded-full border border-slate-800 px-3 py-1">
                {tech}
              </span>
            ))}
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <p>Difficulty: <span className="font-semibold text-white">{product.difficulty}</span></p>
            <p className="mt-2">Delivery: <span className="font-semibold text-white">{product.deliveryType}</span></p>
          </div>
          <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Price</p>
              <p className="text-3xl font-semibold text-cyan-400">{formatCurrency(product.price)}</p>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
