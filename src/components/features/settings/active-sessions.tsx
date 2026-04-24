import { Laptop, Monitor, Smartphone } from 'lucide-react'

const sessions = [
  {
    device: 'MacBook Pro · Chrome',
    location: 'Santo Domingo · DO',
    current: true,
    time: 'ahora',
    icon: <Monitor size={15} />,
  },
  {
    device: 'iPhone · Safari',
    location: 'Santo Domingo · DO',
    current: false,
    time: 'hace 3 h',
    icon: <Smartphone size={15} />,
  },
  {
    device: 'Windows · Edge',
    location: 'Santiago · DO',
    current: false,
    time: 'hace 2 días',
    icon: <Laptop size={15} />,
  },
]

export function ActiveSessions() {
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
        Sesiones activas
      </h3>
      <div>
        {sessions.map((s, i) => (
          <div
            key={s.device}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--color-line)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'var(--color-off-2)',
                  color: 'var(--color-ink-2)',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-ink)' }}>
                    {s.device}
                  </span>
                  {s.current && (
                    <span
                      style={{
                        padding: '1px 6px',
                        fontSize: 11,
                        fontWeight: 600,
                        borderRadius: 999,
                        background: 'var(--color-indigo-100)',
                        color: 'var(--color-indigo)',
                      }}
                    >
                      Esta sesión
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--color-muted)', marginTop: 2 }}>
                  {s.location} · {s.time}
                </div>
              </div>
            </div>
            {!s.current && (
              <button
                type="button"
                style={{
                  padding: '5px 10px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: 12.5,
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                }}
              >
                Revocar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
