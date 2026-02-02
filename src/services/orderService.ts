import api from './api'
import type { Order } from '../types'

export const createOrder = async (payload: {
  items: { product: string; quantity: number }[]
  customerName: string
  customerEmail: string
  notes?: string
}) => {
  const { data } = await api.post<Order>('/orders', payload)
  return data
}

export const fetchMyOrders = async () => {
  const { data } = await api.get<Order[]>('/orders/my')
  return data
}

export const fetchAllOrders = async () => {
  const { data } = await api.get<Order[]>('/orders/all')
  return data
}

export const markDelivered = async (orderId: string, payload: { deliveryLink: string }) => {
  const { data } = await api.put<Order>(`/orders/${orderId}/deliver`, payload)
  return data
}
