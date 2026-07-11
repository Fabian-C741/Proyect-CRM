'use client'

import { useState } from 'react'
import type { PortfolioItem } from '@/lib/definitions'

type Props = {
  items: PortfolioItem[]
}

export default function PortfolioGallery({ items }: Props) {
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  const close = () => setSelected(null)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => setSelected(item)}
          >
            <div style={{ width: '100%', aspectRatio: '4/3', background: '#1e293b' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imagen_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="card-hover" />
            </div>
            {item.descripcion && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '1rem 0.75rem 0.75rem', color: 'white', fontSize: '0.8rem' }}>
                {item.descripcion}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={close}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 700, width: '100%', background: '#1e293b', borderRadius: 16, overflow: 'hidden' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.imagen_url} alt="" style={{ width: '100%', display: 'block' }} />
            <div style={{ padding: '1.5rem' }}>
              {selected.descripcion && (
                <p style={{ color: '#cbd5e1', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>{selected.descripcion}</p>
              )}
              {selected.boton_texto && selected.boton_enlace && (
                <a
                  href={selected.boton_enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-block', textDecoration: 'none', fontSize: '0.9375rem' }}
                >
                  {selected.boton_texto}
                </a>
              )}
              <button
                onClick={close}
                style={{ display: 'block', marginTop: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}