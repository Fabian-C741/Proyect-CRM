'use client'

import { useState, useRef } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Props = {
  defaultValue?: string | null
  inputName: string
}

export default function ImageUploader({ defaultValue, inputName }: Props) {
  const [preview, setPreview] = useState(defaultValue || '')
  const [urlInput, setUrlInput] = useState(defaultValue || '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hiddenRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true); setError(null)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const supabase = createSupabaseBrowserClient()
    const { data, error: uploadError } = await supabase.storage
      .from('servicios')
      .upload(fileName, file, { contentType: file.type, upsert: false })
    if (uploadError) {
      setError('Error al subir: ' + uploadError.message)
      setUploading(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('servicios').getPublicUrl(data.path)
    setPreview(publicUrl); setUrlInput(publicUrl); setUploading(false)
    if (hiddenRef.current) hiddenRef.current.value = publicUrl
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Imagen</label>
      <input ref={fileRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files?.[0])} disabled={uploading} className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-500/10 file:text-pink-400 hover:file:bg-pink-500/20 disabled:opacity-50" />
      <input type="hidden" ref={hiddenRef} name={inputName} value={preview} />
      <div className="flex gap-2 items-center">
        <input type="text" placeholder="O pegá una URL..." value={urlInput} onChange={e => { setUrlInput(e.target.value); setPreview(e.target.value); if (hiddenRef.current) hiddenRef.current.value = e.target.value }} className="input-base text-xs flex-1" />
        {uploading && <span className="text-xs text-pink-400 shrink-0">Subiendo...</span>}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {preview && (
        <div className="relative w-full rounded-lg overflow-hidden bg-slate-800" style={{ aspectRatio: '4/3' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button type="button" onClick={() => { setPreview(''); setUrlInput(''); if (hiddenRef.current) hiddenRef.current.value = ''; if (fileRef.current) fileRef.current.value = '' }} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/80">✕</button>
        </div>
      )}
    </div>
  )
}