'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { usersApi } from '@/lib/api/users.api'
import { userKeys } from '@/lib/hooks/use-users'
import type { UserRole } from '@/lib/types/user.types'

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email('Email inválido'),
  password: z.string().min(8),
  selectedRole: z.enum(['OPERATOR', 'DRIVER', 'CLIENT', 'ADMIN']),
})

type FormValues = z.infer<typeof schema>

interface CreateUserModalProps {
  onClose: () => void
}

const ROLES: { value: UserRole; label: string; desc: string }[] = [
  { value: 'OPERATOR', label: 'OPERATOR', desc: 'Gestiona envíos, rutas y clientes.' },
  { value: 'DRIVER', label: 'DRIVER', desc: 'Recibe rutas y actualiza entregas.' },
  { value: 'CLIENT', label: 'CLIENT', desc: 'Crea y gestiona sus órdenes.' },
]

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

const labelStyle = {
  fontSize: 12.5,
  fontWeight: 600,
  color: 'var(--color-ink)',
}

export function CreateUserModal({ onClose }: CreateUserModalProps) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { selectedRole: 'OPERATOR' },
  })

  const selectedRole = watch('selectedRole')

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      await usersApi.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.selectedRole,
      })
      toast.success('Usuario creado correctamente')
      void queryClient.invalidateQueries({ queryKey: userKeys.all })
      onClose()
    } catch {
      toast.error('Error al crear el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
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
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 500,
          background: 'var(--color-off)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Head */}
        <div style={{ padding: '20px 22px 12px' }}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
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
                Crear nuevo usuario
              </h2>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0 }}>
                Se enviará un email de activación al usuario.
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
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{ padding: '0 22px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Role selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Rol</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setValue('selectedRole', r.value)}
                    style={{
                      flex: 1,
                      padding: 12,
                      textAlign: 'left',
                      border: `1.5px solid ${selectedRole === r.value ? 'var(--color-indigo)' : 'var(--color-line)'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      background:
                        selectedRole === r.value ? 'var(--color-indigo-50)' : 'var(--color-off)',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 12.5,
                        color: 'var(--color-ink)',
                        marginBottom: 4,
                      }}
                    >
                      {r.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--color-muted)' }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="cu-first" style={labelStyle}>
                  Nombre
                </label>
                <input
                  id="cu-first"
                  {...register('firstName')}
                  placeholder="Nombre"
                  style={inputStyle}
                />
                {errors.firstName && (
                  <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                    {errors.firstName.message}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="cu-last" style={labelStyle}>
                  Apellido
                </label>
                <input
                  id="cu-last"
                  {...register('lastName')}
                  placeholder="Apellido"
                  style={inputStyle}
                />
                {errors.lastName && (
                  <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="cu-email" style={labelStyle}>
                Email
              </label>
              <input
                id="cu-email"
                {...register('email')}
                type="email"
                placeholder="nombre@empresa.com"
                style={inputStyle}
              />
              {errors.email && (
                <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="cu-password" style={labelStyle}>
                Contraseña temporal
              </label>
              <input
                id="cu-password"
                {...register('password')}
                type="password"
                placeholder="Mínimo 8 caracteres"
                style={inputStyle}
              />
              {errors.password && (
                <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                  {errors.password.message}
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
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: 'var(--color-indigo)',
                border: 'none',
                borderRadius: 6,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                color: '#fff',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
