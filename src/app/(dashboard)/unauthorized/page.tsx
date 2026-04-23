import Link from 'next/link'
import { ShieldX } from 'lucide-react'
import { Logo } from '@/components/common/logo'

export default function UnauthorizedPage() {
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
            background: 'var(--color-danger-50)',
            color: 'var(--color-danger)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <ShieldX size={32} />
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--color-danger)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              marginBottom: 8,
            }}
          >
            ERROR 403
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
            Acceso denegado
          </h1>
          <p
            style={{ fontSize: 14, color: 'var(--color-muted)', margin: '0 0 24px', maxWidth: 360 }}
          >
            No tienes permisos para acceder a esta sección. Contacta al administrador si crees que
            esto es un error.
          </p>
        </div>
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
          Volver al dashboard
        </Link>
      </div>
    </div>
  )
}
