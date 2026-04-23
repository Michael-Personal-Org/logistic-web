import Link from 'next/link'
import { Logo } from '@/components/common/logo'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(180deg, var(--color-off) 0%, var(--color-off-2) 100%)',
        padding: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          textAlign: 'center',
        }}
      >
        <Logo size="lg" />
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: 'var(--color-indigo-100)',
            color: 'var(--color-indigo)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <FileQuestion size={32} />
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--color-indigo)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              marginBottom: 8,
            }}
          >
            ERROR 404
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: 'var(--color-ink)',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            Página no encontrada
          </h1>
          <p
            style={{ fontSize: 14, color: 'var(--color-muted)', margin: '0 0 24px', maxWidth: 360 }}
          >
            La página que buscas no existe o fue movida. Verifica la URL o regresa al dashboard.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href="/dashboard"
            style={{
              padding: '10px 20px',
              background: 'var(--color-indigo)',
              color: '#fff',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Ir al dashboard
          </Link>
          <Link
            href="/login"
            style={{
              padding: '10px 20px',
              background: 'var(--color-off)',
              color: 'var(--color-ink)',
              border: '1px solid var(--color-line-2)',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
