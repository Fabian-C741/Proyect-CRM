import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'CRM Maquilladora',
    template: '%s | CRM Maquilladora',
  },
  description: 'Sistema de gestión de clientes, cursos y agenda para maquilladora profesional.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let faviconUrl: string | null = null
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.from('site_settings').select('favicon_url').limit(1).maybeSingle()
    faviconUrl = (data as { favicon_url: string | null } | null)?.favicon_url || null
  } catch {}

  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <head>
        {faviconUrl && <link rel="icon" href={faviconUrl} />}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="h-full bg-neutral-950 font-sans antialiased">
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
        }} />
      </body>
    </html>
  )
}
