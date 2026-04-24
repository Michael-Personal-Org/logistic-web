'use client'

import { PageHeader } from '@/components/common/page-header'
import { Topbar } from '@/components/common/topbar'
import { ActiveSessions } from '@/components/features/settings/active-sessions'
import { ChangePasswordForm } from '@/components/features/settings/change-password-form'
import { TwoFactorSection } from '@/components/features/settings/two-factor-section'

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Seguridad" crumbs={['Cuenta', 'Seguridad']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 48px' }}>
        <PageHeader
          title="Seguridad"
          subtitle="Autenticación de dos factores, contraseña y sesiones activas."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
          <TwoFactorSection />
          <ChangePasswordForm />
          <ActiveSessions />
        </div>
      </div>
    </>
  )
}
