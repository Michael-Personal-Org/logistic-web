'use client'

import { BadgeCheck, CheckCircle, Clock, Mail, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Logo } from '@/components/common/logo'

type Variant = 'success' | 'error' | 'already' | 'expired' | 'sent'

const variants: Record<
  Variant,
  {
    icon: React.ReactNode
    iconBg: string
    iconColor: string
    title: string
    body: string
    cta: string
    ctaHref: string
    secondary?: { label: string; href: string }
  }
> = {
  success: {
    icon: <CheckCircle size={30} />,
    iconBg: 'var(--color-sage-50)',
    iconColor: '#4d6a55',
    title: '¡Cuenta activada!',
    body: 'Tu cuenta está lista. Ya puedes iniciar sesión y empezar a usar Logisti.',
    cta: 'Ir al login',
    ctaHref: '/login',
  },
  error: {
    icon: <XCircle size={30} />,
    iconBg: 'var(--color-danger-50)',
    iconColor: 'var(--color-danger)',
    title: 'No pudimos activar',
    body: 'El enlace de activación es inválido o ya fue utilizado.',
    cta: 'Reenviar email de activación',
    ctaHref: '/activate?variant=sent',
  },
  already: {
    icon: <BadgeCheck size={30} />,
    iconBg: 'var(--color-indigo-100)',
    iconColor: 'var(--color-indigo)',
    title: 'Ya estabas activo',
    body: 'Esta cuenta fue activada anteriormente. Puedes iniciar sesión normalmente.',
    cta: 'Ir al login',
    ctaHref: '/login',
  },
  expired: {
    icon: <Clock size={30} />,
    iconBg: 'var(--color-warn-50)',
    iconColor: 'var(--color-warn)',
    title: 'Enlace expirado',
    body: 'Los enlaces de activación expiran en 48h. Podemos enviarte uno nuevo.',
    cta: 'Reenviar activación',
    ctaHref: '/activate?variant=sent',
  },
  sent: {
    icon: <Mail size={30} />,
    iconBg: 'var(--color-sage-50)',
    iconColor: '#4d6a55',
    title: 'Email enviado',
    body: 'Hemos enviado un enlace de activación. Revisa tu bandeja de entrada.',
    cta: 'Ir al login',
    ctaHref: '/login',
  },
}

function ActivateContent() {
  const searchParams = useSearchParams()
  const variant = (searchParams.get('variant') ?? 'success') as Variant
  const v = variants[variant] ?? variants.success

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
        <Logo size="lg" />
        <div
          style={{
            width: '100%',
            maxWidth: 440,
            background: 'var(--color-off)',
            borderRadius: 14,
            padding: 36,
            boxShadow: 'var(--shadow)',
            textAlign: 'center',
            border: '1px solid var(--color-line)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: v.iconBg,
              color: v.iconColor,
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px',
            }}
          >
            {v.icon}
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
              margin: '0 0 10px',
            }}
          >
            {v.title}
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--color-muted)', margin: '0 0 28px' }}>
            {v.body}
          </p>
          <Link
            href={v.ctaHref}
            style={{
              display: 'block',
              padding: '12px 20px',
              background: 'var(--color-indigo)',
              color: '#fff',
              borderRadius: 6,
              fontSize: 14.5,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {v.cta}
          </Link>
          {v.secondary && (
            <Link
              href={v.secondary.href}
              style={{
                display: 'block',
                padding: '10px 16px',
                marginTop: 8,
                background: 'transparent',
                color: 'var(--color-ink-2)',
                borderRadius: 6,
                fontSize: 13.5,
                textDecoration: 'none',
              }}
            >
              {v.secondary.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ActivatePage() {
  return (
    <Suspense fallback={null}>
      <ActivateContent />
    </Suspense>
  )
}
