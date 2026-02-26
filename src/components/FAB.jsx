import { Plus } from 'lucide-react'

export function FAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Aktivität erstellen"
      className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-zinc-900 text-white border-2 border-zinc-900 flex items-center justify-center z-30 transition-all active:translate-x-[2px] active:translate-y-[2px]"
      style={{
        marginBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '3px 3px 0px #52525b',
      }}
      onTouchStart={(e) => { e.currentTarget.style.boxShadow = 'none' }}
      onTouchEnd={(e) => { e.currentTarget.style.boxShadow = '3px 3px 0px #52525b' }}
    >
      <Plus size={28} strokeWidth={3} />
    </button>
  )
}
