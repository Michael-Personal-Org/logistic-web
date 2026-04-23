'use client'

import { Truck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { StatusBadge } from '@/components/common/status-badge'
import type { DriverProfile } from '@/lib/api/profiles.api'
import { profilesApi } from '@/lib/api/profiles.api'
import type { UserSummary } from '@/lib/types/user.types'

interface DriverProfileDrawerProps {
  user: UserSummary
  onClose: () => void
}

export function DriverProfileDrawer({ user, onClose }: DriverProfileDrawerProps) {
  const [profile, setProfile] = useState<DriverProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    profilesApi
      .getDriverProfileByUserId(user.id)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [user.id])

  return (
    <button
      type="button"
      aria-label="Cerrar panel"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(34,42,104,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 50,
        border: 'none',
        cursor: 'default',
        width: '100%',
      }}
    >
      <div
        style={{
          width: 420,
          height: '100%',
          background: 'var(--color-off)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Head */}
        <div
          style={{
            padding: 20,
            borderBottom: '1px solid var(--color-line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-lavender), var(--color-purple))',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: 14,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-ink)' }}>
                {user.firstName} {user.lastName}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--color-muted)',
                }}
              >
                {user.email}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-muted)',
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <StatusBadge value={user.status} />

          {loading ? (
            <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>Cargando perfil...</div>
          ) : !profile ? (
            <div
              style={{
                padding: 24,
                border: '1px solid var(--color-line)',
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'var(--color-lavender-50)',
                  color: 'var(--color-purple)',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 10px',
                }}
              >
                <Truck size={18} />
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: 'var(--color-ink)',
                  marginBottom: 4,
                }}
              >
                Sin perfil de conductor
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                El conductor aún no ha completado su perfil.
              </div>
            </div>
          ) : (
            <div style={{ padding: 14, border: '1px solid var(--color-line)', borderRadius: 8 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  marginBottom: 10,
                }}
              >
                Datos de conductor
              </div>
              {[
                { label: 'Placa', value: profile.vehiclePlate },
                { label: 'Licencia', value: profile.licenseNumber },
                { label: 'Tipo', value: `Tipo ${profile.licenseType}` },
                {
                  label: 'Disponible',
                  value: profile.isAvailable ? 'Sí' : 'No',
                },
                {
                  label: 'Registro',
                  value: new Date(profile.createdAt).toLocaleDateString('es-DO'),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: 'flex', gap: 8, fontSize: 13, marginBottom: 8 }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-muted)',
                      width: 80,
                      flexShrink: 0,
                    }}
                  >
                    {item.label}
                  </span>
                  <span style={{ color: 'var(--color-ink)', fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: 16, borderTop: '1px solid var(--color-line)' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
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
            Cerrar
          </button>
        </div>
      </div>
    </button>
  )
}
