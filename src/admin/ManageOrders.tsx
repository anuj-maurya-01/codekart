import { useEffect, useState } from 'react'
import { fetchAllOrders, markDelivered } from '../services/orderService'
import type { Order } from '../types'
import { formatCurrency, formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [deliveryLink, setDeliveryLink] = useState<Record<string, string>>({})

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await fetchAllOrders()
      setOrders(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleDeliver = async (orderId: string) => {
    if (!deliveryLink[orderId]) {
      toast.error('Delivery link is required')
      return
    }
    try {
      const updated = await markDelivered(orderId, { deliveryLink: deliveryLink[orderId] })
      toast.success('Order marked as delivered')
      setOrders((prev) => prev.map((order) => (order._id === orderId ? updated : order)))
      setDeliveryLink((prev) => ({ ...prev, [orderId]: '' }))
    } catch (error) {
      toast.error('Failed to update order')
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-white md:text-3xl">Manage orders</h1>
        <p className="mt-2 text-sm text-slate-400">Track customer requests and deliver download links.</p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-3xl bg-slate-900/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Order</p>
                  <p className="font-semibold text-white">{order._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Placed</p>
                  <p className="font-semibold text-white">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.product._id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                    <p className="font-semibold text-white">{item.product.title}</p>
                    <p className="text-xs text-slate-500">{item.product.techStack.join(', ')}</p>
                    <p className="mt-2 text-sm text-slate-300">Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Customer</p>
                  <p className="mt-2 font-semibold text-white">{order.customerName}</p>
                  <p className="text-sm text-slate-300">{order.customerEmail}</p>
                  {order.notes && <p className="mt-2 text-xs text-slate-400">“{order.notes}”</p>}
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</p>
                  <p className="mt-2 font-semibold text-white capitalize">{order.status}</p>
                  <p className="mt-3 text-lg font-semibold text-cyan-400">{formatCurrency(order.total)}</p>
                  <input
                    type="url"
                    placeholder="Delivery link"
                    value={deliveryLink[order._id] ?? ''}
                    onChange={(event) =>
                      setDeliveryLink((prev) => ({ ...prev, [order._id]: event.target.value }))
                    }
                    className="mt-4 h-11 w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-3 text-xs text-slate-200"
                  />
                  <button
                    onClick={() => handleDeliver(order._id)}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-900"
                  >
                    Mark delivered
                  </button>
                  {order.deliveryLink && (
                    <a
                      href={order.deliveryLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center text-xs text-cyan-300"
                    >
                      View delivery
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
          {orders.length === 0 && (
            <p className="text-center text-sm text-slate-400">No orders yet.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ManageOrders
