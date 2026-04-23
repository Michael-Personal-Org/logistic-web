'use client'

import { Route, Sparkles, Truck, Users } from 'lucide-react'
import { Topbar } from '@/components/common/topbar'
import { useTrucks } from '@/lib/hooks/use-trucks'
import { useUsers } from '@/lib/hooks/use-users'
import { useAuthStore } from '@/lib/stores/auth.store'

// ─── Metric Card ─────────────────────────────────────────
interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  trend?: string
  trendUp?: boolean
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}

function MetricCard({
  label,
  value,
  sub,
  trend,
  trendUp,
  icon,
  iconBg,
  iconColor,
}: MetricCardProps) {
  return (
    <div
      style={{
        position: 'relative',
        padding: '18px 20px',
        border: '1px solid var(--color-line)',
        background: 'var(--color-off)',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          width: 32,
          height: 32,
          borderRadius: 8,
          background: iconBg,
          color: iconColor,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--color-ink-2)', fontWeight: 600 }}>{label}</div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          marginTop: 6,
          color: 'var(--color-ink)',
          lineHeight: 1,
        }}
      >
        {value}
        {sub && (
          <span
            style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-muted)', marginLeft: 6 }}
          >
            {sub}
          </span>
        )}
      </div>
      {trend && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--color-muted)',
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {trendUp !== undefined && (
            <span
              style={{
                color: trendUp ? '#4d6a55' : 'var(--color-danger)',
                background: trendUp ? 'var(--color-sage-50)' : 'var(--color-danger-50)',
                padding: '1px 7px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 11,
              }}
            >
              {trendUp ? '↑' : '↓'}
            </span>
          )}
          <span>{trend}</span>
        </div>
      )}
    </div>
  )
}

// ─── Role Distribution Bar ────────────────────────────────
interface RoleBarProps {
  role: string
  count: number
  total: number
  color: string
}

