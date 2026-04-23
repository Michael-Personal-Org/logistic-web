'use client'

import {
  ClipboardList,
  LayoutDashboard,
  Package,
  Route,
  ScrollText,
  Shield,
  Truck,
  User,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/common/logo'
import { useAuthStore } from '@/lib/stores/auth.store'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  badge?: string
  roles?: string[]
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard size={16} />,
        href: '/dashboard',
      },
      {
        id: 'orders',
        label: 'Órdenes',
        icon: <Package size={16} />,
        href: '/orders',
        badge: '14',
      },
      {
        id: 'trucks',
        label: 'Camiones',
        icon: <Truck size={16} />,
        href: '/trucks',
        roles: ['ADMIN', 'OPERATOR', 'DRIVER'],
      },
    ],
  },
  {
    label: 'Administración',
    items: [
      {
        id: 'users',
        label: 'Usuarios',
        icon: <Users size={16} />,
        href: '/users',
        roles: ['ADMIN', 'OPERATOR'],
      },
      {
        id: 'clients',
        label: 'Clientes',
        icon: <ClipboardList size={16} />,
        href: '/clients',
        roles: ['ADMIN', 'OPERATOR'],
      },
      {
        id: 'drivers',
        label: 'Conductores',
        icon: <Route size={16} />,
        href: '/drivers',
        roles: ['ADMIN', 'OPERATOR'],
      },
      {
        id: 'audit',
        label: 'Auditoría',
        icon: <ScrollText size={16} />,
        href: '/audit',
        roles: ['ADMIN'],
      },
    ],
  },
  {
    label: 'Cuenta',
    items: [
      {
        id: 'profile',
        label: 'Mi perfil',
        icon: <User size={16} />,
        href: '/profile',
      },
      {
        id: 'settings',
        label: 'Seguridad',
        icon: <Shield size={16} />,
        href: '/settings',
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const role = user?.role ?? 'CLIENT'

  return (
    <aside
      style={{
        background: 'var(--color-off)',
        borderRight: '1px solid var(--color-line)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 12px',
        gap: 16,
        overflowY: 'auto',
        width: 240,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '4px 8px' }}>
        <Logo />
      </div>

      {/* Nav groups */}
      {navGroups.map((group) => {
        const visibleItems = group.items.filter((item) => !item.roles || item.roles.includes(role))
        if (visibleItems.length === 0) return null

        return (
          <div key={group.label}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-muted)',
                padding: '8px 10px 4px',
              }}
            >
              {group.label}
            </div>
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 6,
                    color: isActive ? 'var(--color-indigo)' : 'var(--color-ink-2)',
                    fontSize: 13.5,
                    fontWeight: isActive ? 600 : 500,
                    background: isActive ? 'var(--color-indigo-100)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'background .12s, color .12s',
                  }}
                >
                  <span
                    style={{
                      color: isActive ? 'var(--color-indigo)' : 'var(--color-muted)',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--color-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        )
      })}

      {/* Status indicator */}
      <div style={{ marginTop: 'auto' }}>
        <div
          style={{
            background: 'var(--color-off-2)',
            padding: 12,
            borderRadius: 10,
            fontSize: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: 'var(--color-sage)',
                flexShrink: 0,
              }}
            />
            <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-ink)' }}>
              Estado: operacional
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--color-muted)',
            }}
          >
            v1.0.0-beta
          </div>
        </div>
      </div>
    </aside>
  )
}
