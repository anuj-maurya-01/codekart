export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  _id: string
  title: string
  description: string
  techStack: string[]
  difficulty: DifficultyLevel
  price: number
  thumbnail: string
  gallery: string[]
  deliveryType: string
  featured?: boolean
  categories?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  product: Product
  quantity: number
  price: number
}

export type OrderStatus = 'pending' | 'delivered'

export interface Order {
  _id: string
  user: User
  items: OrderItem[]
  customerName: string
  customerEmail: string
  notes?: string
  status: OrderStatus
  deliveryLink?: string
  total: number
  createdAt: string
  updatedAt?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiError {
  message: string
  statusCode?: number
}
