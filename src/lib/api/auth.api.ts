import type { AuthUser } from '@/lib/stores/auth.store'
import { apiClient } from './client'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  requiresTwoFactor: boolean
  user: AuthUser
}

export interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface TwoFactorInput {
  userId: string
  code: string
}

export const authApi = {
  login: async (data: LoginInput): Promise<LoginResponse> => {
    const res = await apiClient.post<{ data: LoginResponse }>('/auth/login', data)
    return res.data.data
  },

  register: async (data: RegisterInput) => {
    const res = await apiClient.post<{ data: { message: string } }>('/auth/register', data)
    return res.data.data
  },

  logout: async (accessToken: string) => {
    await apiClient.post(
      '/auth/logout',
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post<{ data: { message: string } }>('/auth/forgot-password', {
      email,
    })
    return res.data.data
  },

  resetPassword: async (token: string, password: string) => {
    const res = await apiClient.post<{ data: { message: string } }>('/auth/reset-password', {
      token,
      password,
    })
    return res.data.data
  },

  verifyTwoFactor: async (data: TwoFactorInput): Promise<LoginResponse> => {
    const res = await apiClient.post<{ data: LoginResponse }>('/auth/2fa/verify', data)
    return res.data.data
  },
}
