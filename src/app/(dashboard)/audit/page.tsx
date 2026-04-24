'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Topbar } from '@/components/common/topbar'
import { AUDIT_ACTIONS, AUDIT_RESOURCES } from '@/components/features/audit/action-badge'
import { AuditTable } from '@/components/features/audit/audit-table'
import { useAuditLogs } from '@/lib/hooks/use-audit'

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

const btnStyle = {
  padding: '7px 14px',
  background: 'var(--color-off)',
  border: '1px solid var(--color-line-2)',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--color-ink)',
}

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
            {AUDIT_ACTIONS.map((a) => (
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
            {AUDIT_RESOURCES.map((r) => (
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

        <AuditTable logs={data?.logs ?? []} isLoading={isLoading} />

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
              style={{ ...btnStyle, opacity: page === 1 ? 0.4 : 1 }}
            >
              ‹ Anterior
            </button>
            <button
              type="button"
              disabled={page >= (data?.totalPages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
              style={{ ...btnStyle, opacity: page >= (data?.totalPages ?? 1) ? 0.4 : 1 }}
            >
              Siguiente ›
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
