export const CATEGORIES = [
  { id: 'academia',     label: 'Soft Academia',                 color: '#b45309', bg: '#fef3c7' },
  { id: 'grass',        label: 'Touching Grass',                color: '#15803d', bg: '#dcfce7' },
  { id: 'npc',          label: 'NPC Side Quests',               color: '#6d28d9', bg: '#ede9fe' },
  { id: 'date',         label: 'Date Night Cinematic Universe', color: '#be123c', bg: '#ffe4e6' },
  { id: 'conditioning', label: 'Conditioning',                  color: '#c2410c', bg: '#ffedd5' },
]

export const AVATAR_COLORS = [
  '#FF6B6B', '#FF8E53', '#FFC947', '#6BCB77', '#4D96FF',
  '#C77DFF', '#FF6BB5', '#00C9A7', '#F4845F', '#4ECDC4',
]

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]
}

export function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })
}
