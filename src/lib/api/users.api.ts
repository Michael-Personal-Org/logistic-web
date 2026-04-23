import type { ListUsersResponse, User, UserRole, UserStatus } from '@/lib/types/user.types'
import { apiClient } from './client'

export interface ListUsersParams {
  role?: UserRole
  status?: UserStatus
  page?: number
  limit?: number
}

export const usersApi = {
  list: async (params?: ListUsersParams): Promise<ListUsersResponse> => {
    const res = await apiClient.get<{ data: ListUsersResponse }>('/admin/users', { params })
    return res.data.data
  },

  getOne: async (userId: string): Promise<User> => {
    const res = await apiClient.get<{ data: User }>(`/admin/users/${userId}`)
    return res.data.data
  },

  create: async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRole
  }): Promise<{ userId: string; message: string }> => {
    const res = await apiClient.post<{ data: { userId: string; message: string } }>(
      '/admin/users',
      data
    )
    return res.data.data
  },

  updateStatus: async (
    userId: string,
    status: 'active' | 'suspended'
  ): Promise<{ message: string }> => {
    const res = await apiClient.patch<{ data: { message: string } }>(
      `/admin/users/${userId}/status`,
      { status }
    )
    return res.data.data
  },

  changeRole: async (userId: string, role: UserRole): Promise<{ message: string }> => {
    const res = await apiClient.patch<{ data: { message: string } }>(
      `/admin/users/${userId}/role`,
      { role }
    )
    return res.data.data
  },
}
