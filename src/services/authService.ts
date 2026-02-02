import api from './api'
import type { AuthResponse } from '../types'

export const loginRequest = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  return data
}

export const signupRequest = async (name: string, email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/signup', { name, email, password })
  return data
}
