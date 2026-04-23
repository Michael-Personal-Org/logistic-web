'use client'

import { Plus, Search, Truck, X } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Topbar } from '@/components/common/topbar'
import { CreateTruckModal } from '@/components/features/trucks/create-truck-modal'
import { TruckDrawer } from '@/components/features/trucks/truck-drawer'
import { useTrucks } from '@/lib/hooks/use-trucks'
import { useAuthStore } from '@/lib/stores/auth.store'
import type { CargoType, Truck as TruckType } from '@/lib/types/truck.types'

const CARGO_LABELS: Record<CargoType, string> = {
  GENERAL: 'General',
  FRAGILE: 'Frágil',
  CHEMICAL: 'Químico',
  TEXTILE: 'Textil',
  REFRIGERATED: 'Refrigerado',
  HAZARDOUS: 'Peligroso',
}

const CARGO_COLORS: Record<CargoType, { bg: string; color: string }> = {
  GENERAL: { bg: 'var(--color-indigo-100)', color: 'var(--color-indigo)' },
  FRAGILE: { bg: 'var(--color-warn-50)', color: 'var(--color-warn)' },
  CHEMICAL: { bg: 'var(--color-danger-50)', color: 'var(--color-danger)' },
  TEXTILE: { bg: 'var(--color-lavender-50)', color: 'var(--color-purple)' },
  REFRIGERATED: { bg: 'var(--color-sage-50)', color: '#4d6a55' },
  HAZARDOUS: { bg: 'var(--color-danger-50)', color: 'var(--color-danger)' },
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

export default function TrucksPage() {
  const user = useAuthStore((s) => s.user)
  const [q, setQ] = useState('')
  const [availFilter, setAvailFilter] = useState<'all' | 'true' | 'false'>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState<TruckType | null>(null)

  const isStaff = user?.role === 'ADMIN' || user?.role === 'OPERATOR'
  const isAdmin = user?.role === 'ADMIN'

  const { data, isLoading } = useTrucks({
    isAvailable: availFilter === 'all' ? undefined : availFilter === 'true',
    limit: 50,
  })

  const filtered =
    data?.trucks.filter((t) => {
      if (!q) return true
      const search = q.toLowerCase()
      return t.plateNumber.toLowerCase().includes(search) || t.model.toLowerCase().includes(search)
    }) ?? []

  const hasFilters = q || availFilter !== 'all'

  return (
    <>
      <Topbar title="Camiones" crumbs={['Flota', 'Camiones']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 48px' }}>
        <PageHeader
          title="Camiones"
          subtitle={`${data?.total ?? 0} camiones en la flota`}
          actions={
            isStaff ? (
              <button type="button" style={btnStyle(true)} onClick={() => setShowCreate(true)}>
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

          {hasFilters && (
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
                {['Camión', 'Capacidad', 'Tipos de carga', 'Estado', ''].map((h) => (
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
                    Cargando camiones...
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
                        background: 'var(--color-indigo-100)',
                        color: 'var(--color-indigo)',
                        display: 'grid',
                        placeItems: 'center',
                        margin: '0 auto 12px',
                      }}
                    >
                      <Truck size={22} />
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--color-ink)', marginBottom: 4 }}>
                      No hay camiones
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                      {isStaff
                        ? 'Registra el primer camión de la flota.'
                        : 'No tienes camiones asignados aún.'}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((truck, i) => (
                  <tr
                    key={truck.id}
                    onClick={() => setSelected(truck)}
                    style={{
                      borderTop: i === 0 ? 'none' : '1px solid var(--color-line)',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Camión */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            background: 'var(--color-indigo-100)',
                            color: 'var(--color-indigo)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Truck size={16} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 13.5,
                              color: 'var(--color-ink)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {truck.plateNumber}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                            {truck.model}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Capacidad */}
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--color-ink-2)' }}>
                      {truck.capacity}
                    </td>

                    {/* Tipos de carga */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {truck.allowedCargoTypes.map((type) => (
                          <CargoBadge key={type} type={type} />
                        ))}
                      </div>
                    </td>

                    {/* Estado */}
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
                          background: truck.isAvailable
                            ? 'var(--color-sage-50)'
                            : 'var(--color-off-2)',
                          color: truck.isAvailable ? '#4d6a55' : 'var(--color-muted)',
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 999,
                            background: 'currentColor',
                          }}
                        />
                        {truck.isAvailable ? 'Disponible' : 'Ocupado'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      style={{ padding: '12px 16px', textAlign: 'right' }}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setSelected(truck)}
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
            fontSize: 11.5,
            fontFamily: 'var(--font-mono)',
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
