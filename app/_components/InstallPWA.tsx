'use client'

import { useEffect, useState } from 'react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  if (!deferredPrompt) return null

  return (
    <button onClick={handleInstall} style={{
      width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8,
      background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)',
      color: '#f472b6', fontSize: '0.8rem', cursor: 'pointer',
      textAlign: 'center', marginTop: 'auto',
    }}>
      📲 Instalar App
    </button>
  )
}
