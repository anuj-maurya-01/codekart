import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../services/orderService'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formState, setFormState] = useState({
    customerName: '',
    customerEmail: '',
    notes: '',
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.customerName || !formState.customerEmail) {
      toast.error('Name and email are required')
      return
    }
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)
    try {
      const payload = {
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        customerName: formState.customerName,
        customerEmail: formState.customerEmail,
        notes: formState.notes,
      }
      await createOrder(payload)
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/order-success')
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4">
      <div>
        <h1 className="text-2xl font-semibold text-white md:text-3xl">Checkout</h1>
        <p className="mt-2 text-sm text-slate-400">Complete your order request. We’ll email the admin instantly.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            Name
            <input
              type="text"
              value={formState.customerName}
              onChange={(event) => setFormState((prev) => ({ ...prev, customerName: event.target.value }))}
              className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            Email
            <input
              type="email"
              value={formState.customerEmail}
              onChange={(event) => setFormState((prev) => ({ ...prev, customerEmail: event.target.value }))}
              className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
            />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
          Additional notes
          <textarea
            value={formState.notes}
            onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
            className="min-h-[120px] rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Submitting...' : 'Place order'}
        </button>
      </form>
    </div>
  )
}

export default Checkout
