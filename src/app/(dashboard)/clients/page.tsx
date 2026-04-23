'use client'

import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Clock, Search, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/page-header'
import { Topbar } from '@/components/common/topbar'
import { ClientProfileDrawer } from '@/components/features/profiles/client-profile-drawer'
import { profilesApi } from '@/lib/api/profiles.api'
import { useUsers } from '@/lib/hooks/use-users'
import type { UserSummary } from '@/lib/types/user.types'

export default function ClientsPage() {
  const queryClient = useQueryClient()
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<UserSummary | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const { data, isLoading } = useUsers({ role: 'CLIENT', limit: 100 })

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

  const handleApprove = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setApprovingId(userId)
      await profilesApi.approveClientProfile(userId)
      toast.success('Perfil aprobado correctamente')
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch {
      toast.error('Error al aprobar el perfil')
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <>
      <Topbar title="Clientes" crumbs={['Administración', 'Clientes']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 48px' }}>
        <PageHeader title="Clientes" subtitle={`${data?.total ?? 0} clientes registrados`} />

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
              placeholder="Buscar clientes…"
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
                {['Cliente', 'Email', 'Perfil', 'Estado cuenta', ''].map((h) => (
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
                    Cargando clientes...
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
                    No se encontraron clientes.
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
                            background: 'linear-gradient(135deg, var(--color-sage), #4d6a55)',
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
                      <ClientProfileStatus userId={user.id} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '2px 8px',
                          fontSize: 11.5,
                          fontWeight: 600,
                          borderRadius: 999,
                          background:
                            user.status === 'active'
                              ? 'var(--color-sage-50)'
                              : 'var(--color-warn-50)',
                          color: user.status === 'active' ? '#4d6a55' : 'var(--color-warn)',
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: 999,
                            background: 'currentColor',
                          }}
                        />
                        {user.status === 'active' ? 'Activo' : 'Pendiente'}
                      </span>
                    </td>
                    <td
                      style={{ padding: '12px 16px', textAlign: 'right' }}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleApprove(user.id, e)}
                        disabled={approvingId === user.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '5px 10px',
                          background: 'var(--color-indigo-100)',
                          color: 'var(--color-indigo)',
                          border: 'none',
                          borderRadius: 5,
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <CheckCircle size={13} />
                        {approvingId === user.id ? 'Aprobando...' : 'Aprobar'}
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
          Mostrando {filtered.length} de {data?.total ?? 0} clientes
        </div>
      </div>

      {selected && <ClientProfileDrawer user={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

// ─── Inline profile status indicator ─────────────────────
function ClientProfileStatus({ userId }: { userId: string }) {
  const [status, setStatus] = useState<'loading' | 'approved' | 'pending' | 'none'>('loading')

  useState(() => {
    profilesApi
      .getClientProfileByUserId(userId)
      .then((p) => setStatus(p.isApproved ? 'approved' : 'pending'))
      .catch(() => setStatus('none'))
  })

  if (status === 'loading')
    return <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>...</span>
  if (status === 'none')
    return <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Sin perfil</span>

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
        background: status === 'approved' ? 'var(--color-sage-50)' : 'var(--color-warn-50)',
        color: status === 'approved' ? '#4d6a55' : 'var(--color-warn)',
      }}
    >
      {status === 'approved' ? <CheckCircle size={11} /> : <Clock size={11} />}
      {status === 'approved' ? 'Aprobado' : 'Pendiente'}
    </span>
  )
}
