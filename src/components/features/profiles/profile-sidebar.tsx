import Link from 'next/link'
import { RoleBadge } from '@/components/common/status-badge'
import type { AuthUser } from '@/lib/stores/auth.store'

interface ProfileSidebarProps {
  user: AuthUser
}

export function ProfileSidebar({ user }: ProfileSidebarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* User card */}
      <div
        style={{
          background: 'var(--color-off)',
          border: '1px solid var(--color-line)',
          borderRadius: 10,
          padding: 16,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-lavender), var(--color-purple))',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontSize: 22,
            fontWeight: 700,
            margin: '0 auto 12px',
          }}
        >
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-ink)' }}>
          {user.firstName} {user.lastName}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-muted)', margin: '4px 0 10px' }}>
          {user.email}
        </div>
        <RoleBadge value={user.role} />
      </div>

      {/* 2FA status */}
      <div
        style={{
          background: 'var(--color-off)',
          border: '1px solid var(--color-line)',
          borderRadius: 10,
          padding: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-ink)' }}>2FA</div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 999,
              background: user.twoFactorEnabled ? 'var(--color-sage-50)' : 'var(--color-off-2)',
              color: user.twoFactorEnabled ? '#4d6a55' : 'var(--color-muted)',
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: 999, background: 'currentColor' }} />
            {user.twoFactorEnabled ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '0 0 10px' }}>
          {user.twoFactorEnabled
            ? 'Autenticación de dos factores habilitada.'
            : 'Aumenta la seguridad de tu cuenta.'}
        </p>
        <Link
          href="/settings"
          style={{
            display: 'block',
            padding: '7px 12px',
            background: 'var(--color-off-2)',
            border: '1px solid var(--color-line-2)',
            borderRadius: 6,
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--color-ink)',
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          Gestionar seguridad
        </Link>
      </div>
    </div>
  )
}
