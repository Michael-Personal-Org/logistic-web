'use client'

import { ShieldCheck, ShieldOff } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/lib/stores/auth.store'
import { Enable2FAModal } from './enable-2fa-modal'

export function TwoFactorSection() {
  const { user, updateUser } = useAuthStore()
  const [showEnable, setShowEnable] = useState(false)
  const twoFAEnabled = user?.twoFactorEnabled ?? false

  const handleDisable = async () => {
    try {
      await authApi.disable2FA('')
      updateUser({ twoFactorEnabled: false })
      toast.success('2FA deshabilitado')
    } catch {
      toast.error('Error al deshabilitar 2FA')
    }
  }

  return (
    <>
      <div
        style={{
          background: 'var(--color-off)',
          border: '1px solid var(--color-line)',
          borderRadius: 10,
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
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
              onClick={handleDisable}
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
              onClick={() => setShowEnable(true)}
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

      {showEnable && (
        <Enable2FAModal
          onClose={() => setShowEnable(false)}
          onEnabled={() => {
            updateUser({ twoFactorEnabled: true })
            setShowEnable(false)
            toast.success('2FA habilitado correctamente')
          }}
        />
      )}
    </>
  )
}
