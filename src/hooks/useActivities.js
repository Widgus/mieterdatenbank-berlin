import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useActivities(coupleId, profileId) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading]       = useState(true)

  const load = useCallback(async () => {
    if (!coupleId) return
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        creator:profiles!created_by ( id, display_name, avatar_color ),
        completer:profiles!completed_by ( id, display_name, avatar_color )
      `)
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false })

    if (!error) setActivities(data ?? [])
    setLoading(false)
  }, [coupleId])

  useEffect(() => {
    if (!coupleId) return
    load()

    const channel = supabase
      .channel(`activities:couple:${coupleId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities', filter: `couple_id=eq.${coupleId}` },
        () => load()          // always reload to get fresh joined data
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId, load])

  const create = async (fields) => {
    const { error } = await supabase
      .from('activities')
      .insert({ ...fields, couple_id: coupleId, created_by: profileId })
    if (error) throw error
    // realtime will trigger reload
  }

  const update = async (id, fields) => {
    const { error } = await supabase
      .from('activities')
      .update(fields)
      .eq('id', id)
    if (error) throw error
  }

  const complete = async (id) => {
    await update(id, {
      is_completed: true,
      completed_at: new Date().toISOString(),
      completed_by: profileId,
    })
  }

  const uncomplete = async (id) => {
    await update(id, { is_completed: false, completed_at: null, completed_by: null })
  }

  const remove = async (id) => {
    const { error } = await supabase.from('activities').delete().eq('id', id)
    if (error) throw error
  }

  return { activities, loading, create, update, complete, uncomplete, remove }
}
