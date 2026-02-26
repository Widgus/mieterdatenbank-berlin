import { ActivityCard } from './ActivityCard'

export function ActivityList({ activities, onComplete, onUncomplete, onEdit, onDelete, completed = false }) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <div className="text-5xl mb-4 select-none">{completed ? '🎉' : '✨'}</div>
        <p className="text-zinc-400 text-sm">
          {completed
            ? 'Noch nichts erledigt. Ran an die Liste!'
            : 'Keine offenen Aktivitäten. Neue hinzufügen!'}
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 flex flex-col gap-3">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onComplete={onComplete}
          onUncomplete={onUncomplete}
          onEdit={onEdit}
          onDelete={onDelete}
          completed={completed}
        />
      ))}
    </div>
  )
}
