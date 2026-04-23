interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--color-ink)',
            margin: '0 0 4px',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13.5, color: 'var(--color-muted)', margin: 0 }}>{subtitle}</p>
        )}
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div>}
    </div>
  )
}
