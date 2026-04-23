'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Building, CheckCircle, Clock, Hash, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  useCreateClientProfile,
  useMyClientProfile,
  useUpdateClientProfile,
} from '@/lib/hooks/use-profiles'

const schema = z.object({
  companyName: z.string().min(2, 'Mínimo 2 caracteres').max(255),
  rnc: z.string().min(9, 'RNC inválido').max(20).optional().or(z.literal('')),
  emergencyContact: z.string().max(255).optional().or(z.literal('')),
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

export function ClientProfileForm() {
  const { data: profile, isLoading } = useMyClientProfile()
  const createProfile = useCreateClientProfile()
  const updateProfile = useUpdateClientProfile()
  const hasProfile = !!profile

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: profile?.companyName ?? '',
      rnc: profile?.rnc ?? '',
      emergencyContact: profile?.emergencyContact ?? '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    const payload = {
      companyName: data.companyName,
      rnc: data.rnc || undefined,
      emergencyContact: data.emergencyContact || undefined,
    }
    if (hasProfile) {
      await updateProfile.mutateAsync(payload)
    } else {
      await createProfile.mutateAsync(payload)
    }
  }

  if (isLoading) {
    return <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>Cargando perfil...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Approval status */}
      {hasProfile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 16px',
            borderRadius: 10,
            background: profile.isApproved ? 'var(--color-sage-50)' : 'var(--color-warn-50)',
            border: `1px solid ${profile.isApproved ? 'var(--color-sage)' : 'var(--color-warn)'}`,
          }}
        >
          {profile.isApproved ? (
            <CheckCircle size={20} color="#4d6a55" />
          ) : (
            <Clock size={20} color="var(--color-warn)" />
          )}
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                color: profile.isApproved ? '#4d6a55' : 'var(--color-warn)',
              }}
            >
              {profile.isApproved ? 'Perfil aprobado' : 'Pendiente de aprobación'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              {profile.isApproved
                ? `Aprobado el ${profile.approvedAt ? new Date(profile.approvedAt).toLocaleDateString('es-DO') : ''}`
                : 'Un operador revisará tu perfil pronto.'}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div
        style={{
          background: 'var(--color-off)',
          border: '1px solid var(--color-line)',
          borderRadius: 10,
          padding: 20,
        }}
      >
        <h3
          style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 16px' }}
        >
          {hasProfile ? 'Información de empresa' : 'Crear perfil de empresa'}
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="companyName" style={labelStyle}>
              Nombre de empresa
            </label>
            <div style={{ position: 'relative' }}>
              <Building
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
                id="companyName"
                {...register('companyName')}
                placeholder="Acme Logística S.A."
                style={inputWithIcon}
              />
            </div>
            {errors.companyName && (
              <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                {errors.companyName.message}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="rnc" style={labelStyle}>
              RNC <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>— opcional</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Hash
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
              <input id="rnc" {...register('rnc')} placeholder="123456789" style={inputWithIcon} />
            </div>
            {errors.rnc && (
              <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                {errors.rnc.message}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="emergencyContact" style={labelStyle}>
              Contacto de emergencia{' '}
              <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>— opcional</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Phone
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
                id="emergencyContact"
                {...register('emergencyContact')}
                placeholder="+1 809 000 0000"
                style={inputWithIcon}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={
              (!isDirty && hasProfile) || createProfile.isPending || updateProfile.isPending
            }
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
    </div>
  )
}
