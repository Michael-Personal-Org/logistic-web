import { Logo } from '@/components/common/logo'

export function AuthHero() {
  return (
    <div
      style={{
        background:
          'linear-gradient(160deg, var(--color-navy) 0%, var(--color-purple) 55%, var(--color-indigo) 105%)',
        color: '#fff',
        padding: '44px 48px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Radial overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(171,129,205,0.35) 0, transparent 40%),
            radial-gradient(circle at 90% 10%, rgba(143,169,152,0.28) 0, transparent 45%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Logo inverse size="lg" />
      </div>

      {/* Floating cards */}
      <div style={{ position: 'relative', flex: 1, marginTop: 40, zIndex: 1 }}>
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 10,
            width: 240,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.18)',
            padding: '14px 16px',
            color: '#fff',
            fontSize: 13,
            boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>LGT-4821</div>
            <span
              style={{
                background: 'rgba(143,169,152,0.3)',
                padding: '2px 8px',
                borderRadius: 999,
                fontSize: 11,
              }}
            >
              ● en ruta
            </span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Santo Domingo → Santiago</div>
          <div style={{ fontSize: 11, opacity: 0.65, marginTop: 6 }}>
            ETA 14:20 · Conductor: Jorge M.
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 160,
            right: 30,
            width: 200,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.18)',
            padding: '14px 16px',
            color: '#fff',
            fontSize: 13,
            boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Entregas hoy</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>
            127 <span style={{ fontSize: 13, fontWeight: 500, color: '#c7e0ce' }}>↑ 12%</span>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          Coordina tu flota,
          <br />
          entrega sin fricción.
        </div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>
          La plataforma de logística para equipos que se mueven rápido.
        </div>
      </div>
    </div>
  )
}
