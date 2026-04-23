'use client'

import { ScrollText, X } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Topbar } from '@/components/common/topbar'
import { useAuditLogs } from '@/lib/hooks/use-audit'

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

function ActionBadge({ action }: { action: string }) {
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

const RESOURCES = ['USER', 'CLIENT_PROFILE', 'DRIVER_PROFILE', 'TRUCK', 'ORDER']
const ACTIONS = Object.keys(ACTION_COLORS)

export default function AuditPage() {
  const [actionFilter, setActionFilter] = useState('')
  const [resourceFilter, setResourceFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAuditLogs({
    action: actionFilter || undefined,
    resource: resourceFilter || undefined,
    page,
    limit: 30,
  })

  const hasFilters = actionFilter || resourceFilter

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
      <Topbar title="Auditoría" crumbs={['Administración', 'Auditoría']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 48px' }}>
        <PageHeader
          title="Logs de auditoría"
          subtitle="Registro de todas las acciones del sistema."
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
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value)
              setPage(1)
            }}
            style={{ ...selectStyle, width: 220 }}
          >
            <option value="">Acción: Todas</option>
            {ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          <select
            value={resourceFilter}
            onChange={(e) => {
              setResourceFilter(e.target.value)
              setPage(1)
            }}
            style={{ ...selectStyle, width: 180 }}
          >
            <option value="">Recurso: Todos</option>
            {RESOURCES.map((r) => (
              <option key={r} value={r}>
                {r.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setActionFilter('')
                setResourceFilter('')
                setPage(1)
              }}
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
                {['Fecha', 'Acción', 'Recurso', 'ID recurso', 'IP', 'Metadata'].map((h) => (
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
                    colSpan={6}
                    style={{
                      padding: '32px 16px',
                      textAlign: 'center',
                      color: 'var(--color-muted)',
                      fontSize: 13,
                    }}
                  >
                    Cargando logs...
                  </td>
                </tr>
              ) : data?.logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'var(--color-indigo-100)',
                        color: 'var(--color-indigo)',
                        display: 'grid',
                        placeItems: 'center',
                        margin: '0 auto 12px',
                      }}
                    >
                      <ScrollText size={22} />
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--color-ink)', marginBottom: 4 }}>
                      No hay logs
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                      Las acciones del sistema aparecerán aquí.
                    </div>
                  </td>
                </tr>
              ) : (
                data?.logs.map((log, i) => (
                  <tr
                    key={log.id}
                    style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-line)' }}
                  >
                    <td
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11.5,
                        color: 'var(--color-muted)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {new Date(log.createdAt).toLocaleString('es-DO')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <ActionBadge action={log.action} />
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11.5,
                        color: 'var(--color-ink-2)',
                      }}
                    >
                      {log.resource}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--color-muted)',
                        maxWidth: 120,
                      }}
                    >
                      <span
                        style={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {log.resourceId ?? '—'}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--color-muted)',
                      }}
                    >
                      {log.ipAddress ?? '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {log.metadata ? (
                        <details>
                          <summary
                            style={{
                              fontSize: 12,
                              color: 'var(--color-indigo)',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            Ver datos
                          </summary>
                          <pre
                            style={{
                              fontSize: 11,
                              color: 'var(--color-ink-2)',
                              background: 'var(--color-off-2)',
                              padding: '6px 8px',
                              borderRadius: 6,
                              margin: '6px 0 0',
                              maxWidth: 280,
                              overflow: 'auto',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>—</span>
                      )}
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
          }}
        >
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--color-muted)' }}
          >
            {data ? `Página ${data.page} de ${data.totalPages} · ${data.total} logs` : ''}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              style={{
                padding: '7px 14px',
                background: 'var(--color-off)',
                border: '1px solid var(--color-line-2)',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--color-ink)',
                opacity: page === 1 ? 0.4 : 1,
              }}
            >
              ‹ Anterior
            </button>
            <button
              type="button"
              disabled={page >= (data?.totalPages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: '7px 14px',
                background: 'var(--color-off)',
                border: '1px solid var(--color-line-2)',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--color-ink)',
                opacity: page >= (data?.totalPages ?? 1) ? 0.4 : 1,
              }}
            >
              Siguiente ›
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
