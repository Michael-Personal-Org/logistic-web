import Cookies from 'js-cookie'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'CLIENT' | 'DRIVER' | 'OPERATOR' | 'ADMIN'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  twoFactorEnabled: boolean
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean

  // Actions
  setSession: (user: AuthUser, accessToken: string) => void
  clearSession: () => void
  updateUser: (user: Partial<AuthUser>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setSession: (user, accessToken) => {
        Cookies.set('auth-token', accessToken, { expires: 7 })
        Cookies.set('auth-role', user.role, { expires: 7 })
        set({ user, accessToken, isAuthenticated: true })
      },

      clearSession: () => {
        Cookies.remove('auth-token')
        Cookies.remove('auth-role')
        set({ user: null, accessToken: null, isAuthenticated: false })
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: 'logisti-auth',
      partialize: (state) => ({
        // ← partialize, no partialState
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
