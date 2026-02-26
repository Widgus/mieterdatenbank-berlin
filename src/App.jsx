import { useState } from 'react'
import { SplashScreen }   from './components/SplashScreen'
import { Onboarding }     from './components/Onboarding'
import { BottomNav }      from './components/BottomNav'
import { FAB }            from './components/FAB'
import { FilterBar }      from './components/FilterBar'
import { ActivityList }   from './components/ActivityList'
import { ActivityModal }  from './components/ActivityModal'
import { Avatar }         from './components/Avatar'
import { useProfile }     from './hooks/useProfile'
import { useActivities }  from './hooks/useActivities'
import { Link }           from 'lucide-react'

const EMPTY_FILTERS = { category: null, priority: null, search: '' }

export default function App() {
  const [showSplash,     setShowSplash]     = useState(true)
  const [tab,            setTab]            = useState('open')
  const [modalOpen,      setModalOpen]      = useState(false)
  const [editActivity,   setEditActivity]   = useState(null)
  const [filters,        setFilters]        = useState(EMPTY_FILTERS)
  const [inviteCopied,   setInviteCopied]   = useState(false)

  const { profile, couple, partner } = useProfile()
  const { activities, loading, create, update, complete, uncomplete, remove } = useActivities(
    profile?.couple_id,
    profile?.id
  )

  // ── Splash ──────────────────────────────────────────────────────────────
  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />

  // ── Onboarding (no profile in localStorage yet) ──────────────────────────
  if (!profile) return <Onboarding />

  // ── Helpers ──────────────────────────────────────────────────────────────
  function openCreate() { setEditActivity(null); setModalOpen(true) }
  function openEdit(a)  { setEditActivity(a);    setModalOpen(true) }
  function closeModal() { setModalOpen(false);   setEditActivity(null) }

  async function handleSave(fields) {
    if (editActivity) {
      await update(editActivity.id, fields)
    } else {
      await create(fields)
    }
    closeModal()
  }

  function applyFilters(list) {
    return list
      .filter((a) => !filters.category || a.category === filters.category)
      .filter((a) => !filters.priority || a.priority === filters.priority)
      .filter((a) => !filters.search   || a.title.toLowerCase().includes(filters.search.toLowerCase()))
  }

  const openActivities      = applyFilters(activities.filter((a) => !a.is_completed))
  const completedActivities = applyFilters(activities.filter((a) =>  a.is_completed))

  function copyInvite() {
    if (!couple) return
    const url = `${window.location.origin}/?invite=${couple.invite_code}`
    navigator.clipboard.writeText(url).then(() => {
      setInviteCopied(true)
      setTimeout(() => setInviteCopied(false), 2000)
    })
  }

  // ── Main app ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-zinc-50">

      {/* Header */}
      <header className="bg-white border-b border-zinc-100 px-4 pt-safe flex items-center justify-between" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)', paddingBottom: '0.75rem' }}>
        <h1 className="text-lg font-bold tracking-tight text-zinc-900">gutezeit</h1>
        <div className="flex items-center gap-2">
          {/* Partner avatar (or invite button if no partner yet) */}
          {partner ? (
            <div className="flex items-center gap-1.5">
              <Avatar profile={profile}  size="sm" />
              <span className="text-zinc-300 text-xs">·</span>
              <Avatar profile={partner} size="sm" />
            </div>
          ) : (
            <button
              onClick={copyInvite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium active:scale-95 transition-transform"
            >
              <Link size={12} />
              {inviteCopied ? 'Kopiert!' : 'Partner einladen'}
            </button>
          )}
        </div>
      </header>

      {/* No-partner banner */}
      {!partner && (
        <div className="mx-4 mt-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="text-amber-700 text-xs leading-relaxed text-center">
            Dein Partner hat sich noch nicht verbunden.<br />
            <button onClick={copyInvite} className="underline font-semibold">
              {inviteCopied ? 'Link kopiert ✓' : 'Einladungslink kopieren'}
            </button>
          </p>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-safe">
        {tab === 'open' && (
          <>
            <FilterBar filters={filters} onChange={setFilters} />
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin" />
              </div>
            ) : (
              <ActivityList
                activities={openActivities}
                onComplete={complete}
                onUncomplete={uncomplete}
                onEdit={openEdit}
                onDelete={remove}
              />
            )}
          </>
        )}

        {tab === 'completed' && (
          <>
            <div className="px-4 pt-4 pb-1">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                {completedActivities.length} erledigt
              </h2>
            </div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin" />
              </div>
            ) : (
              <ActivityList
                activities={completedActivities}
                onComplete={complete}
                onUncomplete={uncomplete}
                onEdit={openEdit}
                onDelete={remove}
                completed
              />
            )}
          </>
        )}
      </main>

      {/* FAB only on open tab */}
      {tab === 'open' && <FAB onClick={openCreate} />}

      {/* Bottom nav */}
      <BottomNav tab={tab} onChange={(t) => { setTab(t); setFilters(EMPTY_FILTERS) }} />

      {/* Create / Edit modal */}
      <ActivityModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initial={editActivity}
      />
    </div>
  )
}
