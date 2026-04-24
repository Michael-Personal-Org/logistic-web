'use client'

import { Truck } from 'lucide-react'
import { CargoBadge } from '@/app/(dashboard)/trucks/page'
import type { Truck as TruckType } from '@/lib/types/truck.types'

interface TrucksTableProps {
  trucks: TruckType[]
  isLoading: boolean
  isStaff: boolean
  onSelect: (truck: TruckType) => void
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

export function TrucksTable({ trucks, isLoading, isStaff, onSelect }: TrucksTableProps) {
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
            {['Camión', 'Capacidad', 'Tipos de carga', 'Estado', ''].map((h) => (
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
          ) : trucks.length === 0 ? (
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
            trucks.map((truck, i) => (
              <tr
                key={truck.id}
                onClick={() => onSelect(truck)}
                style={{
                  borderTop: i === 0 ? 'none' : '1px solid var(--color-line)',
                  cursor: 'pointer',
                }}
              >
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
                      <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{truck.model}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--color-ink-2)' }}>
                  {truck.capacity}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {truck.allowedCargoTypes.map((type) => (
                      <CargoBadge key={type} type={type} />
                    ))}
                  </div>
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
                      background: truck.isAvailable ? 'var(--color-sage-50)' : 'var(--color-off-2)',
                      color: truck.isAvailable ? '#4d6a55' : 'var(--color-muted)',
                    }}
                  >
                    <span
                      style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }}
                    />
                    {truck.isAvailable ? 'Disponible' : 'Ocupado'}
                  </span>
                </td>
                <td
                  style={{ padding: '12px 16px', textAlign: 'right' }}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(truck)}
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
  )
}
