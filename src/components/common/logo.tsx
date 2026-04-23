import { Package } from 'lucide-react'

interface LogoProps {
  inverse?: boolean
  size?: 'md' | 'lg'
}

export function Logo({ inverse, size = 'md' }: LogoProps) {
  const isLg = size === 'lg'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontWeight: 800,
        fontSize: isLg ? 22 : 18,
        letterSpacing: '-0.01em',
        color: inverse ? '#fff' : 'var(--color-ink)',
      }}
    >
      <span
        style={{
          width: isLg ? 36 : 30,
          height: isLg ? 36 : 30,
          borderRadius: isLg ? 10 : 8,
          background: 'linear-gradient(135deg, var(--color-indigo), var(--color-purple))',
          display: 'grid',
          placeItems: 'center',
          color: '#fff',
          boxShadow: '0 4px 10px -2px rgba(87,74,226,0.4)',
          flexShrink: 0,
        }}
      >
        <Package size={isLg ? 20 : 16} strokeWidth={2.4} />
      </span>
      Logisti
    </span>
  )
}
