import { Sidebar } from '@/components/common/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-off)',
      }}
    >
      <Sidebar />
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {children}
      </main>
    </div>
  )
}
