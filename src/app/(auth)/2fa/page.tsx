'use client'

import { ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Logo } from '@/components/common/logo'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/lib/stores/auth.store'
import { isApiError } from '@/lib/types/api.types'

export default function TwoFactorPage() {
  const router = useRouter()
  const setSession = useAuthStore((s) => s.setSession)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = sessionStorage.getItem('2fa-user-id')
    if (!id) {
      router.push('/login')
      return
    }
    setUserId(id)
  }, [router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || code.length !== 6) return
    try {
      setLoading(true)
      const res = await authApi.verifyTwoFactor({ userId, code })
      sessionStorage.removeItem('2fa-user-id')
      setSession(res.user, res.accessToken)
      router.push('/dashboard')
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.response.data.error.message)
      } else {
        toast.error('Código inválido')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'linear-gradient(180deg, var(--color-off) 0%, var(--color-off-2) 100%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Logo size="lg" />
        </div>
        <div
          style={{
            background: 'var(--color-off)',
            borderRadius: 14,
            padding: 36,
            boxShadow: 'var(--shadow)',
            border: '1px solid var(--color-line)',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'var(--color-indigo-100)',
              color: 'var(--color-indigo)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px',
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              textAlign: 'center',
              color: 'var(--color-ink)',
              margin: '0 0 8px',
            }}
          >
            Verificación en dos pasos
          </h1>
          <p
            style={{
              fontSize: 13.5,
              color: 'var(--color-muted)',
              textAlign: 'center',
              margin: '0 0 24px',
            }}
          >
            Introduce el código de 6 dígitos de tu app autenticadora.
          </p>
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label
                htmlFor="2fa-code"
                style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-ink)' }}
              >
                Código de verificación
              </label>
              <input
                id="2fa-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                style={{
                  width: '100%',
                  padding: '14px 12px',
                  background: 'var(--color-off)',
                  border: '1px solid var(--color-line-2)',
                  borderRadius: 6,
                  fontSize: 24,
                  fontWeight: 700,
                  textAlign: 'center',
                  letterSpacing: '0.3em',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-ink)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                El código cambia cada 30 segundos.
              </span>
            </div>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              style={{
                padding: '12px 20px',
                background: code.length === 6 ? 'var(--color-indigo)' : 'var(--color-indigo-100)',
                color: code.length === 6 ? '#fff' : 'var(--color-indigo)',
                border: 'none',
                borderRadius: 6,
                fontSize: 14.5,
                fontWeight: 600,
                cursor: code.length === 6 && !loading ? 'pointer' : 'not-allowed',
                transition: 'all .14s ease',
              }}
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
