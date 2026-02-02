import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../lib/utils'

const Cart = () => {
  const { items, totalItems, totalPrice, updateCartItem, removeFromCart } = useCart()

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4">
      <div>
        <h1 className="text-2xl font-semibold text-white md:text-3xl">Your cart</h1>
        <p className="mt-2 text-sm text-slate-400">{totalItems} item(s) ready to ship</p>
      </div>
      {items.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-300">
          <p>Your cart is empty.</p>
          <Link to="/products" className="mt-4 inline-flex items-center rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product._id} className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <img src={item.product.thumbnail} alt={item.product.title} className="h-24 w-24 rounded-2xl object-cover" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.product.title}</h3>
                    <p className="text-xs text-slate-500">{item.product.techStack.join(', ')}</p>
                    <p className="mt-2 text-sm text-slate-400">{item.product.deliveryType}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/60 px-3 py-1">
                    <button onClick={() => updateCartItem(item.product._id, item.quantity - 1)} className="px-2 text-slate-400">-
                    </button>
                    <span className="text-sm text-white">{item.quantity}</span>
                    <button onClick={() => updateCartItem(item.product._id, item.quantity + 1)} className="px-2 text-slate-400">+
                    </button>
                  </div>
                  <p className="text-lg font-semibold text-cyan-400">{formatCurrency(item.product.price * item.quantity)}</p>
                  <button onClick={() => removeFromCart(item.product._id)} className="text-xs text-slate-500 hover:text-cyan-300">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Order summary</p>
              <p className="mt-4 text-3xl font-semibold text-white">{formatCurrency(totalPrice)}</p>
            </div>
            <Link
              to="/checkout"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
