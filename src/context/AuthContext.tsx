import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { AuthResponse, User } from '../types'
import api from '../services/api'

type AuthContextValue = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const AUTH_STORAGE_KEY = 'codekart_auth'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { user: User; token: string }
        setUser(parsed.user)
        setToken(parsed.token)
        api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`
      } catch (error) {
        console.error('Failed to parse auth storage', error)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const persist = (payload: AuthResponse) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
    api.defaults.headers.common.Authorization = `Bearer ${payload.token}`
    setUser(payload.user)
    setToken(payload.token)
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
      persist(data)
      toast.success(`Welcome back ${data.user.name.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'Failed to login')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      const { data } = await api.post<AuthResponse>('/auth/signup', { name, email, password })
      persist(data)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'Failed to signup')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    api.defaults.headers.common.Authorization = undefined
    localStorage.removeItem(AUTH_STORAGE_KEY)
    toast.success('Logged out successfully')
    navigate('/')
  }

  const value = useMemo(
    () => ({ user, token, loading, login, signup, logout }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
