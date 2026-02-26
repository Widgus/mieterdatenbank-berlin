import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '../lib/constants'

export function ActivityModal({ open, onClose, onSave, initial = null }) {
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [category,    setCategory]    = useState('academia')
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState(null)
  const titleRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? '')
      setDescription(initial?.description ?? '')
      setCategory(initial?.category ?? 'academia')
      setError(null)
      if (!initial) setTimeout(() => titleRef.current?.focus(), 350)
    }
  }, [open, initial])

  async function handleSave() {
    if (!title.trim()) { setError('Titel fehlt'); return }
    setSaving(true)
    setError(null)
    try {
      await onSave({ title: title.trim(), description: description.trim() || null, category })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-zinc-900 z-50 transition-transform duration-300 ease-out rounded-t-2xl"
        style={{
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4 border-b-2 border-zinc-900">
          <h2 className="text-lg font-black uppercase tracking-tight text-zinc-900">
            {initial ? 'Bearbeiten' : 'Neue Aktivität'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 active:text-zinc-900 transition-colors">
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-5 pt-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-1.5">
              Titel *
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="Was wollt ihr unternehmen?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              className="w-full px-3 py-3 border-2 border-zinc-900 rounded-lg text-zinc-900 text-sm font-medium outline-none focus:bg-zinc-50 transition-colors placeholder:text-zinc-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-1.5">
              Beschreibung
            </label>
            <textarea
              placeholder="Details, Notizen, Links…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-3 border-2 border-zinc-900 rounded-lg text-zinc-900 text-sm font-medium outline-none focus:bg-zinc-50 transition-colors resize-none placeholder:text-zinc-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">
              Kategorie
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const active = category === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className="py-2.5 px-3 rounded-lg text-[11px] font-black uppercase tracking-wide border-2 text-left transition-all active:scale-95"
                    style={
                      active
                        ? { background: cat.color, color: '#fff', borderColor: cat.color }
                        : { background: cat.bg, color: cat.color, borderColor: cat.color }
                    }
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Photo placeholder – reserved for future */}
          {/* <PhotoUpload /> */}

          {error && (
            <p className="text-red-600 text-sm font-bold bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="w-full py-4 rounded-lg bg-zinc-900 text-white font-black text-sm uppercase tracking-widest disabled:opacity-40 transition-all active:translate-x-[2px] active:translate-y-[2px]"
            style={{ boxShadow: '3px 3px 0px #52525b' }}
            onTouchStart={(e) => { e.currentTarget.style.boxShadow = 'none' }}
            onTouchEnd={(e) => { e.currentTarget.style.boxShadow = '3px 3px 0px #52525b' }}
          >
            {saving ? 'Speichern…' : initial ? 'Änderungen speichern' : 'Hinzufügen'}
          </button>
        </div>
      </div>
    </>
  )
}
