import { Search, X } from 'lucide-react'
import { CATEGORIES, PRIORITIES } from '../lib/constants'

export function FilterBar({ filters, onChange }) {
  function setCategory(id) {
    onChange({ ...filters, category: filters.category === id ? null : id })
  }
  function setPriority(id) {
    onChange({ ...filters, priority: filters.priority === id ? null : id })
  }
  function setSearch(val) {
    onChange({ ...filters, search: val })
  }

  const hasFilters = filters.category || filters.priority || filters.search

  return (
    <div className="px-4 pt-3 pb-2 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Suchen…"
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-zinc-100 text-sm text-zinc-900 placeholder-zinc-400 outline-none"
        />
        {filters.search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const active = filters.category === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
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

      {/* Priority pills */}
      <div className="flex gap-2">
        {PRIORITIES.map((p) => {
          const active = filters.priority === p.id
          return (
            <button
              key={p.id}
              onClick={() => setPriority(p.id)}
              className="px-3 py-1 rounded-full text-xs font-medium border transition-all active:scale-95"
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
        {hasFilters && (
          <button
            onClick={() => onChange({ category: null, priority: null, search: '' })}
            className="px-3 py-1 rounded-full text-xs font-medium border border-zinc-300 text-zinc-500 active:scale-95"
          >
            Alle
          </button>
        )}
      </div>
    </div>
  )
}
