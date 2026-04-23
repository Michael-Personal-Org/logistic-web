'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthHero } from '@/components/features/auth/auth-hero'
import { authApi } from '@/lib/api/auth.api'
import { isApiError } from '@/lib/types/api.types'

const schema = z.object({
  email: z.string().email('Email inválido'),
})
type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!sent) return
    setCooldown(42)
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [sent])

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      await authApi.forgotPassword(data.email)
      setEmail(data.email)
      setSent(true)
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.response.data.error.message)
      } else {
        toast.error('Error al enviar el email')
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
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: 'var(--color-ink-2)',
              marginBottom: 28,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} /> Volver al login
          </Link>

          {!sent ? (
            <>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-ink)',
                  margin: '0 0 6px',
                }}
              >
                Recuperar acceso
              </h1>
              <p style={{ fontSize: 13.5, color: 'var(--color-muted)', margin: '0 0 28px' }}>
                Te enviaremos un enlace para restablecer tu contraseña.
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label
                    htmlFor="fp-email"
                    style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-ink)' }}
                  >
                    Email de tu cuenta
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
                      id="fp-email"
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
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 20px',
                    background: 'var(--color-indigo)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 14.5,
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
                <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: 0 }}>
                  Por seguridad, no revelamos si un email está registrado.
                </p>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: 'var(--color-sage-50)',
                  color: '#4d6a55',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircle size={30} />
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
                Revisa tu correo
              </h1>
              <p style={{ fontSize: 13.5, color: 'var(--color-muted)', margin: '0 0 24px' }}>
                Si <strong style={{ color: 'var(--color-ink)' }}>{email}</strong> existe en Logisti,
                encontrarás un enlace válido por{' '}
                <strong style={{ color: 'var(--color-ink)' }}>30 min</strong>.
              </p>
              <button
                type="button"
                disabled={cooldown > 0}
                onClick={() => {
                  setSent(false)
                  setCooldown(0)
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'var(--color-off)',
                  color: 'var(--color-ink)',
                  border: '1px solid var(--color-line-2)',
                  borderRadius: 6,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
                  opacity: cooldown > 0 ? 0.5 : 1,
                }}
              >
                {cooldown > 0
                  ? `Reenviar en 0:${String(cooldown).padStart(2, '0')}`
                  : 'Reenviar enlace'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
