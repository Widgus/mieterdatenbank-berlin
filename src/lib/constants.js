export const CATEGORIES = [
  { id: 'food',    label: 'Essen',      color: '#f97316', bg: '#fff7ed', icon: 'UtensilsCrossed' },
  { id: 'travel',  label: 'Reisen',     color: '#3b82f6', bg: '#eff6ff', icon: 'Plane' },
  { id: 'home',    label: 'Zuhause',    color: '#22c55e', bg: '#f0fdf4', icon: 'Home' },
  { id: 'sport',   label: 'Sport',      color: '#ef4444', bg: '#fef2f2', icon: 'Dumbbell' },
  { id: 'culture', label: 'Kultur',     color: '#a855f7', bg: '#faf5ff', icon: 'Palette' },
  { id: 'other',   label: 'Sonstiges',  color: '#71717a', bg: '#f4f4f5', icon: 'Tag' },
]

export const PRIORITIES = [
  { id: 'high',   label: 'Hoch',     color: '#ef4444' },
  { id: 'medium', label: 'Mittel',   color: '#f97316' },
  { id: 'low',    label: 'Niedrig',  color: '#22c55e' },
]

export const AVATAR_COLORS = [
  '#FF6B6B', '#FF8E53', '#FFC947', '#6BCB77', '#4D96FF',
  '#C77DFF', '#FF6BB5', '#00C9A7', '#F4845F', '#4ECDC4',
]

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[5]
}

export function getPriorityById(id) {
  return PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[1]
}

export function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })
}
