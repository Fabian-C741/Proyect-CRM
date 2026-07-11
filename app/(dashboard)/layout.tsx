import type { Metadata } from 'next'
import Sidebar from '@/app/_components/Sidebar'
import Topbar from '@/app/_components/Topbar'
import { requireAuth } from '@/lib/dal/auth'

export const metadata: Metadata = {
  title: {
    default: 'Panel',
    template: '%s | Panel',
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Verificar autenticación (protección extra al proxy)
  const user = await requireAuth()

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#ec4899" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Topbar userNombre={user.nombre} />
        <main className="flex-1 overflow-y-auto p-8 animate-fade-in relative z-0">
          <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-pink-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
          {children}
        </main>
      </div>
      <script dangerouslySetInnerHTML={{
        __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
      }} />
    </div>
  )
}