function RoleBar({ role, count, total, color }: RoleBarProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '2px 8px',
            fontSize: 11.5,
            fontWeight: 600,
            borderRadius: 999,
            background: `${color}20`,
            color,
          }}
        >
          {role}
        </span>
        <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
          {count.toLocaleString()}
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: 'var(--color-off-2)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 999,
            transition: 'width 1s cubic-bezier(.2,.7,.3,1)',
          }}
        />
      </div>
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────
export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.firstName ?? 'Admin'

  const { data: usersData, isLoading: usersLoading } = useUsers({ limit: 100 })
  const { data: trucksData, isLoading: trucksLoading } = useTrucks({ limit: 100 })

  const now = new Date().toLocaleDateString('es-DO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  // Calcular métricas desde los datos reales
  const totalUsers = usersData?.total ?? 0
  const activeUsers = usersData?.users.filter((u) => u.status === 'active').length ?? 0

  const totalTrucks = trucksData?.total ?? 0
  const availableTrucks = trucksData?.trucks.filter((t) => t.isAvailable).length ?? 0

  const clientCount = usersData?.users.filter((u) => u.role === 'CLIENT').length ?? 0
  const driverCount = usersData?.users.filter((u) => u.role === 'DRIVER').length ?? 0
  const operatorCount = usersData?.users.filter((u) => u.role === 'OPERATOR').length ?? 0
  const adminCount = usersData?.users.filter((u) => u.role === 'ADMIN').length ?? 0

  const recentUsers = usersData?.users.slice(0, 5) ?? []

  return (
    <>
      <Topbar title="Dashboard" crumbs={['Principal', 'Dashboard']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 48px' }}>
        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
              margin: '0 0 4px',
            }}
          >
            ¡Hola, {firstName}!
          </h1>
          <p
            style={{
              fontSize: 13.5,
              color: 'var(--color-muted)',
              margin: 0,
              textTransform: 'capitalize',
            }}
          >
            Resumen del {now}
          </p>
        </div>

        {/* Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <MetricCard
            label="Total usuarios"
            value={usersLoading ? '—' : totalUsers.toLocaleString()}
            trend={usersLoading ? undefined : `${activeUsers} activos`}
            trendUp
            icon={<Users size={16} />}
            iconBg="var(--color-indigo-100)"
            iconColor="var(--color-indigo)"
          />
          <MetricCard
            label="Clientes"
            value={usersLoading ? '—' : clientCount.toLocaleString()}
            trend="registrados"
            icon={<Sparkles size={16} />}
            iconBg="var(--color-sage-50)"
            iconColor="#4d6a55"
          />
          <MetricCard
            label="Conductores"
            value={usersLoading ? '—' : driverCount.toLocaleString()}
            trend="en el sistema"
            icon={<Route size={16} />}
            iconBg="var(--color-lavender-50)"
            iconColor="var(--color-purple)"
          />
          <MetricCard
            label="Camiones"
            value={trucksLoading ? '—' : totalTrucks.toLocaleString()}
            sub={trucksLoading ? undefined : `/ ${availableTrucks} disponibles`}
            trend="en flota"
            icon={<Truck size={16} />}
            iconBg="var(--color-purple-50)"
            iconColor="var(--color-purple)"
          />
        </div>

        {/* Charts row */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 16, marginBottom: 16 }}
        >
          {/* Recent users */}
          <div
            style={{
              background: 'var(--color-off)',
              border: '1px solid var(--color-line)',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
                Usuarios recientes
              </h3>
            </div>
            {usersLoading ? (
              <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>Cargando...</div>
            ) : recentUsers.length === 0 ? (
              <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>No hay usuarios aún.</div>
            ) : (
              <div>
                {recentUsers.map((u, i) => (
                  <div
                    key={u.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderTop: i === 0 ? 'none' : '1px solid var(--color-line)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* Avatar */}
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background:
                            'linear-gradient(135deg, var(--color-lavender), var(--color-purple))',
                          color: '#fff',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {u.firstName[0]}
                        {u.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-ink)' }}>
                          {u.firstName} {u.lastName}
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            color: 'var(--color-muted)',
                          }}
                        >
                          {u.email}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          padding: '2px 8px',
                          fontSize: 11.5,
                          fontWeight: 600,
                          borderRadius: 999,
                          background:
                            u.role === 'ADMIN'
                              ? 'var(--color-indigo-100)'
                              : u.role === 'OPERATOR'
                                ? 'var(--color-purple-50)'
                                : u.role === 'DRIVER'
                                  ? 'var(--color-lavender-50)'
                                  : 'var(--color-sage-50)',
                          color:
                            u.role === 'ADMIN'
                              ? 'var(--color-indigo)'
                              : u.role === 'OPERATOR'
                                ? 'var(--color-purple)'
                                : u.role === 'DRIVER'
                                  ? 'var(--color-purple)'
                                  : '#4d6a55',
                        }}
                      >
                        {u.role}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          color: 'var(--color-muted)',
                        }}
                      >
                        {new Date(u.createdAt).toLocaleDateString('es-DO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Role distribution */}
          <div
            style={{
              background: 'var(--color-off)',
              border: '1px solid var(--color-line)',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--color-ink)',
                margin: '0 0 14px',
              }}
            >
              Distribución de roles
            </h3>
            {usersLoading ? (
              <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>Cargando...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <RoleBar
                  role="CLIENT"
                  count={clientCount}
                  total={totalUsers}
                  color="var(--color-sage)"
                />
                <RoleBar
                  role="DRIVER"
                  count={driverCount}
                  total={totalUsers}
                  color="var(--color-lavender)"
                />
                <RoleBar
                  role="OPERATOR"
                  count={operatorCount}
                  total={totalUsers}
                  color="var(--color-purple)"
                />
                <RoleBar
                  role="ADMIN"
                  count={adminCount}
                  total={totalUsers}
                  color="var(--color-indigo)"
                />
              </div>
            )}
          </div>
        </div>

        {/* Trucks summary */}
        <div
          style={{
            background: 'var(--color-off)',
            border: '1px solid var(--color-line)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <h3
            style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 14px' }}
          >
            Estado de la flota
          </h3>
          {trucksLoading ? (
            <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>Cargando...</div>
          ) : trucksData?.trucks.length === 0 ? (
            <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>
              No hay camiones registrados aún.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 12,
              }}
            >
              {trucksData?.trucks.slice(0, 6).map((truck) => (
                <div
                  key={truck.id}
                  style={{
                    padding: '12px 14px',
                    border: '1px solid var(--color-line)',
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: 'var(--color-ink)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {truck.plateNumber}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 8px',
                        fontSize: 11,
                        fontWeight: 600,
                        borderRadius: 999,
                        background: truck.isAvailable
                          ? 'var(--color-sage-50)'
                          : 'var(--color-off-2)',
                        color: truck.isAvailable ? '#4d6a55' : 'var(--color-muted)',
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          background: 'currentColor',
                        }}
                      />
                      {truck.isAvailable ? 'Disponible' : 'Ocupado'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-ink-2)' }}>{truck.model}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{truck.capacity}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
