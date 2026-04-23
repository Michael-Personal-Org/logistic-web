'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthHero } from '@/app/(auth)/auth-hero'

import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/lib/stores/auth.store'
import { isApiError } from '@/lib/types/api.types'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const setSession = useAuthStore((s) => s.setSession)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      const res = await authApi.login(data)

      if (res.requiresTwoFactor) {
        // Guardar userId temporalmente para el step de 2FA
        sessionStorage.setItem('2fa-user-id', res.user.id)
        router.push('/2fa')
        return
      }

      setSession(res.user, res.accessToken)
      router.push('/dashboard')
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.response.data.error.message)
      } else {
        toast.error('Error al iniciar sesión')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AuthHero />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 44,
          background: 'var(--color-off)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--color-indigo-100)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: 20,
              }}
            >
              <Lock size={20} color="var(--color-indigo)" />
            </div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)',
                margin: '0 0 6px',
              }}
            >
              Bienvenido de vuelta
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--color-muted)', margin: 0 }}>
              Inicia sesión para continuar con tu panel.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-ink)' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="var(--color-muted)"
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="tu@empresa.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    background: 'var(--color-off)',
                    border: `1px solid ${errors.email ? 'var(--color-danger)' : 'var(--color-line-2)'}`,
                    borderRadius: 6,
                    fontSize: 14,
                    color: 'var(--color-ink)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              {errors.email && (
                <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-ink)' }}>
                  Contraseña
                </label>
                <Link
                  href="/forgot-password"
                  style={{ fontSize: 12, color: 'var(--color-indigo)' }}
                >
                  ¿Olvidaste?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="var(--color-muted)"
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 36px',
                    background: 'var(--color-off)',
                    border: `1px solid ${errors.password ? 'var(--color-danger)' : 'var(--color-line-2)'}`,
                    borderRadius: 6,
                    fontSize: 14,
                    color: 'var(--color-ink)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    color: 'var(--color-muted)',
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 20px',
                background: loading ? 'var(--color-indigo-100)' : 'var(--color-indigo)',
                color: loading ? 'var(--color-indigo)' : '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 14.5,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 8,
                transition: 'all .14s ease',
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Entrar'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-line)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11.5,
                color: 'var(--color-muted)',
              }}
            >
              o
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-line)' }} />
          </div>

          {/* SSO */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '10px 16px',
              background: 'var(--color-off)',
              color: 'var(--color-ink)',
              border: '1px solid var(--color-line-2)',
              borderRadius: 6,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Shield size={16} /> Continuar con SSO
          </button>

          <p
            style={{
              textAlign: 'center',
              marginTop: 24,
              fontSize: 13.5,
              color: 'var(--color-muted)',
            }}
          >
            ¿No tienes cuenta?{' '}
            <Link href="/register" style={{ fontWeight: 600, color: 'var(--color-indigo)' }}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
