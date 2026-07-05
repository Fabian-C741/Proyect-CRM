'use client'

import { useState } from 'react'
import type { Servicio, PortfolioItem, Testimonio, BloqueoHorario } from '@/lib/definitions'
import ServiciosEditor from './ServiciosEditor'
import PortfolioEditor from './PortfolioEditor'
import TestimoniosEditor from './TestimoniosEditor'
import MenuEditor from './MenuEditor'
import BloqueosEditor from './BloqueosEditor'
import { logoutAction } from '@/app/(auth)/login/logoutAction'
import type { MenuItem } from '@/lib/definitions'

type Props = {
  user: { id: string; email: string | undefined }
  servicios: Servicio[]
  portfolio: PortfolioItem[]
  testimonios: Testimonio[]
  menuItems: MenuItem[]
  bloqueos: BloqueoHorario[]
}

const TABS = [
  { id: 'menu', label: '⚓ Menú Superior', description: 'Navegación dinámica' },
  { id: 'servicios', label: '💄 Servicios', description: 'Tarjetas de servicios' },
  { id: 'portfolio', label: '📸 Portfolio', description: 'Galería de trabajos' },
  { id: 'testimonios', label: '⭐ Testimonios', description: 'Reseñas de clientes' },
  { id: 'bloqueos', label: '🔒 Bloq. Horarios', description: 'Días no disponibles' },
  { id: 'cuenta', label: '👤 Cuenta', description: 'Tu perfil y sesión' },
]

export default function ConfiguracionClient({ user, servicios, portfolio, testimonios, menuItems, bloqueos }: Props) {
  const [activeTab, setActiveTab] = useState('menu')


  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Configuración</h1>
        <p className="text-slate-400 text-sm">Personalizá tu sitio público y gestioná tu contenido.</p>
      </div>

      {/* Tabs de navegación */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 14,
          padding: '0.25rem',
          flexWrap: 'wrap',
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <div className="card-glass p-6">
        {activeTab === 'menu' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Menú de Navegación Superior</h2>
            <p className="text-slate-400 text-sm mb-6">
              Personaliza los enlaces en la parte superior de tu web. Deja el enlace vacío para crear un menú desplegable (dropdown).
            </p>
            <MenuEditor menuItems={menuItems} />
          </div>
        )}


        {activeTab === 'servicios' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Servicios Destacados</h2>
            <p className="text-slate-400 text-sm mb-6">
              Aparecen en la sección &quot;Servicios&quot; de tu landing. Cada tarjeta tiene un botón de consulta por WhatsApp.
            </p>
            <ServiciosEditor servicios={servicios} />
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Mi Portfolio</h2>
            <p className="text-slate-400 text-sm mb-6">
              Fotos de tus trabajos que aparecen en la sección &quot;Mis Trabajos&quot; de la landing.
            </p>
            <PortfolioEditor items={portfolio} />
          </div>
        )}

        {activeTab === 'testimonios' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Testimonios de Clientes</h2>
            <p className="text-slate-400 text-sm mb-6">
              Las reseñas generan confianza. Aparecen en la sección &quot;Opiniones&quot; de tu landing.
            </p>
            <TestimoniosEditor testimonios={testimonios} />
          </div>
        )}

        {activeTab === 'bloqueos' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Bloqueos Horarios</h2>
            <p className="text-slate-400 text-sm mb-6">
              Bloqueá días completos o franjas horarias para evitar que los visitantes reserven cuando no estás disponible (viajes, enfermedad, feriados, etc.).
            </p>
            <BloqueosEditor bloqueos={bloqueos} />
          </div>
        )}

        {activeTab === 'cuenta' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white mb-1">Detalles de la Cuenta</h2>

            <div className="space-y-4">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Correo electrónico</span>
                <span className="text-sm text-slate-300 font-medium">{user.email || 'No disponible'}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ID de Usuario</span>
                <span className="text-sm font-mono text-slate-400 bg-white/5 px-2 py-1 rounded select-all block w-fit">
                  {user.id}
                </span>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Sesión</h3>
              <p className="text-sm text-slate-400 mb-4">Cerrá sesión de forma segura. Se borrarán tus cookies de acceso local.</p>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="btn-secondary text-red-400 border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Cerrar Sesión
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
