import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'

export function Onboarding() {
  const inviteCode = new URLSearchParams(window.location.search).get('invite')
  return inviteCode ? <JoinScreen inviteCode={inviteCode} /> : <CreateScreen />
}

// ── User A: create a couple ────────────────────────────────────────────────
function CreateScreen() {
  const { createCouple, loading, error } = useProfile()
  const [name, setName]         = useState('')
  const [inviteUrl, setInviteUrl] = useState(null)
  const [copied, setCopied]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      const { couple } = await createCouple(name.trim())
      const url = `${window.location.origin}/?invite=${couple.invite_code}`
      setInviteUrl(url)
    } catch {}
  }

  if (inviteUrl) {
    return (
      <Screen>
        <Emoji>🎉</Emoji>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Fast fertig!</h1>
        <p className="text-zinc-500 mb-8 text-center text-sm leading-relaxed">
          Schick deinem Partner diesen Link.<br />Sobald er/sie geklickt hat, geht's los.
        </p>

        <div className="w-full bg-zinc-100 rounded-2xl p-4 mb-4 break-all text-xs text-zinc-600 font-mono">
          {inviteUrl}
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(inviteUrl).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            })
          }}
          className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-semibold text-base active:scale-95 transition-transform"
        >
          {copied ? '✓ Kopiert!' : 'Link kopieren'}
        </button>

        <p className="mt-6 text-xs text-zinc-400 text-center">
          Du wirst automatisch weitergeleitet, sobald dein Partner beigetreten ist.
        </p>
      </Screen>
    )
  }

  return (
    <Screen>
      <Emoji>✨</Emoji>
      <h1 className="text-2xl font-bold text-zinc-900 mb-1">gutezeit</h1>
      <p className="text-zinc-400 mb-10 text-sm">Wie heißt du?</p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="text"
          placeholder="Dein Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          autoFocus
          className="w-full px-4 py-4 rounded-2xl border border-zinc-200 bg-white text-zinc-900 text-base outline-none focus:border-zinc-400 transition-colors"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-semibold text-base disabled:opacity-40 active:scale-95 transition-transform"
        >
          {loading ? 'Moment…' : 'Loslegen →'}
        </button>
      </form>
    </Screen>
  )
}

// ── User B: join via invite code ───────────────────────────────────────────
function JoinScreen({ inviteCode }) {
  const { joinCouple, loading, error } = useProfile()
  const [name, setName] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      await joinCouple(name.trim(), inviteCode)
      // useProfile will update → App re-renders automatically
      window.history.replaceState({}, '', '/')
    } catch {}
  }

  return (
    <Screen>
      <Emoji>💌</Emoji>
      <h1 className="text-2xl font-bold text-zinc-900 mb-1">Du wurdest eingeladen!</h1>
      <p className="text-zinc-400 mb-10 text-sm">Wie heißt du?</p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="text"
          placeholder="Dein Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          autoFocus
          className="w-full px-4 py-4 rounded-2xl border border-zinc-200 bg-white text-zinc-900 text-base outline-none focus:border-zinc-400 transition-colors"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-semibold text-base disabled:opacity-40 active:scale-95 transition-transform"
        >
          {loading ? 'Moment…' : 'Beitreten →'}
        </button>
      </form>
    </Screen>
  )
}

// ── Shared layout ──────────────────────────────────────────────────────────
function Screen({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 safe-top safe-bottom">
      {children}
    </div>
  )
}

function Emoji({ children }) {
  return <div className="text-6xl mb-6 select-none">{children}</div>
}
