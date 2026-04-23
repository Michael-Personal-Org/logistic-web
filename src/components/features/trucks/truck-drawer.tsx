'use client'

import { Trash2, Truck, X } from 'lucide-react'
import { CargoBadge } from '@/app/(dashboard)/trucks/page'
import { useDeleteTruck, useUpdateTruck } from '@/lib/hooks/use-trucks'
import type { Truck as TruckType } from '@/lib/types/truck.types'

interface TruckDrawerProps {
  truck: TruckType
  onClose: () => void
  isStaff: boolean
  isAdmin: boolean
}

export function TruckDrawer({ truck, onClose, isStaff, isAdmin }: TruckDrawerProps) {
  const deleteTruck = useDeleteTruck()
  const updateTruck = useUpdateTruck()

  const handleToggleAvailability = async () => {
    await updateTruck.mutateAsync({
      truckId: truck.id,
      data: { isAvailable: !truck.isAvailable },
    })
    onClose()
  }

  const handleDelete = async () => {
    await deleteTruck.mutateAsync(truck.id)
    onClose()
  }

  return (
    <button
      type="button"
      aria-label="Cerrar panel"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(34,42,104,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 50,
        border: 'none',
        cursor: 'default',
        width: '100%',
      }}
    >
      <div
        style={{
          width: 420,
          height: '100%',
          background: 'var(--color-off)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Head */}
        <div
          style={{
            padding: 20,
            borderBottom: '1px solid var(--color-line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--color-indigo-100)',
                color: 'var(--color-indigo)',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Truck size={20} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {truck.plateNumber}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{truck.model}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-muted)',
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Status badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 999,
              alignSelf: 'flex-start',
              background: truck.isAvailable ? 'var(--color-sage-50)' : 'var(--color-off-2)',
              color: truck.isAvailable ? '#4d6a55' : 'var(--color-muted)',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} />
            {truck.isAvailable ? 'Disponible' : 'Ocupado'}
          </span>

          {/* Details */}
          <div
            style={{
              padding: 14,
              border: '1px solid var(--color-line)',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {[
              { label: 'Placa', value: truck.plateNumber },
              { label: 'Modelo', value: truck.model },
              { label: 'Capacidad', value: truck.capacity },
              {
                label: 'Conductor',
                value: truck.assignedDriverId ? 'Asignado' : 'Sin asignar',
              },
              {
                label: 'Alta',
                value: new Date(truck.createdAt).toLocaleDateString('es-DO'),
              },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-muted)',
                    width: 90,
                    flexShrink: 0,
                  }}
                >
                  {item.label}
                </span>
                <span style={{ color: 'var(--color-ink)', fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Cargo types */}
          <div
            style={{
              padding: 14,
              border: '1px solid var(--color-line)',
              borderRadius: 8,
            }}
          >
            <div
              style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 10 }}
            >
              Tipos de carga
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {truck.allowedCargoTypes.map((type) => (
                <CargoBadge key={type} type={type} />
              ))}
            </div>
          </div>

          {/* Toggle availability */}
          {isStaff && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                border: '1px solid var(--color-line)',
                borderRadius: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-ink)' }}>
                  Disponibilidad
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                  {truck.isAvailable
                    ? 'El camión puede ser asignado'
                    : 'El camión está en servicio'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleAvailability}
                disabled={updateTruck.isPending}
                aria-label={truck.isAvailable ? 'Marcar como ocupado' : 'Marcar como disponible'}
                style={{
                  position: 'relative',
                  width: 38,
                  height: 22,
                  background: truck.isAvailable ? 'var(--color-sage)' : 'var(--color-line-2)',
                  borderRadius: 999,
                  cursor: 'pointer',
                  border: 'none',
                  flexShrink: 0,
                  transition: 'background .2s',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: truck.isAvailable ? 18 : 2,
                    width: 18,
                    height: 18,
                    background: '#fff',
                    borderRadius: '50%',
                    transition: 'left .2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }}
                />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 16,
            borderTop: '1px solid var(--color-line)',
            display: 'flex',
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '8px 16px',
              background: 'var(--color-off)',
              border: '1px solid var(--color-line-2)',
              borderRadius: 6,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--color-ink)',
            }}
          >
            Cerrar
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteTruck.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: 'transparent',
                border: '1px solid var(--color-danger)',
                borderRadius: 6,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--color-danger)',
              }}
            >
              <Trash2 size={14} /> {deleteTruck.isPending ? 'Eliminando...' : 'Eliminar'}
            </button>
          )}
        </div>
      </div>
    </button>
  )
}
