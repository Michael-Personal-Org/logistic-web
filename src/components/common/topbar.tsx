'use client'

import { Bell, ChevronDown, LogOut, Search, Settings, Shield, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/lib/stores/auth.store'

interface TopbarProps {
  title?: string
  crumbs?: string[]
}

export function Topbar({ title, crumbs }: TopbarProps) {
  const router = useRouter()
  const { user, accessToken, clearSession } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U'

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Usuario'

  const handleLogout = async () => {
    try {
      if (accessToken) await authApi.logout(accessToken)
    } catch {
      // Si falla el logout en el servidor, igual limpiamos local
    } finally {
      clearSession()
      router.push('/login')
    }
  }

  return (
    <div
      style={{
        height: 56,
        borderBottom: '1px solid var(--color-line)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--color-off)',
        flexShrink: 0,
      }}
    >
      {/* Breadcrumbs */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-muted)' }}>
        {crumbs ? (
          crumbs.map((crumb, i) => (
            <span key={crumb}>
              {i > 0 && <span style={{ margin: '0 6px', opacity: 0.5 }}>/</span>}
              {i === crumbs.length - 1 ? (
                <b
                  style={{
                    color: 'var(--color-ink)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                  }}
                >
                  {crumb}
                </b>
              ) : (
                <span>{crumb}</span>
              )}
            </span>
          ))
        ) : (
          <b style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
            {title}
          </b>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ position: 'relative', width: 280 }}>
        <Search
          size={15}
          color="var(--color-muted)"
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="search"
          placeholder="Buscar órdenes, usuarios…"
          style={{
            width: '100%',
            padding: '7px 12px 7px 32px',
            background: 'var(--color-off-2)',
            border: '1px solid transparent',
            borderRadius: 6,
            fontSize: 13,
            color: 'var(--color-ink)',
            outline: 'none',
          }}
        />
      </div>

      {/* Notifications */}
      <button
        type="button"
        style={{
          width: 34,
          height: 34,
          display: 'grid',
          placeItems: 'center',
          background: 'transparent',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          color: 'var(--color-ink-2)',
        }}
        aria-label="Notificaciones"
      >
        <Bell size={16} />
      </button>

      {/* User menu */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 6,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-lavender), var(--color-purple))',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontSize: 12.5,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-ink)' }}>
              {fullName}
            </div>
            <div
              style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-muted)' }}
            >
              {user?.role}
            </div>
          </div>
          <ChevronDown size={14} color="var(--color-muted)" />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 30,
                background: 'transparent',
                border: 'none',
                cursor: 'default',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                zIndex: 31,
                minWidth: 220,
                background: 'var(--color-off)',
                border: '1px solid var(--color-line)',
                borderRadius: 10,
                padding: 6,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '10px 10px 12px',
                  borderBottom: '1px solid var(--color-line)',
                  marginBottom: 6,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-ink)' }}>
                  {fullName}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--color-muted)',
                  }}
                >
                  {user?.email}
                </div>
              </div>

              {/* Items */}
              {[
                { icon: <User size={15} />, label: 'Mi perfil', href: '/profile' },
                { icon: <Shield size={15} />, label: 'Seguridad', href: '/settings' },
                { icon: <Settings size={15} />, label: 'Preferencias', href: '/settings' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    router.push(item.href)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 6,
                    fontSize: 13.5,
                    color: 'var(--color-ink-2)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}

              <div style={{ height: 1, background: 'var(--color-line)', margin: '6px -6px' }} />

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  fontSize: 13.5,
                  color: 'var(--color-danger)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LogOut size={15} /> Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
