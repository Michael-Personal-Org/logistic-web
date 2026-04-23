import { Topbar } from '@/components/common/topbar'

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" crumbs={['Principal', 'Dashboard']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--color-muted)' }}>Próximamente — métricas del sistema.</p>
      </div>
    </>
  )
}
