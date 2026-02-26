import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { AVATAR_COLORS } from '../lib/constants'

const PROFILE_KEY = 'gutezeit_profile'
const COUPLE_KEY  = 'gutezeit_couple'
const SHARED_PASSWORD = 'zuzweit'
const FIXED_INVITE_CODE = 'ZUZWEIT'

function randomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}

export function useProfile() {
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) } catch { return null }
  })
  const [couple, setCouple] = useState(() => {
    try { return JSON.parse(localStorage.getItem(COUPLE_KEY)) } catch { return null }
  })
  const [partner, setPartner] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const loadPartner = useCallback(async (coupleId, myId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('couple_id', coupleId)
      .neq('id', myId)
      .maybeSingle()
    if (data) setPartner(data)
  }, [])

  useEffect(() => {
    if (!profile?.couple_id) return
    loadPartner(profile.couple_id, profile.id)

    const channel = supabase
      .channel(`profiles:couple:${profile.couple_id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles', filter: `couple_id=eq.${profile.couple_id}` },
        () => loadPartner(profile.couple_id, profile.id)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [profile?.couple_id, profile?.id, loadPartner])

  /**
   * Shared-password login:
   * 1. Verify password
   * 2. Find or create the fixed couple (invite_code = 'ZUZWEIT')
   * 3. Find existing profile by name (returning user / new device) or create new one
   * 4. Store in localStorage → app renders main view
   */
  const login = async (displayName, password) => {
    setLoading(true)
    setError(null)

    if (password.trim().toLowerCase() !== SHARED_PASSWORD) {
      setError('Falsches Passwort.')
      setLoading(false)
      return
    }
    if (!displayName.trim()) {
      setError('Bitte gib deinen Namen ein.')
      setLoading(false)
      return
    }

    try {
      // Find or create the shared couple
      let foundCouple
      const { data: existing } = await supabase
        .from('couples')
        .select('*')
        .eq('invite_code', FIXED_INVITE_CODE)
        .maybeSingle()

      if (existing) {
        foundCouple = existing
      } else {
        const { data: created, error: createErr } = await supabase
          .from('couples')
          .insert({ invite_code: FIXED_INVITE_CODE })
          .select()
          .single()
        if (createErr) throw createErr
        foundCouple = created
      }

      // Find existing profile with this name (returning user on new device)
      let foundProfile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('couple_id', foundCouple.id)
        .ilike('display_name', displayName.trim())
        .maybeSingle()

      if (existingProfile) {
        foundProfile = existingProfile
      } else {
        const { data: newProfile, error: profileErr } = await supabase
          .from('profiles')
          .insert({ display_name: displayName.trim(), avatar_color: randomColor(), couple_id: foundCouple.id })
          .select()
          .single()
        if (profileErr) throw profileErr
        foundProfile = newProfile
      }

      localStorage.setItem(PROFILE_KEY, JSON.stringify(foundProfile))
      localStorage.setItem(COUPLE_KEY,  JSON.stringify(foundCouple))
      setProfile(foundProfile)
      setCouple(foundCouple)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { profile, couple, partner, loading, error, login }
}
