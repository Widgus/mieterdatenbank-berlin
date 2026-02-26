import { Plus } from 'lucide-react'

export function FAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Aktivität erstellen"
      className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-zinc-900 text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform z-30"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Plus size={28} strokeWidth={2.5} />
    </button>
  )
}
