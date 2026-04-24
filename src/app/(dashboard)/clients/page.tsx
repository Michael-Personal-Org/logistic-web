'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Topbar } from '@/components/common/topbar'
import { ClientsTable } from '@/components/features/clients/clients-table'
import { ClientProfileDrawer } from '@/components/features/profiles/client-profile-drawer'
import { useUsers } from '@/lib/hooks/use-users'
import type { UserSummary } from '@/lib/types/user.types'

export default function ClientsPage() {
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<UserSummary | null>(null)
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

  return (
    <>
      <Topbar title="Clientes" crumbs={['Administración', 'Clientes']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 48px' }}>
        <PageHeader title="Clientes" subtitle={`${data?.total ?? 0} clientes registrados`} />

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

        <ClientsTable users={filtered} isLoading={isLoading} onSelect={setSelected} />

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
