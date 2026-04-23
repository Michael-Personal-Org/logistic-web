'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Laptop, Monitor, Shield, ShieldCheck, ShieldOff, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { PageHeader } from '@/components/common/page-header'
import { Topbar } from '@/components/common/topbar'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/lib/stores/auth.store'

// ─── Schemas ─────────────────────────────────────────────
const pwSchema = z
  .object({
    currentPassword: z.string().min(1, 'Requerido'),
    newPassword: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener una mayúscula')
      .regex(/[0-9]/, 'Debe tener un número')
      .regex(/[^a-zA-Z0-9]/, 'Debe tener un símbolo'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type PwFormValues = z.infer<typeof pwSchema>

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--color-off)',
  border: '1px solid var(--color-line-2)',
  borderRadius: 6,
  fontSize: 14,
  color: 'var(--color-ink)',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const labelStyle = { fontSize: 12.5, fontWeight: 600, color: 'var(--color-ink)' }

// ─── Enable 2FA Modal ─────────────────────────────────────
function Enable2FAModal({ onClose, onEnabled }: { onClose: () => void; onEnabled: () => void }) {
  const [step, setStep] = useState(1)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (code.length !== 6) return
    try {
      setLoading(true)
      await authApi.verify2FASetup(code)
      onEnabled()
    } catch {
      toast.error('Código inválido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      aria-label="Cerrar modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(34,42,104,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        zIndex: 50,
        border: 'none',
        cursor: 'default',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'var(--color-off)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Head */}
        <div style={{ padding: '20px 22px 12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
              Habilitar 2FA
            </h2>
            <span
              style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-muted)' }}
            >
              Paso {step} / 3
            </span>
          </div>
          {/* Stepper */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3].map((s) => (
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
        </div>

        {/* Body */}
        <div style={{ padding: '0 22px 22px' }}>
          {step === 1 && (
            <div>
              <p style={{ fontSize: 13.5, color: 'var(--color-muted)', margin: '0 0 16px' }}>
                Descarga una app autenticadora en tu teléfono.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Google Authenticator', 'Authy', '1Password', 'Microsoft Authenticator'].map(
                  (app) => (
                    <div
                      key={app}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 12px',
                        border: '1px solid var(--color-line)',
                        borderRadius: 8,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            background: 'var(--color-indigo-100)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <Shield size={16} color="var(--color-indigo)" />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-ink)' }}>
                          {app}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ fontSize: 13.5, color: 'var(--color-muted)', margin: '0 0 14px' }}>
                Escanea el código QR con tu app autenticadora:
              </p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* QR placeholder */}
                <div
                  style={{
                    width: 160,
                    height: 160,
                    border: '1px solid var(--color-line)',
                    borderRadius: 10,
                    padding: 10,
                    background: '#fff',
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', textAlign: 'center' }}>
                    QR generado por el servidor
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                    ¿No puedes escanear? Usa la clave manual:
                  </div>
                  <div
                    style={{
                      padding: 10,
                      background: 'var(--color-off-2)',
                      borderRadius: 6,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      wordBreak: 'break-all',
                      border: '1px solid var(--color-line)',
                      color: 'var(--color-ink)',
                    }}
                  >
                    JBSW Y3DP EHPK 3PXP
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p style={{ fontSize: 13.5, color: 'var(--color-muted)', margin: '0 0 14px' }}>
                Introduce el código de 6 dígitos de tu app:
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                style={{
                  ...inputStyle,
                  fontSize: 24,
                  textAlign: 'center',
                  letterSpacing: '0.3em',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '8px 0 0' }}>
                El código cambia cada 30 segundos.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid var(--color-line)',
            background: 'var(--color-off-2)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                padding: '8px 14px',
                background: 'transparent',
                border: 'none',
                fontSize: 13.5,
                color: 'var(--color-ink-2)',
                cursor: 'pointer',
              }}
            >
              ← Atrás
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: 'var(--color-off)',
              border: '1px solid var(--color-line-2)',
              borderRadius: 6,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--color-ink)',
            }}
          >
            Cancelar
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              style={{
                padding: '8px 16px',
                background: 'var(--color-indigo)',
                border: 'none',
                borderRadius: 6,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || code.length !== 6}
              style={{
                padding: '8px 16px',
                background: 'var(--color-indigo)',
                border: 'none',
                borderRadius: 6,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                color: '#fff',
                opacity: code.length !== 6 ? 0.5 : 1,
              }}
            >
              {loading ? 'Activando...' : 'Activar 2FA'}
            </button>
          )}
        </div>
      </div>
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [showEnable2FA, setShowEnable2FA] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  const twoFAEnabled = user?.twoFactorEnabled ?? false

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PwFormValues>({
    resolver: zodResolver(pwSchema),
  })

  const onChangePassword = async (data: PwFormValues) => {
    try {
      setPwLoading(true)
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Contraseña actualizada correctamente')
      reset()
    } catch {
      toast.error('Contraseña actual incorrecta')
    } finally {
      setPwLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    try {
      await authApi.disable2FA('')
      updateUser({ twoFactorEnabled: false })
      toast.success('2FA deshabilitado')
    } catch {
      toast.error('Error al deshabilitar 2FA')
    }
  }

  const sessions = [
    {
      device: 'MacBook Pro · Laptop',
      location: 'Santo Domingo · DO',
      current: true,
      time: 'ahora',
      icon: <Monitor size={15} />,
    },
    {
      device: 'iPhone · Safari',
      location: 'Santo Domingo · DO',
      current: false,
      time: 'hace 3 h',
      icon: <Smartphone size={15} />,
    },
    {
      device: 'Windows · Laptop',
      location: 'Santiago · DO',
      current: false,
      time: 'hace 2 días',
      icon: <Laptop size={15} />,
    },
  ]

  return (
    <>
      <Topbar title="Seguridad" crumbs={['Cuenta', 'Seguridad']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 48px' }}>
        <PageHeader
          title="Seguridad"
          subtitle="Autenticación de dos factores, contraseña y sesiones activas."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
          {/* 2FA Section */}
          <div
            style={{
              background: 'var(--color-off)',
              border: '1px solid var(--color-line)',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 4,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3
                    style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}
                  >
                    App autenticadora
                  </h3>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      fontSize: 11.5,
                      fontWeight: 600,
                      borderRadius: 999,
                      background: twoFAEnabled ? 'var(--color-sage-50)' : 'var(--color-off-2)',
                      color: twoFAEnabled ? '#4d6a55' : 'var(--color-muted)',
                    }}
                  >
                    <span
                      style={{ width: 5, height: 5, borderRadius: 999, background: 'currentColor' }}
                    />
                    {twoFAEnabled ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0 }}>
                  Google Authenticator, Authy, 1Password…
                </p>
              </div>
              {twoFAEnabled ? (
                <button
                  type="button"
                  onClick={handleDisable2FA}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    background: 'transparent',
                    border: '1px solid var(--color-danger)',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'var(--color-danger)',
                  }}
                >
                  <ShieldOff size={14} /> Deshabilitar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowEnable2FA(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    background: 'var(--color-indigo)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <ShieldCheck size={14} /> Habilitar 2FA
                </button>
              )}
            </div>
          </div>

          {/* Change password */}
          <div
            style={{
              background: 'var(--color-off)',
              border: '1px solid var(--color-line)',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--color-ink)',
                margin: '0 0 16px',
              }}
            >
              Cambiar contraseña
            </h3>
            <form
              onSubmit={handleSubmit(onChangePassword)}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="currentPassword" style={labelStyle}>
                  Contraseña actual
                </label>
                <input
                  id="currentPassword"
                  {...register('currentPassword')}
                  type="password"
                  placeholder="••••••••"
                  style={inputStyle}
                />
                {errors.currentPassword && (
                  <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                    {errors.currentPassword.message}
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="newPassword" style={labelStyle}>
                    Nueva contraseña
                  </label>
                  <input
                    id="newPassword"
                    {...register('newPassword')}
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    style={inputStyle}
                  />
                  {errors.newPassword && (
                    <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                      {errors.newPassword.message}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="confirmPassword" style={labelStyle}>
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Repite la contraseña"
                    style={inputStyle}
                  />
                  {errors.confirmPassword && (
                    <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={pwLoading}
                style={{
                  padding: '10px 20px',
                  background: 'var(--color-indigo)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                  opacity: pwLoading ? 0.7 : 1,
                }}
              >
                {pwLoading ? 'Guardando...' : 'Actualizar contraseña'}
              </button>
            </form>
          </div>

          {/* Active sessions */}
          <div
            style={{
              background: 'var(--color-off)',
              border: '1px solid var(--color-line)',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--color-ink)',
                margin: '0 0 16px',
              }}
            >
              Sesiones activas
            </h3>
            <div>
              {sessions.map((s, i) => (
                <div
                  key={s.device}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--color-line)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: 'var(--color-off-2)',
                        color: 'var(--color-ink-2)',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-ink)' }}>
                          {s.device}
                        </span>
                        {s.current && (
                          <span
                            style={{
                              padding: '1px 6px',
                              fontSize: 11,
                              fontWeight: 600,
                              borderRadius: 999,
                              background: 'var(--color-indigo-100)',
                              color: 'var(--color-indigo)',
                            }}
                          >
                            Esta sesión
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--color-muted)', marginTop: 2 }}>
                        {s.location} · {s.time}
                      </div>
                    </div>
                  </div>
                  {!s.current && (
                    <button
                      type="button"
                      style={{
                        padding: '5px 10px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: 12.5,
                        color: 'var(--color-danger)',
                        cursor: 'pointer',
                      }}
                    >
                      Revocar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showEnable2FA && (
        <Enable2FAModal
          onClose={() => setShowEnable2FA(false)}
          onEnabled={() => {
            updateUser({ twoFactorEnabled: true })
            setShowEnable2FA(false)
            toast.success('2FA habilitado correctamente')
          }}
        />
      )}
    </>
  )
}
