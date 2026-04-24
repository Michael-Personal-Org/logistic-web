type ActionBadgeProps = { action: string }

const ACTION_COLORS: Record<string, { bg: string; color: string }> = {
  USER_CREATED: { bg: 'var(--color-sage-50)', color: '#4d6a55' },
  USER_SUSPENDED: { bg: 'var(--color-danger-50)', color: 'var(--color-danger)' },
  USER_REACTIVATED: { bg: 'var(--color-sage-50)', color: '#4d6a55' },
  USER_ROLE_CHANGED: { bg: 'var(--color-indigo-100)', color: 'var(--color-indigo)' },
  USER_DELETED: { bg: 'var(--color-danger-50)', color: 'var(--color-danger)' },
  CLIENT_PROFILE_CREATED: { bg: 'var(--color-indigo-100)', color: 'var(--color-indigo)' },
  CLIENT_PROFILE_APPROVED: { bg: 'var(--color-sage-50)', color: '#4d6a55' },
  DRIVER_PROFILE_CREATED: { bg: 'var(--color-lavender-50)', color: 'var(--color-purple)' },
  TRUCK_CREATED: { bg: 'var(--color-purple-50)', color: 'var(--color-purple)' },
  TRUCK_UPDATED: { bg: 'var(--color-warn-50)', color: 'var(--color-warn)' },
  TRUCK_DELETED: { bg: 'var(--color-danger-50)', color: 'var(--color-danger)' },
  TRUCK_ASSIGNED: { bg: 'var(--color-indigo-100)', color: 'var(--color-indigo)' },
}

export const AUDIT_ACTIONS = Object.keys(ACTION_COLORS)
export const AUDIT_RESOURCES = ['USER', 'CLIENT_PROFILE', 'DRIVER_PROFILE', 'TRUCK', 'ORDER']

export function ActionBadge({ action }: ActionBadgeProps) {
  const s = ACTION_COLORS[action] ?? { bg: 'var(--color-off-2)', color: 'var(--color-muted)' }
  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '2px 8px',
        fontSize: 11.5,
        fontWeight: 600,
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {action.replace(/_/g, ' ')}
    </span>
  )
}
