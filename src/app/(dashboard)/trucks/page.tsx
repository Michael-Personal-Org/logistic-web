'use client'

import { Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Topbar } from '@/components/common/topbar'
import { CreateTruckModal } from '@/components/features/trucks/create-truck-modal'
import { TruckDrawer } from '@/components/features/trucks/truck-drawer'
import { TrucksTable } from '@/components/features/trucks/trucks-table'
import { useTrucks } from '@/lib/hooks/use-trucks'
import { useAuthStore } from '@/lib/stores/auth.store'
import type { CargoType, Truck } from '@/lib/types/truck.types'

const CARGO_COLORS: Record<CargoType, { bg: string; color: string }> = {
  GENERAL: { bg: 'var(--color-indigo-100)', color: 'var(--color-indigo)' },
  FRAGILE: { bg: 'var(--color-warn-50)', color: 'var(--color-warn)' },
  CHEMICAL: { bg: 'var(--color-danger-50)', color: 'var(--color-danger)' },
  TEXTILE: { bg: 'var(--color-lavender-50)', color: 'var(--color-purple)' },
  REFRIGERATED: { bg: 'var(--color-sage-50)', color: '#4d6a55' },
  HAZARDOUS: { bg: 'var(--color-danger-50)', color: 'var(--color-danger)' },
}

const CARGO_LABELS: Record<CargoType, string> = {
  GENERAL: 'General',
  FRAGILE: 'Frágil',
  CHEMICAL: 'Químico',
  TEXTILE: 'Textil',
  REFRIGERATED: 'Refrigerado',
  HAZARDOUS: 'Peligroso',
}

export function CargoBadge({ type }: { type: CargoType }) {
  const s = CARGO_COLORS[type]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        fontSize: 11.5,
        fontWeight: 600,
        borderRadius: 999,
        background: s.bg,
        color: s.color,
      }}
    >
      {CARGO_LABELS[type]}
    </span>
  )
}

export default function TrucksPage() {
  const user = useAuthStore((s) => s.user)
  const [q, setQ] = useState('')
  const [availFilter, setAvailFilter] = useState<'all' | 'true' | 'false'>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState<Truck | null>(null)

  const isStaff = user?.role === 'ADMIN' || user?.role === 'OPERATOR'
  const isAdmin = user?.role === 'ADMIN'

  const { data, isLoading } = useTrucks({
    isAvailable: availFilter === 'all' ? undefined : availFilter === 'true',
    limit: 50,
  })

  const filtered =
    data?.trucks.filter((t) => {
      if (!q) return true
      const s = q.toLowerCase()
      return t.plateNumber.toLowerCase().includes(s) || t.model.toLowerCase().includes(s)
    }) ?? []

  return (
    <>
      <Topbar title="Camiones" crumbs={['Flota', 'Camiones']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 48px' }}>
        <PageHeader
          title="Camiones"
          subtitle={`${data?.total ?? 0} camiones en la flota`}
          actions={
            isStaff ? (
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  background: 'var(--color-indigo)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Plus size={15} /> Registrar camión
              </button>
            ) : undefined
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
              placeholder="Buscar por placa o modelo…"
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
          <select
            value={availFilter}
            onChange={(e) => setAvailFilter(e.target.value as 'all' | 'true' | 'false')}
            style={{
              padding: '8px 12px',
              background: 'var(--color-off)',
              border: '1px solid var(--color-line-2)',
              borderRadius: 6,
              fontSize: 13,
              color: 'var(--color-ink)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Disponibilidad: Todos</option>
            <option value="true">Disponibles</option>
            <option value="false">Ocupados</option>
          </select>
          {(q || availFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setQ('')
                setAvailFilter('all')
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

        <TrucksTable
          trucks={filtered}
          isLoading={isLoading}
          isStaff={isStaff}
          onSelect={setSelected}
        />

        <div
          style={{
            marginTop: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 11.5,
            color: 'var(--color-muted)',
          }}
        >
          Mostrando {filtered.length} de {data?.total ?? 0} camiones
        </div>
      </div>

      {showCreate && <CreateTruckModal onClose={() => setShowCreate(false)} />}
      {selected && (
        <TruckDrawer
          truck={selected}
          onClose={() => setSelected(null)}
          isStaff={isStaff}
          isAdmin={isAdmin}
        />
      )}
    </>
  )
}
