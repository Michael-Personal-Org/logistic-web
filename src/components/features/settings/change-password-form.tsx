'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { authApi } from '@/lib/api/auth.api'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Requerido'),
    newPassword: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener una mayúscula')
      .regex(/[0-9]/, 'Debe tener un número')
      .regex(/[^a-zA-Z0-9]/, 'Debe tener un símbolo'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
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

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Contraseña actualizada correctamente')
      reset()
    } catch {
      toast.error('Contraseña actual incorrecta')
    } finally {
      setLoading(false)
    }
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
        Cambiar contraseña
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="currentPassword" style={labelStyle}>
            Contraseña actual
          </label>
          <input
            id="currentPassword"
            {...register('currentPassword')}
            type="password"
            placeholder="••••••••"
            style={inputStyle}
          />
          {errors.currentPassword && (
            <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
              {errors.currentPassword.message}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="newPassword" style={labelStyle}>
              Nueva contraseña
            </label>
            <input
              id="newPassword"
              {...register('newPassword')}
              type="password"
              placeholder="Mínimo 8 caracteres"
              style={inputStyle}
            />
            {errors.newPassword && (
              <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                {errors.newPassword.message}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="confirmPassword" style={labelStyle}>
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              {...register('confirmPassword')}
              type="password"
              placeholder="Repite la contraseña"
              style={inputStyle}
            />
            {errors.confirmPassword && (
              <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
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
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  )
}
