'use client'

import { Shield } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { authApi } from '@/lib/api/auth.api'

interface Enable2FAModalProps {
  onClose: () => void
  onEnabled: () => void
}

const inputStyle = {
  width: '100%',
  padding: '14px 12px',
  background: 'var(--color-off)',
  border: '1px solid var(--color-line-2)',
  borderRadius: 6,
  fontSize: 24,
  fontWeight: 700,
  textAlign: 'center' as const,
  letterSpacing: '0.3em',
  fontFamily: 'var(--font-mono)',
  color: 'var(--color-ink)',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

export function Enable2FAModal({ onClose, onEnabled }: Enable2FAModalProps) {
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
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        border: '1px solid var(--color-line)',
                        borderRadius: 8,
                      }}
                    >
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
                    QR del servidor
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Clave manual:</div>
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
                style={inputStyle}
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
