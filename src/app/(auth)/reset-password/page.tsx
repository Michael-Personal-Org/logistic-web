'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthHero } from '@/components/features/auth/auth-hero'
import { authApi } from '@/lib/api/auth.api'
import { isApiError } from '@/lib/types/api.types'

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe tener al menos un número')
      .regex(/[^a-zA-Z0-9]/, 'Debe tener al menos un carácter especial'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

const barColor = (score: number, i: number) => {
  if (score <= i) return 'var(--color-line)'
  if (score <= 2) return 'var(--color-warn)'
  return 'var(--color-sage)'
}

const inputStyle = (hasError?: boolean) => ({
  width: '100%',
  padding: '10px 12px',
  background: 'var(--color-off)',
  border: `1px solid ${hasError ? 'var(--color-danger)' : 'var(--color-line-2)'}`,
  borderRadius: 6,
  fontSize: 14,
  color: 'var(--color-ink)',
  outline: 'none',
  boxSizing: 'border-box' as const,
})

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const pw = watch('password') ?? ''
  const score = Math.min(4, Math.floor(pw.length / 3))

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      toast.error('Token inválido')
      return
    }
    try {
      setLoading(true)
      await authApi.resetPassword(token, data.password)
      toast.success('Contraseña actualizada correctamente')
      router.push('/login')
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.response.data.error.message)
      } else {
        toast.error('Error al restablecer la contraseña')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
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
          <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'var(--color-warn-50)',
                color: 'var(--color-warn)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Clock size={30} />
            </div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--color-ink)',
                margin: '0 0 6px',
              }}
            >
              Enlace expirado
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--color-muted)', margin: '0 0 24px' }}>
              Este enlace ya no es válido. Los enlaces expiran a los 30 minutos por seguridad.
            </p>
            <Link
              href="/forgot-password"
              style={{
                display: 'block',
                padding: '12px 20px',
                background: 'var(--color-indigo)',
                color: '#fff',
                borderRadius: 6,
                fontSize: 14.5,
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              Solicitar nuevo enlace
            </Link>
            <Link
              href="/login"
              style={{
                display: 'block',
                padding: '10px 16px',
                background: 'transparent',
                color: 'var(--color-ink-2)',
                borderRadius: 6,
                fontSize: 13.5,
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Volver al login
            </Link>
          </div>
        </div>
      </>
    )
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
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
              margin: '0 0 6px',
            }}
          >
            Nueva contraseña
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--color-muted)', margin: '0 0 24px' }}>
            Elige una contraseña segura para tu cuenta.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label
                htmlFor="new-password"
                style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-ink)' }}
              >
                Nueva contraseña
              </label>
              <input
                id="new-password"
                {...register('password')}
                type="password"
                placeholder="Mínimo 8 caracteres"
                style={inputStyle(!!errors.password)}
              />
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 999,
                      background: barColor(score, i + 1),
                      transition: 'background .2s',
                    }}
                  />
                ))}
              </div>
              {errors.password && (
                <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label
                htmlFor="confirm-password"
                style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-ink)' }}
              >
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                {...register('confirmPassword')}
                type="password"
                placeholder="Repite tu contraseña"
                style={inputStyle(!!errors.confirmPassword)}
              />
              {errors.confirmPassword && (
                <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 20px',
                background: 'var(--color-indigo)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 14.5,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4,
              }}
            >
              {loading ? 'Guardando...' : 'Guardar contraseña'}
              {!loading && <ArrowRight size={16} />}
            </button>
            <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: 0 }}>
              Al guardar, cerraremos todas tus sesiones activas.
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  )
}
