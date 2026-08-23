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
        {/* El manifest (/manifest.webmanifest) lo inyecta Next automáticamente desde app/manifest.ts */}
      </head>
      <body className="h-full bg-neutral-950 font-sans antialiased">
        {children}
        <script dangerouslySetInnerHTML={{
          __html: [
            `if('serviceWorker' in navigator){navigator.serviceWorker.register('/api/sw',{scope:'/'})}`,
            // Capturar el prompt de instalación LO ANTES POSIBLE (antes de React),
            // si no en móviles lentos el evento se dispara y se pierde.
            `window.__pwaPrompt=null;`,
            `window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaPrompt=e});`,
          ].join('\n'),
        }} />
      </body>
    </html>
  )
}
