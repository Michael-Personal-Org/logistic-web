'use client'

import { ScrollText } from 'lucide-react'
import type { AuditLog } from '@/lib/api/audit.api'
import { ActionBadge } from './action-badge'

interface AuditTableProps {
  logs: AuditLog[]
  isLoading: boolean
}

const thStyle = {
  textAlign: 'left' as const,
  padding: '12px 16px',
  background: 'var(--color-off-2)',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  color: 'var(--color-muted)',
  borderBottom: '1px solid var(--color-line)',
  whiteSpace: 'nowrap' as const,
}

export function AuditTable({ logs, isLoading }: AuditTableProps) {
  return (
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
              <th key={h} style={thStyle}>
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
          ) : logs.length === 0 ? (
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
            logs.map((log, i) => (
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
  )
}
