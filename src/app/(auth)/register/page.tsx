'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Building, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Logo } from '@/components/common/logo'
import { AuthHero } from '@/components/features/auth/auth-hero'
import { authApi } from '@/lib/api/auth.api'
import { isApiError } from '@/lib/types/api.types'

const step1Schema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
})

const step2Schema = z
  .object({
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe tener al menos un número')
      .regex(/[^a-zA-Z0-9]/, 'Debe tener al menos un carácter especial'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v, 'Debes aceptar los términos'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type Step1Values = z.infer<typeof step1Schema>
type Step2Values = z.infer<typeof step2Schema>

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

const inputWithIconStyle = (hasError?: boolean) => ({
  ...inputStyle(hasError),
  paddingLeft: 36,
})

const labelStyle = {
  fontSize: 12.5,
  fontWeight: 600,
  color: 'var(--color-ink)',
}

const errorStyle = {
  fontSize: 12,
  color: 'var(--color-danger)',
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1Values | null>(null)
  const [loading, setLoading] = useState(false)

  const pwScore = (pw: string) => Math.min(4, Math.floor(pw.length / 3))

  const form1 = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', companyName: '' },
  })

  const form2 = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: { password: '', confirmPassword: '', terms: false },
  })

  const pw = form2.watch('password')
  const score = pwScore(pw)

  const onStep1 = (data: Step1Values) => {
    setStep1Data(data)
    setStep(2)
  }

  const onStep2 = async (data: Step2Values) => {
    if (!step1Data) return
    try {
      setLoading(true)
      await authApi.register({
        firstName: step1Data.firstName,
        lastName: step1Data.lastName,
        email: step1Data.email,
        password: data.password,
      })
      router.push('/activate?variant=sent')
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.response.data.error.message)
      } else {
        toast.error('Error al crear la cuenta')
      }
    } finally {
      setLoading(false)
    }
  }

  const barColor = (i: number) => {
    if (score <= i) return 'var(--color-line)'
    if (score <= 2) return 'var(--color-warn)'
    return 'var(--color-sage)'
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
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 24 }}>
            <Logo />
          </div>

          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)',
                margin: 0,
              }}
            >
              Crear cuenta
            </h1>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11.5,
                color: 'var(--color-muted)',
              }}
            >
              Paso {step} / 2
            </span>
          </div>

          {/* Stepper */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {[1, 2].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 999,
                  background: step >= s ? 'var(--color-indigo)' : 'var(--color-line)',
                  transition: 'background .2s',
                }}
              />
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <form
              onSubmit={form1.handleSubmit(onStep1)}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="firstName" style={labelStyle}>
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    {...form1.register('firstName')}
                    placeholder="María"
                    style={inputStyle(!!form1.formState.errors.firstName)}
                  />
                  {form1.formState.errors.firstName && (
                    <span style={errorStyle}>{form1.formState.errors.firstName.message}</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="lastName" style={labelStyle}>
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    {...form1.register('lastName')}
                    placeholder="González"
                    style={inputStyle(!!form1.formState.errors.lastName)}
                  />
                  {form1.formState.errors.lastName && (
                    <span style={errorStyle}>{form1.formState.errors.lastName.message}</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="reg-email" style={labelStyle}>
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
                    id="reg-email"
                    {...form1.register('email')}
                    type="email"
                    placeholder="tu@empresa.com"
                    style={inputWithIconStyle(!!form1.formState.errors.email)}
                  />
                </div>
                {form1.formState.errors.email && (
                  <span style={errorStyle}>{form1.formState.errors.email.message}</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="phone" style={labelStyle}>
                  Teléfono{' '}
                  <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>
                    — para notificaciones
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone
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
                    id="phone"
                    {...form1.register('phone')}
                    placeholder="+1 809 000 0000"
                    style={inputWithIconStyle()}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="companyName" style={labelStyle}>
                  Empresa{' '}
                  <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>— opcional</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Building
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
                    id="companyName"
                    {...form1.register('companyName')}
                    placeholder="Acme Logística"
                    style={inputWithIconStyle()}
                  />
                </div>
              </div>

              <button
                type="submit"
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
                  cursor: 'pointer',
                  marginTop: 6,
                }}
              >
                Continuar <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form
              onSubmit={form2.handleSubmit(onStep2)}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="password" style={labelStyle}>
                  Contraseña
                </label>
                <input
                  id="password"
                  {...form2.register('password')}
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  style={inputStyle(!!form2.formState.errors.password)}
                />
                <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 999,
                        background: barColor(i + 1),
                        transition: 'background .2s',
                      }}
                    />
                  ))}
                </div>
                {form2.formState.errors.password ? (
                  <span style={errorStyle}>{form2.formState.errors.password.message}</span>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                    Usa 8+ caracteres con número y símbolo.
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="confirmPassword" style={labelStyle}>
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  {...form2.register('confirmPassword')}
                  type="password"
                  placeholder="Repite tu contraseña"
                  style={inputStyle(!!form2.formState.errors.confirmPassword)}
                />
                {form2.formState.errors.confirmPassword && (
                  <span style={errorStyle}>{form2.formState.errors.confirmPassword.message}</span>
                )}
              </div>

              <label
                htmlFor="terms"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: 'var(--color-ink-2)',
                  marginTop: 4,
                }}
              >
                <input
                  id="terms"
                  type="checkbox"
                  {...form2.register('terms')}
                  style={{ width: 16, height: 16, accentColor: 'var(--color-indigo)' }}
                />
                <span>
                  Acepto los{' '}
                  <Link href="#" style={{ color: 'var(--color-indigo)' }}>
                    términos
                  </Link>{' '}
                  y la{' '}
                  <Link href="#" style={{ color: 'var(--color-indigo)' }}>
                    política de privacidad
                  </Link>
                </span>
              </label>
              {form2.formState.errors.terms && (
                <span style={errorStyle}>{form2.formState.errors.terms.message}</span>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
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
                  <ArrowLeft size={16} /> Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading || !form2.watch('terms')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: 'var(--color-indigo)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: !form2.watch('terms') ? 0.5 : 1,
                  }}
                >
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </div>
            </form>
          )}

          <p
            style={{
              textAlign: 'center',
              marginTop: 24,
              fontSize: 13.5,
              color: 'var(--color-muted)',
            }}
          >
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" style={{ fontWeight: 600, color: 'var(--color-indigo)' }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
