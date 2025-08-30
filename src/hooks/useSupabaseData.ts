import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
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

  // Get DJs from Supabase
  const getDJs = async () => {
    const { data, error } = await supabase
      .from('djs')
      .select(`
        id,
        artist_name,
        real_name,
        bio,
        avatar_url,
        genres,
        phone,
        email,
        base_price,
        status,
        whatsapp,
        soundcloud,
        youtube,
        spotify,
        facebook,
        experience_years,
        equipment_owned,
        rider_requirements,
        is_active,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .order('artist_name')

    if (error) throw error

    // Transform to match frontend DJ type
    return (data || []).map(dj => ({
      id: dj.id,
      name: dj.artist_name,
      email: dj.email,
      phone: dj.phone || dj.whatsapp,
      bio: dj.bio,
      genres: dj.genres || [],
      booking_price: dj.base_price,
      availability_status: dj.status === 'disponivel' ? 'available' as const : 
                          dj.status === 'ocupado' ? 'busy' as const : 'unavailable' as const,
      instagram_handle: undefined, // Not in current schema
      profile_image_url: dj.avatar_url,
      created_at: dj.created_at,
      updated_at: dj.updated_at
    }))
  }

  // Get Events from Supabase
  const getEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        event_name,
        event_date,
        description,
        producer,
        venue,
        fee,
        payment_status,
        dj_id,
        producer_id,
        start_time,
        end_time,
        address,
        state,
        status,
        expected_attendees,
        dress_code,
        special_requirements,
        equipment_provided,
        created_at,
        updated_at
      `)
      .order('event_date')

    if (error) throw error

    // Transform to match frontend Event type
    return (data || []).map(event => ({
      id: event.id,
      title: event.event_name,
      description: event.description,
      event_date: event.event_date,
      venue: event.venue || '',
      city: event.address || '',
      state: event.state || '',
      dj_id: event.dj_id,
      producer_id: event.producer_id,
      status: event.status === 'pendente' ? 'pending' as const :
              event.status === 'confirmado' ? 'confirmed' as const :
              event.status === 'concluido' ? 'completed' as const : 'cancelled' as const,
      booking_fee: event.fee,
      created_at: event.created_at,
      updated_at: event.updated_at
    }))
  }

  // Get Contracts from Supabase
  const getContracts = async () => {
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        id,
        event_id,
        dj_id,
        producer_id,
        fee,
        commission_rate,
        commission_amount,
        payment_terms,
        cancellation_policy,
        is_signed_by_producer,
        is_signed_by_dj,
        signed_at,
        contract_url,
        custom_clauses,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform to match frontend Contract type
    return (data || []).map(contract => ({
      id: contract.id,
      event_id: contract.event_id,
      dj_id: contract.dj_id,
      producer_id: contract.producer_id,
      contract_value: contract.fee,
      payment_terms: contract.payment_terms,
      additional_terms: contract.custom_clauses ? JSON.stringify(contract.custom_clauses) : undefined,
      equipment_requirements: undefined,
      performance_duration: undefined,
      setup_time: undefined,
      cancellation_policy: contract.cancellation_policy,
      dress_code: undefined,
      technical_rider: undefined,
      status: (contract.is_signed_by_producer && contract.is_signed_by_dj) ? 'signed' as const : 'pending' as const,
      signed_date: contract.signed_at,
      created_at: contract.created_at,
      updated_at: contract.updated_at
    }))
  }

  // Get Producers from Supabase
  const getProducers = async () => {
    const { data, error } = await supabase
      .from('producers')
      .select(`
        id,
        company_name,
        cnpj,
        business_address,
        contact_person,
        contact_email,
        contact_phone,
        is_active,
        notes,
        created_at,
        updated_at
      `)
      .order('company_name')

    if (error) throw error

    // Transform to match frontend Producer type
    return (data || []).map(producer => ({
      id: producer.id,
      name: producer.company_name || 'Produtor sem nome',
      company_name: producer.company_name,
      email: producer.contact_email || '',
      phone: producer.contact_phone,
      address: producer.business_address,
      city: undefined, // Not in current schema
      state: undefined, // Not in current schema
      zip_code: undefined, // Not in current schema
      contact_person: producer.contact_person,
      status: producer.is_active ? 'active' as const : 'inactive' as const,
      created_at: producer.created_at,
      updated_at: producer.updated_at
    }))
  }

  const loadData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const [djsData, eventsData, contractsData, producersData] = await Promise.allSettled([
        getDJs(),
        getEvents(),
        getContracts(),
        getProducers()
      ])

      // Handle results from Promise.allSettled
      if (djsData.status === 'fulfilled') {
        setDJs(djsData.value)
      } else {
        console.error('Error loading DJs:', djsData.reason)
      }

      if (eventsData.status === 'fulfilled') {
        setEvents(eventsData.value)
      } else {
        console.error('Error loading events:', eventsData.reason)
      }

      if (contractsData.status === 'fulfilled') {
        setContracts(contractsData.value)
      } else {
        console.error('Error loading contracts:', contractsData.reason)
      }

      if (producersData.status === 'fulfilled') {
        setProducers(producersData.value)
      } else {
        console.error('Error loading producers:', producersData.reason)
      }

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
      // Transform frontend DJ data to Supabase schema
      const supabaseData = {
        artist_name: djData.name,
        real_name: djData.name, // Using same as artist name for now
        bio: djData.bio,
        avatar_url: djData.profile_image_url,
        genres: djData.genres,
        phone: djData.phone,
        email: djData.email,
        base_price: djData.booking_price,
        status: djData.availability_status === 'available' ? 'disponivel' :
                djData.availability_status === 'busy' ? 'ocupado' : 'inativo',
        whatsapp: djData.phone,
        is_active: true
      }
      
      const { data, error } = await supabase
        .from('djs')
        .insert([supabaseData])
        .select()
        .single()

      if (error) throw error

      // Transform back to frontend format and update state
      const newDJ: DJ = {
        id: data.id,
        name: data.artist_name,
        email: data.email,
        phone: data.phone || data.whatsapp,
        bio: data.bio,
        genres: data.genres || [],
        booking_price: data.base_price,
        availability_status: data.status === 'disponivel' ? 'available' : 
                            data.status === 'ocupado' ? 'busy' : 'unavailable',
        instagram_handle: undefined,
        profile_image_url: data.avatar_url,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
      
      setDJs(prev => [...prev, newDJ])
      return { data, error: null }
    } catch (err: any) {
      console.error('Error adding DJ:', err)
      return { data: null, error: err }
    }
  }

  const updateDJ = async (djId: string, updates: Partial<DJ>) => {
    try {
      // Transform frontend updates to Supabase schema
      const supabaseUpdates: any = {}
      
      if (updates.name) supabaseUpdates.artist_name = updates.name
      if (updates.bio !== undefined) supabaseUpdates.bio = updates.bio
      if (updates.profile_image_url !== undefined) supabaseUpdates.avatar_url = updates.profile_image_url
      if (updates.genres !== undefined) supabaseUpdates.genres = updates.genres
      if (updates.phone !== undefined) {
        supabaseUpdates.phone = updates.phone
        supabaseUpdates.whatsapp = updates.phone
      }
      if (updates.email !== undefined) supabaseUpdates.email = updates.email
      if (updates.booking_price !== undefined) supabaseUpdates.base_price = updates.booking_price
      if (updates.availability_status !== undefined) {
        supabaseUpdates.status = updates.availability_status === 'available' ? 'disponivel' :
                                 updates.availability_status === 'busy' ? 'ocupado' : 'inativo'
      }
      
      const { data, error } = await supabase
        .from('djs')
        .update(supabaseUpdates)
        .eq('id', djId)
        .select()
        .single()

      if (error) throw error

      // Transform back and update state
      const updatedDJ: DJ = {
        id: data.id,
        name: data.artist_name,
        email: data.email,
        phone: data.phone || data.whatsapp,
        bio: data.bio,
        genres: data.genres || [],
        booking_price: data.base_price,
        availability_status: data.status === 'disponivel' ? 'available' : 
                            data.status === 'ocupado' ? 'busy' : 'unavailable',
        instagram_handle: undefined,
        profile_image_url: data.avatar_url,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
      
      setDJs(prev => prev.map(dj => dj.id === djId ? updatedDJ : dj))
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating DJ:', err)
      return { data: null, error: err }
    }
  }

  const addEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Transform frontend Event data to Supabase schema
      const supabaseData = {
        event_name: eventData.title,
        event_date: eventData.event_date,
        description: eventData.description,
        venue: eventData.venue,
        address: eventData.city,
        state: eventData.state,
        fee: eventData.booking_fee,
        dj_id: eventData.dj_id,
        producer_id: eventData.producer_id,
        status: eventData.status === 'pending' ? 'pendente' :
                eventData.status === 'confirmed' ? 'confirmado' :
                eventData.status === 'completed' ? 'concluido' : 'cancelado'
      }
      
      const { data, error } = await supabase
        .from('events')
        .insert([supabaseData])
        .select()
        .single()

      if (error) throw error

      // Transform back to frontend format
      const newEvent: Event = {
        id: data.id,
        title: data.event_name,
        description: data.description,
        event_date: data.event_date,
        venue: data.venue || '',
        city: data.address || '',
        state: data.state || '',
        dj_id: data.dj_id,
        producer_id: data.producer_id,
        status: data.status === 'pendente' ? 'pending' :
                data.status === 'confirmado' ? 'confirmed' :
                data.status === 'concluido' ? 'completed' : 'cancelled',
        booking_fee: data.fee,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
      
      setEvents(prev => [...prev, newEvent])
      return { data, error: null }
    } catch (err: any) {
      console.error('Error adding event:', err)
      return { data: null, error: err }
    }
  }

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    try {
      // Transform frontend updates to Supabase schema
      const supabaseUpdates: any = {}
      
      if (updates.title) supabaseUpdates.event_name = updates.title
      if (updates.description !== undefined) supabaseUpdates.description = updates.description
      if (updates.event_date) supabaseUpdates.event_date = updates.event_date
      if (updates.venue !== undefined) supabaseUpdates.venue = updates.venue
      if (updates.city !== undefined) supabaseUpdates.address = updates.city
      if (updates.state !== undefined) supabaseUpdates.state = updates.state
      if (updates.booking_fee !== undefined) supabaseUpdates.fee = updates.booking_fee
      if (updates.dj_id !== undefined) supabaseUpdates.dj_id = updates.dj_id
      if (updates.producer_id !== undefined) supabaseUpdates.producer_id = updates.producer_id
      if (updates.status !== undefined) {
        supabaseUpdates.status = updates.status === 'pending' ? 'pendente' :
                                 updates.status === 'confirmed' ? 'confirmado' :
                                 updates.status === 'completed' ? 'concluido' : 'cancelado'
      }
      
      const { data, error } = await supabase
        .from('events')
        .update(supabaseUpdates)
        .eq('id', eventId)
        .select()
        .single()

      if (error) throw error

      // Transform back and update state
      const updatedEvent: Event = {
        id: data.id,
        title: data.event_name,
        description: data.description,
        event_date: data.event_date,
        venue: data.venue || '',
        city: data.address || '',
        state: data.state || '',
        dj_id: data.dj_id,
        producer_id: data.producer_id,
        status: data.status === 'pendente' ? 'pending' :
                data.status === 'confirmado' ? 'confirmed' :
                data.status === 'concluido' ? 'completed' : 'cancelled',
        booking_fee: data.fee,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
      
      setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event))
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
      // Transform frontend Producer data to Supabase schema
      const supabaseData = {
        company_name: producerData.name,
        business_address: producerData.address,
        contact_person: producerData.contact_person,
        contact_email: producerData.email,
        contact_phone: producerData.phone,
        is_active: producerData.status === 'active',
        notes: `Cidade: ${producerData.city || ''}, Estado: ${producerData.state || ''}`
      }
      
      const { data, error } = await supabase
        .from('producers')
        .insert([supabaseData])
        .select()
        .single()

      if (error) throw error

      // Transform back to frontend format
      const newProducer: Producer = {
        id: data.id,
        name: data.company_name || 'Produtor sem nome',
        company_name: data.company_name,
        email: data.contact_email || '',
        phone: data.contact_phone,
        address: data.business_address,
        city: undefined,
        state: undefined,
        zip_code: undefined,
        contact_person: data.contact_person,
        status: data.is_active ? 'active' : 'inactive',
        created_at: data.created_at,
        updated_at: data.updated_at
      }
      
      setProducers(prev => [...prev, newProducer])
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