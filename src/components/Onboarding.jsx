import { useState } from 'react'

export function Onboarding({ login, loading, error }) {
  const [name,     setName]     = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    await login(name, password)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#f5f0e8', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1
          className="text-5xl font-black tracking-tight text-zinc-900 uppercase"
          style={{ letterSpacing: '-0.03em' }}
        >
          gutezeit
        </h1>
        <p className="mt-2 text-zinc-500 text-sm font-medium">für holly & julius</p>
      </div>

      {/* Login card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border-2 border-zinc-900 rounded-xl p-6 flex flex-col gap-4"
        style={{ boxShadow: '4px 4px 0px #18181b' }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-700">
            Name
          </label>
          <input
            type="text"
            placeholder="Wie heißt du?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            autoFocus
            autoComplete="name"
            className="w-full px-3 py-3 border-2 border-zinc-900 rounded-lg text-zinc-900 text-base font-medium outline-none focus:bg-zinc-50 transition-colors placeholder:text-zinc-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-700">
            Passwort
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-3 py-3 border-2 border-zinc-900 rounded-lg text-zinc-900 text-base font-medium outline-none focus:bg-zinc-50 transition-colors placeholder:text-zinc-400"
          />
        </div>

        {error && (
          <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!name.trim() || !password.trim() || loading}
          className="w-full py-3.5 rounded-lg bg-zinc-900 text-white font-black text-base uppercase tracking-wide disabled:opacity-40 transition-all active:translate-x-[2px] active:translate-y-[2px]"
          style={{ boxShadow: '3px 3px 0px #71717a' }}
          onMouseDown={(e) => { e.currentTarget.style.boxShadow = 'none' }}
          onMouseUp={(e) => { e.currentTarget.style.boxShadow = '3px 3px 0px #71717a' }}
          onTouchStart={(e) => { e.currentTarget.style.boxShadow = 'none' }}
          onTouchEnd={(e) => { e.currentTarget.style.boxShadow = '3px 3px 0px #71717a' }}
        >
          {loading ? 'Moment…' : 'Rein →'}
        </button>
      </form>
    </div>
  )
}
