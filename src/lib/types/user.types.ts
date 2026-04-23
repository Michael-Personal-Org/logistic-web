export type UserRole = 'CLIENT' | 'DRIVER' | 'OPERATOR' | 'ADMIN'
export type UserStatus = 'pending' | 'active' | 'suspended'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status: UserStatus
  twoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface UserSummary {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export interface ListUsersResponse {
  users: UserSummary[]
  total: number
  page: number
  limit: number
  totalPages: number
}
