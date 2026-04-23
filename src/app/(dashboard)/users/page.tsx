'use client'

import { Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { RoleBadge, StatusBadge } from '@/components/common/status-badge'
import { Topbar } from '@/components/common/topbar'
import { CreateUserModal } from '@/components/features/users/create-user-modal'
import { UserDrawer } from '@/components/features/users/user-drawer'
import { useUsers } from '@/lib/hooks/use-users'
import { useAuthStore } from '@/lib/stores/auth.store'
import type { UserRole, UserStatus, UserSummary } from '@/lib/types/user.types'

const btnStyle = (primary?: boolean) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 14px',
  background: primary ? 'var(--color-indigo)' : 'var(--color-off)',
  color: primary ? '#fff' : 'var(--color-ink)',
  border: `1px solid ${primary ? 'var(--color-indigo)' : 'var(--color-line-2)'}`,
  borderRadius: 6,
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
})

export default function UsersPage() {
  const currentUser = useAuthStore((s) => s.user)
  const [q, setQ] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState<UserSummary | null>(null)

  const { data, isLoading } = useUsers({
    role: roleFilter !== 'all' ? roleFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page,
    limit: 20,
  })

  const isAdmin = currentUser?.role === 'ADMIN'
  const hasFilters = q || roleFilter !== 'all' || statusFilter !== 'all'

  const filtered =
    data?.users.filter((u) => {
      if (!q) return true
      const search = q.toLowerCase()
      return (
        u.firstName.toLowerCase().includes(search) ||
        u.lastName.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      )
    }) ?? []

  const selectStyle = {
    padding: '8px 12px',
    background: 'var(--color-off)',
    border: '1px solid var(--color-line-2)',
    borderRadius: 6,
    fontSize: 13,
    color: 'var(--color-ink)',
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <>
      <Topbar title="Usuarios" crumbs={['Administración', 'Usuarios']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 48px' }}>
        <PageHeader
          title="Usuarios"
          subtitle={`${data?.total ?? 0} usuarios en el sistema`}
          actions={
            isAdmin && (
              <button type="button" style={btnStyle(true)} onClick={() => setShowCreate(true)}>
                <Plus size={15} /> Crear usuario
              </button>
            )
          }
        />

        {/* Filters */}
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
            flexWrap: 'wrap',
          }}
        >
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
              placeholder="Buscar por nombre o email…"
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

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            style={{ ...selectStyle, width: 160 }}
          >
            <option value="all">Rol: Todos</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OPERATOR">OPERATOR</option>
            <option value="DRIVER">DRIVER</option>
            <option value="CLIENT">CLIENT</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
            style={{ ...selectStyle, width: 170 }}
          >
            <option value="all">Estado: Todos</option>
            <option value="active">Activo</option>
            <option value="pending">Pendiente</option>
            <option value="suspended">Suspendido</option>
          </select>

          {/* Clear filters */}
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQ('')
                setRoleFilter('all')
                setStatusFilter('all')
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 10px',
                background: 'transparent',
                border: 'none',
                borderRadius: 6,
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
                {['Usuario', 'Rol', 'Estado', 'Alta', ''].map((h) => (
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
                      whiteSpace: 'nowrap',
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
                    Cargando usuarios...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
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
                    No se encontraron usuarios.
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
                    {/* Usuario */}
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
                        <div>
                          <div
                            style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-ink)' }}
                          >
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
                    </td>

                    {/* Rol */}
                    <td style={{ padding: '12px 16px' }}>
                      <RoleBadge value={user.role} />
                    </td>

                    {/* Estado */}
                    <td style={{ padding: '12px 16px' }}>
                      <StatusBadge value={user.status} />
                    </td>

                    {/* Alta */}
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

                    {/* Actions */}
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

        {/* Pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
            fontSize: 12,
          }}
        >
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--color-muted)' }}
          >
            Mostrando {filtered.length} de {data?.total ?? 0}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              style={{ ...btnStyle(), opacity: page === 1 ? 0.4 : 1 }}
            >
              ‹ Anterior
            </button>
            <button
              type="button"
              disabled={page >= (data?.totalPages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
              style={{ ...btnStyle(), opacity: page >= (data?.totalPages ?? 1) ? 0.4 : 1 }}
            >
              Siguiente ›
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} />}
      {selected && (
        <UserDrawer user={selected} onClose={() => setSelected(null)} isAdmin={isAdmin} />
      )}
    </>
  )
}
