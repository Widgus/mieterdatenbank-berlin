import { useState } from 'react'
import { Check, RotateCcw, Pencil, Trash2 } from 'lucide-react'
import { Avatar } from './Avatar'
import { getCategoryById, getPriorityById, formatDate } from '../lib/constants'

export function ActivityCard({ activity, onComplete, onUncomplete, onEdit, onDelete, completed = false }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const cat  = getCategoryById(activity.category)
  const prio = getPriorityById(activity.priority)

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
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100 ${completed ? 'opacity-70' : ''}`}
      style={{ borderLeftWidth: 3, borderLeftColor: prio.color }}
    >
      <div className="px-4 py-3">
        {/* Top row: category + actions */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ background: cat.bg, color: cat.color }}
          >
            {cat.label}
          </span>

          <div className="flex items-center gap-2">
            {!completed && (
              <button
                onClick={() => onEdit(activity)}
                className="text-zinc-300 hover:text-zinc-600 active:scale-90 transition-all"
              >
                <Pencil size={15} />
              </button>
            )}
            <button
              onClick={handleDelete}
              className={`active:scale-90 transition-all ${confirmDelete ? 'text-red-500' : 'text-zinc-300 hover:text-red-400'}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-semibold text-zinc-900 text-[15px] leading-snug mb-1 ${completed ? 'line-through text-zinc-400' : ''}`}
        >
          {activity.title}
        </h3>

        {/* Description */}
        {activity.description && (
          <p className="text-zinc-400 text-xs leading-relaxed mb-2 line-clamp-2">
            {activity.description}
          </p>
        )}

        {/* Bottom row: creator + complete button */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <Avatar profile={activity.creator} size="xs" />
            <span className="text-zinc-400 text-[11px]">
              {activity.creator?.display_name ?? '–'}
              {completed && activity.completed_at && (
                <span className="ml-1">· {formatDate(activity.completed_at)}</span>
              )}
            </span>
          </div>

          {completed ? (
            <button
              onClick={() => onUncomplete(activity.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-zinc-400 border border-zinc-200 active:scale-90 transition-transform"
            >
              <RotateCcw size={11} />
              Zurück
            </button>
          ) : (
            <button
              onClick={() => onComplete(activity.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-zinc-900 text-white active:scale-90 transition-transform"
            >
              <Check size={13} strokeWidth={2.5} />
              Erledigt
            </button>
          )}
        </div>

        {/* Confirm delete hint */}
        {confirmDelete && (
          <p className="mt-2 text-red-500 text-xs text-center animate-pulse">
            Nochmal tippen zum Löschen
          </p>
        )}
      </div>
    </div>
  )
}
