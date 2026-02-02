import { useEffect, useState } from 'react'
import OrderCard from '../components/OrderCard'
import { fetchMyOrders } from '../services/orderService'
import type { Order } from '../types'

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchMyOrders()
        setOrders(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-3xl bg-slate-900/60" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-300">
        <p>No orders yet. Explore templates to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  )
}

export default MyOrders
