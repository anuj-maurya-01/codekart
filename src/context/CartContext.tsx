import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CartItem, Product } from '../types'
import toast from 'react-hot-toast'

const CART_STORAGE_KEY = 'codekart_cart'

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  loading: boolean
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartItem: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        setItems(JSON.parse(stored) as CartItem[])
      } catch (error) {
        console.error('Failed to parse cart storage', error)
        localStorage.removeItem(CART_STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, loading])

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id)
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      toast.success(`${product.title} added to cart`)
      return [...prev, { product, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId))
    toast.success('Removed from cart')
  }, [])

  const updateCartItem = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    [items],
  )

  const value = useMemo(
    () => ({ items, totalItems, totalPrice, addToCart, removeFromCart, updateCartItem, clearCart, loading }),
    [items, totalItems, totalPrice, addToCart, removeFromCart, updateCartItem, clearCart, loading],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
