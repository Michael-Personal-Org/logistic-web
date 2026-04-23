import type { Metadata } from 'next'
import { Providers } from '@/components/common/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Logisti — TMS',
  description: 'Plataforma de logística y transporte de carga',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
