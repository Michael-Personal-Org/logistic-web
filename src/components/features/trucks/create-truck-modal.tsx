'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCreateTruck } from '@/lib/hooks/use-trucks'
import type { CargoType } from '@/lib/types/truck.types'

const CARGO_TYPES: { value: CargoType; label: string }[] = [
  { value: 'GENERAL', label: 'General' },
  { value: 'FRAGILE', label: 'Frágil' },
  { value: 'CHEMICAL', label: 'Químico' },
  { value: 'TEXTILE', label: 'Textil' },
  { value: 'REFRIGERATED', label: 'Refrigerado' },
  { value: 'HAZARDOUS', label: 'Peligroso' },
]

const schema = z.object({
  plateNumber: z.string().min(6, 'Placa inválida').max(20),
  model: z.string().min(2, 'Modelo requerido').max(100),
  capacity: z.string().min(1, 'Capacidad requerida').max(50),
  allowedCargoTypes: z.array(z.string()).min(1, 'Selecciona al menos un tipo'),
})

type FormValues = z.infer<typeof schema>

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--color-off)',
  border: '1px solid var(--color-line-2)',
  borderRadius: 6,
  fontSize: 14,
  color: 'var(--color-ink)',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const labelStyle = { fontSize: 12.5, fontWeight: 600, color: 'var(--color-ink)' }

interface CreateTruckModalProps {
  onClose: () => void
}

export function CreateTruckModal({ onClose }: CreateTruckModalProps) {
  const createTruck = useCreateTruck()
  const [selectedCargo, setSelectedCargo] = useState<CargoType[]>(['GENERAL'])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { allowedCargoTypes: ['GENERAL'] },
  })

  const toggleCargo = (type: CargoType) => {
    setSelectedCargo((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const onSubmit = async (data: FormValues) => {
    await createTruck.mutateAsync({
      plateNumber: data.plateNumber.toUpperCase().trim(),
      model: data.model.trim(),
      capacity: data.capacity.trim(),
      allowedCargoTypes: selectedCargo,
    })
    onClose()
  }

  return (
    <button
      type="button"
      aria-label="Cerrar modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(34,42,104,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        zIndex: 50,
        border: 'none',
        cursor: 'default',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--color-off)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Head */}
        <div
          style={{
            padding: '20px 22px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--color-ink)',
                margin: '0 0 4px',
              }}
            >
              Registrar camión
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0 }}>
              Agrega un nuevo camión a la flota.
            </p>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{ padding: '0 22px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Plate + Model */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="ct-plate" style={labelStyle}>
                  Placa
                </label>
                <input
                  id="ct-plate"
                  {...register('plateNumber')}
                  placeholder="ABC1234"
                  style={{ ...inputStyle, textTransform: 'uppercase' }}
                />
                {errors.plateNumber && (
                  <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                    {errors.plateNumber.message}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="ct-model" style={labelStyle}>
                  Modelo
                </label>
                <input
                  id="ct-model"
                  {...register('model')}
                  placeholder="Volvo FH16"
                  style={inputStyle}
                />
                {errors.model && (
                  <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                    {errors.model.message}
                  </span>
                )}
              </div>
            </div>

            {/* Capacity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="ct-capacity" style={labelStyle}>
                Capacidad
              </label>
              <input
                id="ct-capacity"
                {...register('capacity')}
                placeholder="20 toneladas"
                style={inputStyle}
              />
              {errors.capacity && (
                <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                  {errors.capacity.message}
                </span>
              )}
            </div>

            {/* Cargo types */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={labelStyle}>Tipos de carga permitidos</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CARGO_TYPES.map((ct) => {
                  const active = selectedCargo.includes(ct.value)
                  return (
                    <button
                      key={ct.value}
                      type="button"
                      onClick={() => toggleCargo(ct.value)}
                      style={{
                        padding: '6px 12px',
                        border: `1.5px solid ${active ? 'var(--color-indigo)' : 'var(--color-line)'}`,
                        borderRadius: 999,
                        background: active ? 'var(--color-indigo-100)' : 'var(--color-off)',
                        color: active ? 'var(--color-indigo)' : 'var(--color-ink-2)',
                        fontSize: 12.5,
                        fontWeight: active ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all .12s ease',
                      }}
                    >
                      {ct.label}
                    </button>
                  )
                })}
              </div>
              {errors.allowedCargoTypes && (
                <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                  {errors.allowedCargoTypes.message}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '14px 22px',
              borderTop: '1px solid var(--color-line)',
              background: 'var(--color-off-2)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
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
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createTruck.isPending || selectedCargo.length === 0}
              style={{
                padding: '8px 16px',
                background: 'var(--color-indigo)',
                border: 'none',
                borderRadius: 6,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                color: '#fff',
                opacity: createTruck.isPending ? 0.7 : 1,
              }}
            >
              {createTruck.isPending ? 'Registrando...' : 'Registrar camión'}
            </button>
          </div>
        </form>
      </div>
    </button>
  )
}
