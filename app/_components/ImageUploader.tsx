'use client'

import { useState, useRef, useEffect } from 'react'

type Props = {
  defaultValue?: string | null
  inputName: string
}

export default function ImageUploader({ defaultValue, inputName }: Props) {
  const [preview, setPreview] = useState(defaultValue || '')
  const [urlInput, setUrlInput] = useState(defaultValue || '')
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const hiddenRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [objectUrl])

  const handleFileSelect = (file: File | undefined) => {
    // Revocar object URL anterior
    if (objectUrl) { URL.revokeObjectURL(objectUrl); setObjectUrl(null) }
    if (!file) { setPreview(''); return }
    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    setPreview(url)
    if (hiddenRef.current) hiddenRef.current.value = ''
  }

  const handleUrlChange = (val: string) => {
    setUrlInput(val)
    setPreview(val)
    if (hiddenRef.current) hiddenRef.current.value = val
    if (objectUrl) { URL.revokeObjectURL(objectUrl); setObjectUrl(null) }
    if (fileRef.current) fileRef.current.value = ''
  }

  const clearImage = () => {
    setPreview(''); setUrlInput('')
    if (objectUrl) { URL.revokeObjectURL(objectUrl); setObjectUrl(null) }
    if (fileRef.current) fileRef.current.value = ''
    if (hiddenRef.current) hiddenRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Imagen</label>
      <input ref={fileRef} type="file" name="imagen_file" accept="image/*" onChange={e => handleFileSelect(e.target.files?.[0])} className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-500/10 file:text-pink-400 hover:file:bg-pink-500/20" />
      <input type="hidden" ref={hiddenRef} name={inputName} value={urlInput} />
      <div className="flex gap-2 items-center">
        <input type="text" placeholder="O pegá una URL..." value={urlInput} onChange={e => handleUrlChange(e.target.value)} className="input-base text-xs flex-1" />
      </div>
      {preview && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={clearImage} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/80">✕</button>
        </div>
      )}
    </div>
  )
}