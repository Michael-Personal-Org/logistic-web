'use client'

import { Search, Truck, X } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { StatusBadge } from '@/components/common/status-badge'
import { Topbar } from '@/components/common/topbar'
import { DriverProfileDrawer } from '@/components/features/profiles/driver-profile-drawer'
import { useUsers } from '@/lib/hooks/use-users'
import type { UserSummary } from '@/lib/types/user.types'

export default function DriversPage() {
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<UserSummary | null>(null)

  const { data, isLoading } = useUsers({ role: 'DRIVER', limit: 100 })

  const filtered =
    data?.users.filter((u) => {
      if (!q) return true
      const s = q.toLowerCase()
      return (
        u.firstName.toLowerCase().includes(s) ||
        u.lastName.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s)
      )
    }) ?? []

  return (
    <>
      <Topbar title="Conductores" crumbs={['Administración', 'Conductores']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 48px' }}>
        <PageHeader title="Conductores" subtitle={`${data?.total ?? 0} conductores registrados`} />

        {/* Search */}
        <div
          style={{
            background: 'var(--color-off)',
            border: '1px solid var(--color-line)',
            borderRadius: 10,
            padding: 14,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
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
              placeholder="Buscar conductores…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                background: 'var(--color-off)',
                border: '1px solid var(--color-line-2)',
                borderRadius: 6,
                fontSize: 13,
                color: 'var(--color-ink)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 10px',
                background: 'transparent',
                border: 'none',
                fontSize: 12.5,
                color: 'var(--color-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={13} /> Limpiar
            </button>
          )}
        </div>

        {/* Table */}
        <div
          style={{
            border: '1px solid var(--color-line)',
            borderRadius: 10,
            overflow: 'hidden',
            background: 'var(--color-off)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Conductor', 'Email', 'Estado', 'Alta', ''].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      background: 'var(--color-off-2)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--color-muted)',
                      borderBottom: '1px solid var(--color-line)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: '32px 16px',
                      textAlign: 'center',
                      color: 'var(--color-muted)',
                      fontSize: 13,
                    }}
                  >
                    Cargando conductores...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '48px 16px', textAlign: 'center' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'var(--color-lavender-50)',
                        color: 'var(--color-purple)',
                        display: 'grid',
                        placeItems: 'center',
                        margin: '0 auto 12px',
                      }}
                    >
                      <Truck size={22} />
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--color-ink)', marginBottom: 4 }}>
                      No hay conductores
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                      Crea conductores desde la sección de Usuarios.
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelected(user)}
                    style={{
                      borderTop: i === 0 ? 'none' : '1px solid var(--color-line)',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            background:
                              'linear-gradient(135deg, var(--color-lavender), var(--color-purple))',
                            color: '#fff',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        <span
                          style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-ink)' }}
                        >
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11.5,
                        color: 'var(--color-muted)',
                      }}
                    >
                      {user.email}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <StatusBadge value={user.status} />
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11.5,
                        color: 'var(--color-muted)',
                      }}
                    >
                      {new Date(user.createdAt).toLocaleDateString('es-DO')}
                    </td>
                    <td
                      style={{ padding: '12px 16px', textAlign: 'right' }}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setSelected(user)}
                        style={{
                          padding: '5px 10px',
                          background: 'transparent',
                          border: '1px solid var(--color-line-2)',
                          borderRadius: 5,
                          fontSize: 12.5,
                          color: 'var(--color-ink-2)',
                          cursor: 'pointer',
                        }}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 11.5,
            color: 'var(--color-muted)',
          }}
        >
          Mostrando {filtered.length} de {data?.total ?? 0} conductores
        </div>
      </div>

      {selected && <DriverProfileDrawer user={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
