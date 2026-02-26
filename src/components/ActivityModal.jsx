import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES, PRIORITIES } from '../lib/constants'

export function ActivityModal({ open, onClose, onSave, initial = null }) {
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [category,    setCategory]    = useState('other')
  const [priority,    setPriority]    = useState('medium')
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState(null)
  const titleRef = useRef(null)

  // Populate form when editing
  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? '')
      setDescription(initial?.description ?? '')
      setCategory(initial?.category ?? 'other')
      setPriority(initial?.priority ?? 'medium')
      setError(null)
      if (!initial) setTimeout(() => titleRef.current?.focus(), 350)
    }
  }, [open, initial])

  async function handleSave() {
    if (!title.trim()) { setError('Titel fehlt'); return }
    setSaving(true)
    setError(null)
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || null,
        category,
        priority,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 transition-transform duration-300 ease-out`}
        style={{
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <h2 className="text-lg font-bold text-zinc-900">
            {initial ? 'Bearbeiten' : 'Neue Aktivität'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 active:scale-90 transition-transform">
            <X size={22} />
          </button>
        </div>

        <div className="px-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Titel *
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="Was wollt ihr unternehmen?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-zinc-900 text-sm outline-none focus:border-zinc-400 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Beschreibung
            </label>
            <textarea
              placeholder="Details, Notizen, Links…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-zinc-900 text-sm outline-none focus:border-zinc-400 transition-colors resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
              Kategorie
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const active = category === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className="py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                    style={
                      active
                        ? { background: cat.color, color: '#fff' }
                        : { background: cat.bg, color: cat.color }
                    }
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
              Priorität
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => {
                const active = priority === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setPriority(p.id)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all active:scale-95"
                    style={
                      active
                        ? { background: p.color, color: '#fff', borderColor: p.color }
                        : { background: 'transparent', color: p.color, borderColor: p.color }
                    }
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Photo placeholder – feature reserved */}
          {/* <PhotoUpload /> */}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-semibold text-base disabled:opacity-40 active:scale-95 transition-transform"
          >
            {saving ? 'Speichern…' : initial ? 'Änderungen speichern' : 'Hinzufügen'}
          </button>
        </div>
      </div>
    </>
  )
}
