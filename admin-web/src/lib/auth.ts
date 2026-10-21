import { api } from './api'
import { AuthResponse, LoginRequest } from '@/types/auth'

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    localStorage.setItem('accessToken', response.data.accessToken)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
    localStorage.removeItem('accessToken')
  },

  me: async (): Promise<AuthResponse['user']> => {
    const response = await api.get<AuthResponse['user']>('/auth/me')
    return response.data
  },

  getToken: (): string | null => {
    return localStorage.getItem('accessToken')
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken')
  },
}
