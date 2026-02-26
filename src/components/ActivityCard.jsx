import { useState } from 'react'
import { Check, RotateCcw, Pencil, Trash2 } from 'lucide-react'
import { Avatar } from './Avatar'
import { getCategoryById, formatDate } from '../lib/constants'

export function ActivityCard({ activity, onComplete, onUncomplete, onEdit, onDelete, completed = false }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const cat = getCategoryById(activity.category)

  function handleDelete() {
    if (confirmDelete) {
      onDelete(activity.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div
      className={`bg-white border-2 border-zinc-900 rounded-xl overflow-hidden ${completed ? 'opacity-60' : ''}`}
      style={{ boxShadow: completed ? 'none' : '3px 3px 0px #18181b' }}
    >
      <div className="px-4 py-3">
        {/* Top row: category badge + actions */}
        <div className="flex items-center justify-between mb-2.5">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border"
            style={{ background: cat.bg, color: cat.color, borderColor: cat.color }}
          >
            {cat.label}
          </span>

          <div className="flex items-center gap-3">
            {!completed && (
              <button
                onClick={() => onEdit(activity)}
                className="text-zinc-400 active:text-zinc-900 transition-colors"
              >
                <Pencil size={14} />
              </button>
            )}
            <button
              onClick={handleDelete}
              className={`transition-colors ${confirmDelete ? 'text-red-600' : 'text-zinc-400 active:text-red-500'}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-black text-[15px] leading-snug mb-2 ${
            completed ? 'line-through text-zinc-400' : 'text-zinc-900'
          }`}
        >
          {activity.title}
        </h3>

        {/* Description */}
        {activity.description && (
          <p className="text-zinc-500 text-xs leading-relaxed mb-2.5 line-clamp-2 font-medium">
            {activity.description}
          </p>
        )}

        {/* Bottom row: creator + complete button */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <Avatar profile={activity.creator} size="xs" />
            <span className="text-zinc-500 text-[11px] font-semibold">
              {activity.creator?.display_name ?? '–'}
              {completed && activity.completed_at && (
                <span className="text-zinc-400 font-normal ml-1">· {formatDate(activity.completed_at)}</span>
              )}
            </span>
          </div>

          {completed ? (
            <button
              onClick={() => onUncomplete(activity.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wide text-zinc-500 border border-zinc-300 active:bg-zinc-100 transition-colors"
            >
              <RotateCcw size={10} />
              Zurück
            </button>
          ) : (
            <button
              onClick={() => onComplete(activity.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[11px] font-black uppercase tracking-wide bg-zinc-900 text-white border-2 border-zinc-900 transition-all active:translate-x-[2px] active:translate-y-[2px]"
              style={{ boxShadow: '2px 2px 0px #52525b' }}
              onTouchStart={(e) => { e.currentTarget.style.boxShadow = 'none' }}
              onTouchEnd={(e) => { e.currentTarget.style.boxShadow = '2px 2px 0px #52525b' }}
            >
              <Check size={12} strokeWidth={3} />
              Erledigt
            </button>
          )}
        </div>

        {confirmDelete && (
          <p className="mt-2 text-red-600 text-xs font-bold text-center">
            Nochmal tippen zum Löschen
          </p>
        )}
      </div>
    </div>
  )
}
