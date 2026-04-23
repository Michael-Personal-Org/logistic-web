import axios from 'axios'
import { useAuthStore } from '../stores/auth.store'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

// ─── Request interceptor ─────────────────────────────────
// Agrega el token a cada request automáticamente
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response interceptor ────────────────────────────────
// Maneja errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró, limpiar la sesión
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession()
      // En Next.js no podemos usar router aquí directamente
      // El middleware se encarga de redirigir
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
