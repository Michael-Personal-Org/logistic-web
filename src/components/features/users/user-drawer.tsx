'use client'

import { Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { RoleBadge, StatusBadge } from '@/components/common/status-badge'
import { useChangeUserRole, useUpdateUserStatus } from '@/lib/hooks/use-users'
import type { UserRole, UserSummary } from '@/lib/types/user.types'

interface UserDrawerProps {
  user: UserSummary
  onClose: () => void
  isAdmin: boolean
}

const ROLES: UserRole[] = ['CLIENT', 'DRIVER', 'OPERATOR']

export function UserDrawer({ user, onClose, isAdmin }: UserDrawerProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role)
  const updateStatus = useUpdateUserStatus()
  const changeRole = useChangeUserRole()

  const isActive = user.status === 'active'
  const isAdminUser = user.role === 'ADMIN'

  const handleStatusToggle = async () => {
    if (isAdminUser) {
      toast.error('No se puede modificar el estado de un administrador')
      return
    }
    await updateStatus.mutateAsync({
      userId: user.id,
      status: isActive ? 'suspended' : 'active',
    })
    onClose()
  }

  const handleRoleChange = async () => {
    if (selectedRole === user.role) return
    await changeRole.mutateAsync({ userId: user.id, role: selectedRole })
    onClose()
  }

  return (
    <button
      type="button"
      aria-label="Cerrar panel"
      onClick={onClose}
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
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
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
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <RoleBadge value={user.role} />
            <StatusBadge value={user.status} />
          </div>

          {/* Info */}
          <div
            style={{
              padding: 14,
              border: '1px solid var(--color-line)',
              borderRadius: 8,
              fontSize: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <span
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', width: 80 }}
              >
                Alta
              </span>
              <span style={{ color: 'var(--color-ink)' }}>
                {new Date(user.createdAt).toLocaleDateString('es-DO')}
              </span>
            </div>
          </div>

          {/* Change role */}
          {isAdmin && !isAdminUser && (
            <div style={{ padding: 14, border: '1px solid var(--color-line)', borderRadius: 8 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  marginBottom: 10,
                }}
              >
                Cambiar rol
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: 10,
                      textAlign: 'left',
                      border: `1px solid ${selectedRole === r ? 'var(--color-indigo)' : 'var(--color-line)'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: selectedRole === r ? 'var(--color-indigo-50)' : 'transparent',
                    }}
                  >
                    <RoleBadge value={r} />
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '8px 0 0' }}>
                ADMIN no es asignable desde esta vista.
              </p>
              {selectedRole !== user.role && (
                <button
                  type="button"
                  onClick={handleRoleChange}
                  disabled={changeRole.isPending}
                  style={{
                    marginTop: 10,
                    width: '100%',
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
                  {changeRole.isPending ? 'Guardando...' : 'Guardar cambio de rol'}
                </button>
              )}
            </div>
          )}

          {/* Toggle status */}
          {isAdmin && !isAdminUser && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                border: '1px solid var(--color-line)',
                borderRadius: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-ink)' }}>
                  {isActive ? 'Cuenta activa' : 'Cuenta suspendida'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                  {isActive ? 'Puede iniciar sesión' : 'Acceso bloqueado'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleStatusToggle}
                disabled={updateStatus.isPending}
                aria-label={isActive ? 'Suspender cuenta' : 'Reactivar cuenta'}
                style={{
                  position: 'relative',
                  width: 38,
                  height: 22,
                  background: isActive ? 'var(--color-sage)' : 'var(--color-line-2)',
                  borderRadius: 999,
                  cursor: 'pointer',
                  border: 'none',
                  flexShrink: 0,
                  transition: 'background .2s',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: isActive ? 18 : 2,
                    width: 18,
                    height: 18,
                    background: '#fff',
                    borderRadius: '50%',
                    transition: 'left .2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }}
                />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 16,
            borderTop: '1px solid var(--color-line)',
            display: 'flex',
            gap: 8,
          }}
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
          {isAdmin && !isAdminUser && (
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: 'transparent',
                border: '1px solid var(--color-danger)',
                borderRadius: 6,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--color-danger)',
              }}
            >
              <Trash2 size={14} /> Eliminar
            </button>
          )}
        </div>
      </div>
    </button>
  )
}
