import { ListTodo, CheckCircle2 } from 'lucide-react'

const TABS = [
  { id: 'open',      label: 'Offen',    Icon: ListTodo },
  { id: 'completed', label: 'Erledigt', Icon: CheckCircle2 },
]

export function BottomNav({ tab, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 flex safe-bottom z-30">
      {TABS.map(({ id, label, Icon }) => {
        const active = tab === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
              active ? 'text-zinc-900' : 'text-zinc-400'
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className={`text-[11px] font-medium ${active ? 'font-semibold' : ''}`}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
