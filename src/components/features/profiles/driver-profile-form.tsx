'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, Truck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  useCreateDriverProfile,
  useMyDriverProfile,
  useUpdateDriverProfile,
} from '@/lib/hooks/use-profiles'

const schema = z.object({
  vehiclePlate: z.string().min(6, 'Placa inválida').max(20),
  licenseNumber: z.string().min(5, 'Número inválido').max(20),
  licenseType: z.enum(['A', 'B', 'C', 'D', 'E']),
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

const inputWithIcon = { ...inputStyle, paddingLeft: 36 }
const labelStyle = { fontSize: 12.5, fontWeight: 600, color: 'var(--color-ink)' }

export function DriverProfileForm() {
  const { data: profile, isLoading } = useMyDriverProfile()
  const createProfile = useCreateDriverProfile()
  const updateProfile = useUpdateDriverProfile()
  const hasProfile = !!profile

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      vehiclePlate: profile?.vehiclePlate ?? '',
      licenseNumber: profile?.licenseNumber ?? '',
      licenseType: (profile?.licenseType as 'A' | 'B' | 'C' | 'D' | 'E') ?? 'B',
    },
  })

  const onSubmit = async (data: FormValues) => {
    if (hasProfile) {
      await updateProfile.mutateAsync(data)
    } else {
      await createProfile.mutateAsync(data)
    }
  }

  if (isLoading) {
    return <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>Cargando perfil...</div>
  }

  return (
    <div
      style={{
        background: 'var(--color-off)',
        border: '1px solid var(--color-line)',
        borderRadius: 10,
        padding: 20,
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 16px' }}>
        {hasProfile ? 'Información de conductor' : 'Crear perfil de conductor'}
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="vehiclePlate" style={labelStyle}>
              Placa del vehículo
            </label>
            <div style={{ position: 'relative' }}>
              <Truck
                size={16}
                color="var(--color-muted)"
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="vehiclePlate"
                {...register('vehiclePlate')}
                placeholder="ABC1234"
                style={{ ...inputWithIcon, textTransform: 'uppercase' }}
              />
            </div>
            {errors.vehiclePlate && (
              <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                {errors.vehiclePlate.message}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="licenseNumber" style={labelStyle}>
              Número de licencia
            </label>
            <div style={{ position: 'relative' }}>
              <FileText
                size={16}
                color="var(--color-muted)"
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="licenseNumber"
                {...register('licenseNumber')}
                placeholder="LIC12345"
                style={{ ...inputWithIcon, textTransform: 'uppercase' }}
              />
            </div>
            {errors.licenseNumber && (
              <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                {errors.licenseNumber.message}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="licenseType" style={labelStyle}>
            Tipo de licencia
          </label>
          <select
            id="licenseType"
            {...register('licenseType')}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {['A', 'B', 'C', 'D', 'E'].map((t) => (
              <option key={t} value={t}>
                Tipo {t}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={(!isDirty && hasProfile) || createProfile.isPending || updateProfile.isPending}
          style={{
            padding: '10px 20px',
            background: 'var(--color-indigo)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
            alignSelf: 'flex-start',
            opacity: !isDirty && hasProfile ? 0.5 : 1,
          }}
        >
          {hasProfile ? 'Guardar cambios' : 'Crear perfil'}
        </button>
      </form>
    </div>
  )
}
