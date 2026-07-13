import type { Metadata } from 'next'
import Sidebar from '@/app/_components/Sidebar'
import Topbar from '@/app/_components/Topbar'
import { requireAuth } from '@/lib/dal/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { name: 'Clientes', href: '/dashboard/clientes', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
  { name: 'Cursos', href: '/dashboard/cursos', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
  { name: 'Agenda', href: '/dashboard/agenda', icon: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z' },
  { name: 'Ajustes Web', href: '/dashboard/ajustes', icon: 'M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0zm2 0a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm8-5v10l5-5-5-5z' },
  { name: 'Configuración', href: '/dashboard/configuracion', icon: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
  { name: 'Diagnóstico', href: '/dashboard/debug', icon: 'M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
]

export async function generateMetadata(): Promise<Metadata> {
  let brand = 'Panel'
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.from('site_settings').select('brand_name').limit(1).maybeSingle()
    brand = (data as { brand_name?: string } | null)?.brand_name || 'Panel'
  } catch {}
  return { title: { default: brand, template: `%s | ${brand}` } }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  let brandName = 'CRM Beauty'
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.from('site_settings').select('brand_name').limit(1).maybeSingle()
    brandName = (data as { brand_name?: string } | null)?.brand_name || 'CRM Beauty'
  } catch {}

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <meta name="theme-color" content="#ec4899" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <Sidebar brandName={brandName} navItems={navItems} />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Topbar userNombre={user.nombre} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-fade-in relative z-0">
          <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-pink-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
          {children}
        </main>
      </div>
    </div>
  )
}
