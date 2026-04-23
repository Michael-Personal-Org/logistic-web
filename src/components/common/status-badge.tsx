import type { UserRole, UserStatus } from '@/lib/types/user.types'

interface BadgeProps {
  children: React.ReactNode
  bg: string
  color: string
  dot?: boolean
}

function Badge({ children, bg, color, dot }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 8px',
        fontSize: 11.5,
        fontWeight: 600,
        borderRadius: 999,
        background: bg,
        color,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: 'currentColor',
          }}
        />
      )}
      {children}
    </span>
  )
}

export function RoleBadge({ value }: { value: UserRole }) {
  const map: Record<UserRole, { bg: string; color: string }> = {
    ADMIN: { bg: 'var(--color-indigo-100)', color: 'var(--color-indigo)' },
    OPERATOR: { bg: 'var(--color-purple-50)', color: 'var(--color-purple)' },
    DRIVER: { bg: 'var(--color-lavender-50)', color: 'var(--color-purple)' },
    CLIENT: { bg: 'var(--color-sage-50)', color: '#4d6a55' },
  }
  const s = map[value]
  return (
    <Badge bg={s.bg} color={s.color}>
      {value}
    </Badge>
  )
}

export function StatusBadge({ value }: { value: UserStatus }) {
  const map: Record<UserStatus, { bg: string; color: string; label: string }> = {
    active: { bg: 'var(--color-sage-50)', color: '#4d6a55', label: 'Activo' },
    pending: { bg: 'var(--color-warn-50)', color: 'var(--color-warn)', label: 'Pendiente' },
    suspended: { bg: 'var(--color-danger-50)', color: 'var(--color-danger)', label: 'Suspendido' },
  }
  const s = map[value]
  return (
    <Badge bg={s.bg} color={s.color} dot>
      {s.label}
    </Badge>
  )
}
