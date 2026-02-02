import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatCurrency } from '../lib/utils'
import { useCart } from '../context/CartContext'

interface Props {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  const { addToCart } = useCart()

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl transition hover:border-cyan-500/50">
      <Link to={`/products/${product._id}`} className="relative block overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-48 w-full object-cover transition duration-500 hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-cyan-300">
          {product.difficulty}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{product.title}</h3>
          <p className="line-clamp-2 text-sm text-slate-400">{product.description}</p>
          <div className="flex flex-wrap gap-2 text-xs text-cyan-300">
            {product.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className="rounded-full border border-slate-700 px-3 py-1">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-xl font-semibold text-cyan-400">{formatCurrency(product.price)}</p>
          <button
            onClick={() => addToCart(product)}
            className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
