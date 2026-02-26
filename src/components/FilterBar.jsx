import { Search, X } from 'lucide-react'
import { CATEGORIES } from '../lib/constants'

export function FilterBar({ filters, onChange }) {
  function setCategory(id) {
    onChange({ ...filters, category: filters.category === id ? null : id })
  }
  function setSearch(val) {
    onChange({ ...filters, search: val })
  }

  const hasFilters = filters.category || filters.search

  return (
    <div className="px-4 pt-3 pb-2 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Suchen…"
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 border-2 border-zinc-900 rounded-lg bg-white text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none"
        />
        {filters.search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <X size={14} />
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
              className="flex-shrink-0 px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wide border-2 transition-all active:scale-95"
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
        {hasFilters && (
          <button
            onClick={() => onChange({ category: null, search: '' })}
            className="flex-shrink-0 px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wide border-2 border-zinc-900 text-zinc-700 bg-white active:scale-95"
          >
            Alle
          </button>
        )}
      </div>
    </div>
  )
}
