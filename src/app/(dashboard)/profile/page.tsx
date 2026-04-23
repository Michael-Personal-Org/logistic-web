'use client'

import { Building } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { Topbar } from '@/components/common/topbar'
import { ClientProfileForm } from '@/components/features/profiles/client-profile-form'
import { DriverProfileForm } from '@/components/features/profiles/driver-profile-form'
import { ProfileSidebar } from '@/components/features/profiles/profile-sidebar'
import { useAuthStore } from '@/lib/stores/auth.store'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)

  return (
    <>
      <Topbar title="Mi perfil" crumbs={['Cuenta', 'Mi perfil']} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 48px' }}>
        <PageHeader
          title="Mi perfil"
          subtitle="Gestiona tu información personal y perfil operacional."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, maxWidth: 1000 }}>
          <div>
            {user?.role === 'CLIENT' && <ClientProfileForm />}
            {user?.role === 'DRIVER' && <DriverProfileForm />}
            {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
              <div
                style={{
                  background: 'var(--color-off)',
                  border: '1px solid var(--color-line)',
                  borderRadius: 10,
                  padding: 32,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'var(--color-indigo-100)',
                    color: 'var(--color-indigo)',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <Building size={22} />
                </div>
                <div style={{ fontWeight: 600, color: 'var(--color-ink)', marginBottom: 4 }}>
                  Perfil de staff
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                  Los administradores y operadores no tienen perfil operacional.
                </div>
              </div>
            )}
          </div>
          {user && <ProfileSidebar user={user} />}
        </div>
      </div>
    </>
  )
}
