import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

async function getSettings() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('site_settings')
      .select('favicon_url, brand_name')
      .not('favicon_url', 'is', null)
      .limit(1)
      .maybeSingle()
    return data as { favicon_url: string; brand_name: string } | null
  } catch { return null }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const name = settings?.brand_name || 'CRM Maquilladora'
  return {
    title: { default: name, template: `%s | ${name}` },
    description: 'Sistema de gestión de clientes, cursos y agenda para maquilladora profesional.',
    robots: { index: false, follow: false },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSettings()
  const faviconUrl = settings?.favicon_url || null

  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <head>
        {faviconUrl && <link rel="icon" href={faviconUrl} />}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="h-full bg-neutral-950 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
