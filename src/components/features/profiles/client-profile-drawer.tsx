'use client'

import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Clock, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/common/status-badge'
import type { ClientProfile } from '@/lib/api/profiles.api'
import { profilesApi } from '@/lib/api/profiles.api'
import type { UserSummary } from '@/lib/types/user.types'

interface ClientProfileDrawerProps {
  user: UserSummary
  onClose: () => void
}

export function ClientProfileDrawer({ user, onClose }: ClientProfileDrawerProps) {
  const queryClient = useQueryClient()
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    profilesApi
      .getClientProfileByUserId(user.id)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [user.id])

  const handleApprove = async () => {
    try {
      setApproving(true)
      await profilesApi.approveClientProfile(user.id)
      toast.success('Perfil aprobado correctamente')
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      if (profile) setProfile({ ...profile, isApproved: true })
    } catch {
      toast.error('Error al aprobar el perfil')
    } finally {
      setApproving(false)
    }
  }

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
                background: 'linear-gradient(135deg, var(--color-sage), #4d6a55)',
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
                padding: 16,
                border: '1px solid var(--color-line)',
                borderRadius: 8,
                textAlign: 'center',
                color: 'var(--color-muted)',
                fontSize: 13,
              }}
            >
              Este cliente aún no ha creado su perfil de empresa.
            </div>
          ) : (
            <>
              {/* Approval status */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: profile.isApproved ? 'var(--color-sage-50)' : 'var(--color-warn-50)',
                  border: `1px solid ${profile.isApproved ? 'var(--color-sage)' : 'var(--color-warn)'}`,
                }}
              >
                {profile.isApproved ? (
                  <CheckCircle size={18} color="#4d6a55" />
                ) : (
                  <Clock size={18} color="var(--color-warn)" />
                )}
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: profile.isApproved ? '#4d6a55' : 'var(--color-warn)',
                    }}
                  >
                    {profile.isApproved ? 'Perfil aprobado' : 'Pendiente de aprobación'}
                  </div>
                  {profile.isApproved && profile.approvedAt && (
                    <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                      {new Date(profile.approvedAt).toLocaleDateString('es-DO')}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile details */}
              <div style={{ padding: 14, border: '1px solid var(--color-line)', borderRadius: 8 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    marginBottom: 10,
                  }}
                >
                  Datos de empresa
                </div>
                {[
                  { label: 'Empresa', value: profile.companyName },
                  { label: 'RNC', value: profile.rnc ?? '—' },
                  { label: 'Contacto', value: profile.emergencyContact ?? '—' },
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
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{ padding: 16, borderTop: '1px solid var(--color-line)', display: 'flex', gap: 8 }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
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
          {profile && !profile.isApproved && (
            <button
              type="button"
              onClick={handleApprove}
              disabled={approving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: 'var(--color-indigo)',
                border: 'none',
                borderRadius: 6,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              <CheckCircle size={14} />
              {approving ? 'Aprobando...' : 'Aprobar perfil'}
            </button>
          )}
        </div>
      </div>
    </button>
  )
}
