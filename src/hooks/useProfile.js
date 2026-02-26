import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { AVATAR_COLORS } from '../lib/constants'

const PROFILE_KEY = 'gutezeit_profile'
const COUPLE_KEY  = 'gutezeit_couple'

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

  // Load partner on mount + realtime subscription for partner joining
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

  // Create a new couple (User A flow)
  const createCouple = async (displayName) => {
    setLoading(true)
    setError(null)
    try {
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()

      const { data: newCouple, error: coupleErr } = await supabase
        .from('couples')
        .insert({ invite_code: inviteCode })
        .select()
        .single()
      if (coupleErr) throw coupleErr

      const { data: newProfile, error: profileErr } = await supabase
        .from('profiles')
        .insert({ display_name: displayName, avatar_color: randomColor(), couple_id: newCouple.id })
        .select()
        .single()
      if (profileErr) throw profileErr

      localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile))
      localStorage.setItem(COUPLE_KEY,  JSON.stringify(newCouple))
      setProfile(newProfile)
      setCouple(newCouple)
      return { profile: newProfile, couple: newCouple }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Join an existing couple via invite code (User B flow)
  const joinCouple = async (displayName, inviteCode) => {
    setLoading(true)
    setError(null)
    try {
      const { data: foundCouple, error: coupleErr } = await supabase
        .from('couples')
        .select('*')
        .eq('invite_code', inviteCode.trim().toUpperCase())
        .maybeSingle()
      if (coupleErr) throw coupleErr
      if (!foundCouple) throw new Error('Einladungscode nicht gefunden. Bitte nochmal prüfen.')

      const { data: newProfile, error: profileErr } = await supabase
        .from('profiles')
        .insert({ display_name: displayName, avatar_color: randomColor(), couple_id: foundCouple.id })
        .select()
        .single()
      if (profileErr) throw profileErr

      localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile))
      localStorage.setItem(COUPLE_KEY,  JSON.stringify(foundCouple))
      setProfile(newProfile)
      setCouple(foundCouple)
      return newProfile
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { profile, couple, partner, loading, error, createCouple, joinCouple }
}
