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

const EMPTY_FILTERS = { category: null, search: '' }

export default function App() {
  const [showSplash,   setShowSplash]   = useState(true)
  const [tab,          setTab]          = useState('open')
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editActivity, setEditActivity] = useState(null)
  const [filters,      setFilters]      = useState(EMPTY_FILTERS)

  const { profile, partner, login, loading: loginLoading, error: loginError } = useProfile()
  const { activities, loading, create, update, complete, uncomplete, remove } = useActivities(
    profile?.couple_id,
    profile?.id
  )

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />
  if (!profile)  return <Onboarding login={login} loading={loginLoading} error={loginError} />

  function openCreate() { setEditActivity(null); setModalOpen(true) }
  function openEdit(a)  { setEditActivity(a);    setModalOpen(true) }
  function closeModal() { setModalOpen(false);   setEditActivity(null) }

  async function handleSave(fields) {
    if (editActivity) await update(editActivity.id, fields)
    else              await create(fields)
    closeModal()
  }

  function applyFilters(list) {
    return list
      .filter((a) => !filters.category || a.category === filters.category)
      .filter((a) => !filters.search   || a.title.toLowerCase().includes(filters.search.toLowerCase()))
  }

  const openActivities      = applyFilters(activities.filter((a) => !a.is_completed))
  const completedActivities = applyFilters(activities.filter((a) =>  a.is_completed))

  return (
    <div className="flex flex-col h-screen" style={{ background: '#f5f0e8' }}>

      {/* Header */}
      <header
        className="bg-white border-b-2 border-zinc-900 px-4 flex items-center justify-between"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)', paddingBottom: '0.75rem' }}
      >
        <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900" style={{ letterSpacing: '-0.02em' }}>
          gutezeit
        </h1>
        <div className="flex items-center gap-2">
          <Avatar profile={profile}  size="sm" />
          {partner && (
            <>
              <span className="text-zinc-400 text-xs font-black">×</span>
              <Avatar profile={partner} size="sm" />
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-safe">
        {tab === 'open' && (
          <>
            <FilterBar filters={filters} onChange={setFilters} />
            {loading ? <Spinner /> : (
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
              <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                {completedActivities.length} erledigt
              </p>
            </div>
            {loading ? <Spinner /> : (
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

      {tab === 'open' && <FAB onClick={openCreate} />}
      <BottomNav tab={tab} onChange={(t) => { setTab(t); setFilters(EMPTY_FILTERS) }} />

      <ActivityModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initial={editActivity}
      />
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
    </div>
  )
}
