import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
    index: false, // App privada — no indexar en buscadores
    follow: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="h-full bg-neutral-950 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
