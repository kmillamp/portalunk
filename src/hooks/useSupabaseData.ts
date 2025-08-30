import { useState, useEffect } from 'react'
import { supabase, getDJs, getEvents, getContracts, getProducers, getDJFinancialData, getDJMedia } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { DJ, Event, Contract, Producer } from '@/types'

export function useSupabaseData() {
  const { user } = useAuth()
  const [djs, setDJs] = useState<DJ[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [producers, setProducers] = useState<Producer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const [djsData, eventsData, contractsData, producersData] = await Promise.all([
        getDJs(),
        getEvents(),
        getContracts(),
        getProducers()
      ])

      // Transform data to match existing types
      setDJs(djsData.map(dj => ({
        ...dj,
        genres: dj.genres || []
      })))

      setEvents(eventsData.map(event => ({
        ...event,
        booking_fee: event.booking_fee || undefined
      })))

      setContracts(contractsData)
      setProducers(producersData)

    } catch (err: any) {
      console.error('Error loading data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return

    const djsSubscription = supabase
      .channel('djs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'djs' }, () => {
        loadData()
      })
      .subscribe()

    const eventsSubscription = supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        loadData()
      })
      .subscribe()

    const contractsSubscription = supabase
      .channel('contracts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contracts' }, () => {
        loadData()
      })
      .subscribe()

    return () => {
      djsSubscription.unsubscribe()
      eventsSubscription.unsubscribe()
      contractsSubscription.unsubscribe()
    }
  }, [user])

  const addDJ = async (djData: Omit<DJ, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('djs')
        .insert([djData])
        .select()
        .single()

      if (error) throw error

      setDJs(prev => [...prev, data])
      return { data, error: null }
    } catch (err: any) {
      console.error('Error adding DJ:', err)
      return { data: null, error: err }
    }
  }

  const updateDJ = async (djId: string, updates: Partial<DJ>) => {
    try {
      const { data, error } = await supabase
        .from('djs')
        .update(updates)
        .eq('id', djId)
        .select()
        .single()

      if (error) throw error

      setDJs(prev => prev.map(dj => dj.id === djId ? { ...dj, ...data } : dj))
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating DJ:', err)
      return { data: null, error: err }
    }
  }

  const addEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single()

      if (error) throw error

      setEvents(prev => [...prev, data])
      return { data, error: null }
    } catch (err: any) {
      console.error('Error adding event:', err)
      return { data: null, error: err }
    }
  }

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single()

      if (error) throw error

      setEvents(prev => prev.map(event => event.id === eventId ? { ...event, ...data } : event))
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating event:', err)
      return { data: null, error: err }
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      setEvents(prev => prev.filter(event => event.id !== eventId))
      return { error: null }
    } catch (err: any) {
      console.error('Error deleting event:', err)
      return { error: err }
    }
  }

  const addProducer = async (producerData: Omit<Producer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('producers')
        .insert([producerData])
        .select()
        .single()

      if (error) throw error

      setProducers(prev => [...prev, data])
      return { data, error: null }
    } catch (err: any) {
      console.error('Error adding producer:', err)
      return { data: null, error: err }
    }
  }

  return {
    djs,
    events,
    contracts,
    producers,
    loading,
    error,
    addDJ,
    updateDJ,
    addEvent,
    updateEvent,
    deleteEvent,
    addProducer,
    refetch: loadData
  }
}