import type { Order } from '../types'
import { formatCurrency, formatDate } from '../lib/utils'

interface Props {
  order: Order
}

const OrderCard = ({ order }: Props) => {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Order ID</p>
          <p className="font-semibold text-white">{order._id}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Placed</p>
          <p className="font-semibold text-white">{formatDate(order.createdAt)}</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {order.items.map((item) => (
          <div key={item.product._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div>
              <p className="font-semibold text-white">{item.product.title}</p>
              <p className="text-xs text-slate-500">{item.product.techStack.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300">Qty: {item.quantity}</p>
              <p className="font-semibold text-cyan-400">{formatCurrency(item.price)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</p>
          <p className="font-semibold text-white capitalize">{order.status}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total</p>
          <p className="text-lg font-semibold text-cyan-400">{formatCurrency(order.total)}</p>
        </div>
      </div>
      {order.deliveryLink && (
        <a
          href={order.deliveryLink}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400"
        >
          Download project
        </a>
      )}
    </article>
  )
}

export default OrderCard
