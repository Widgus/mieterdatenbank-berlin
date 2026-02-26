export function Avatar({ profile, size = 'sm' }) {
  if (!profile) return null

  const sizes = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  }

  const initials = profile.display_name?.charAt(0).toUpperCase() ?? '?'

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ backgroundColor: profile.avatar_color ?? '#71717a' }}
      title={profile.display_name}
    >
      {initials}
    </div>
  )
}
