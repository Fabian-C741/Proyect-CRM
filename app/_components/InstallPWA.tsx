'use client'

import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface Window {
    __pwaPrompt?: BeforeInstallPromptEvent | null
  }
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    setIsIOS(
      /iphone|ipad|ipod/.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    )
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true
    )

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Recuperar el evento si se disparó antes de que React hidrate
    if (window.__pwaPrompt) {
      setDeferredPrompt(window.__pwaPrompt)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Si ya está corriendo como app instalada, no mostrar el botón
  if (isStandalone) return null

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setDeferredPrompt(null)
      return
    }
    // Sin prompt nativo disponible → instrucciones manuales según plataforma
    if (isIOS) {
      alert(
        '📲 Instalar en iPhone/iPad:\n\n' +
          '1. Abrí esta web en Safari\n' +
          '2. Tocá el botón Compartir ⬆️ (abajo)\n' +
          '3. Elegí "Agregar a pantalla de inicio"\n' +
          '4. Confirmá con "Agregar"'
      )
    } else {
      alert(
        '📲 Instalar en Android:\n\n' +
          '1. Tocá el menú ⋮ de Chrome (arriba a la derecha)\n' +
          '2. Elegí "Instalar aplicación" o "Añadir a pantalla de inicio"\n' +
          '3. Confirmá la instalación'
      )
    }
  }

  const label =
    !deferredPrompt && isIOS ? '📲 Agregar a Inicio' : '📲 Instalar App'

  return (
    <button onClick={handleInstall} style={{
      width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8,
      background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)',
      color: '#f472b6', fontSize: '0.8rem', cursor: 'pointer',
      textAlign: 'center', marginTop: 'auto',
    }}>
      {label}
    </button>
  )
}
