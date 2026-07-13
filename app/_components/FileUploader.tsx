'use client'

import { useState, useRef } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Props = {
  defaultValue?: string | null
  inputName: string
  accept?: string
  label?: string
}

export default function FileUploader({ defaultValue, inputName, accept = '.pdf', label = 'Archivo' }: Props) {
  const [urlInput, setUrlInput] = useState(defaultValue || '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hiddenRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true); setError(null)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const supabase = createSupabaseBrowserClient()
    const { data, error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(fileName, file, { contentType: file.type, upsert: false })
    if (uploadError) {
      setError('Error al subir: ' + uploadError.message)
      setUploading(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('pdfs').getPublicUrl(data.path)
    setUrlInput(publicUrl); setUploading(false)
    if (hiddenRef.current) hiddenRef.current.value = publicUrl
  }

  const fileName = urlInput ? urlInput.split('/').pop() : null

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
      <input ref={fileRef} type="file" accept={accept} onChange={e => handleFile(e.target.files?.[0])} disabled={uploading} className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 disabled:opacity-50" />
      <input type="hidden" ref={hiddenRef} name={inputName} value={urlInput} />
      <div className="flex gap-2 items-center">
        <input type="text" placeholder="O pegá una URL..." value={urlInput} onChange={e => { setUrlInput(e.target.value); if (hiddenRef.current) hiddenRef.current.value = e.target.value }} className="input-base text-xs flex-1" />
        {uploading && <span className="text-xs text-purple-400 shrink-0">Subiendo...</span>}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {urlInput && (
        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
          <span className="text-sm">📄</span>
          <span className="text-xs text-slate-300 flex-1 truncate">{fileName || 'Archivo subido'}</span>
          <button type="button" onClick={() => { setUrlInput(''); if (hiddenRef.current) hiddenRef.current.value = ''; if (fileRef.current) fileRef.current.value = '' }} className="text-red-400 hover:text-red-300 text-xs">✕</button>
        </div>
      )}
    </div>
  )
}
