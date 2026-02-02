import api from './api'
import type { Product } from '../types'
import { buildQueryString } from '../lib/utils'

export const fetchProducts = async (filters: {
  search?: string
  tech?: string
  difficulty?: string
  sort?: string
}) => {
  const query = buildQueryString(filters)
  const { data } = await api.get<Product[]>(`/products${query}`)
  return data
}

export const fetchProduct = async (id: string) => {
  const { data } = await api.get<Product>(`/products/${id}`)
  return data
}

export const createProduct = async (payload: FormData) => {
  const { data } = await api.post<Product>('/products', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const updateProduct = async (id: string, payload: FormData) => {
  const { data } = await api.put<Product>(`/products/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const deleteProduct = async (id: string) => {
  const { data } = await api.delete<{ message: string }>(`/products/${id}`)
  return data
}
