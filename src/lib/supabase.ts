import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xqmhqrkguezadiqmsepc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Função auxiliar para obter o usuário atual
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

// Função para obter perfil completo do usuário
export async function getUserProfile(userId?: string) {
  const targetId = userId || (await getCurrentUser())?.id
  if (!targetId) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetId)
    .maybeSingle()

  if (error) {
    console.error('Error getting user profile:', error)
    return null
  }

  return data
}

// Função para obter DJs (com filtros baseados no usuário)
export async function getDJs() {
  const { data, error } = await supabase
    .from('djs')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error getting DJs:', error)
    return []
  }

  return data || []
}

// Função para obter eventos (com filtros baseados no usuário)
export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      djs(name, profile_image_url),
      producers(name, company_name)
    `)
    .order('event_date')

  if (error) {
    console.error('Error getting events:', error)
    return []
  }

  return data || []
}

// Função para obter contratos
export async function getContracts() {
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      events(title, event_date, venue, city),
      djs(name, email),
      producers(name, company_name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting contracts:', error)
    return []
  }

  return data || []
}

// Função para obter produtores
export async function getProducers() {
  const { data, error } = await supabase
    .from('producers')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error getting producers:', error)
    return []
  }

  return data || []
}

// Função para obter dados financeiros de um DJ
export async function getDJFinancialData(djId: string) {
  const { data, error } = await supabase
    .from('financial_data')
    .select(`
      *,
      monthly_earnings(year, month, amount, events_count)
    `)
    .eq('dj_id', djId)
    .maybeSingle()

  if (error) {
    console.error('Error getting DJ financial data:', error)
    return null
  }

  return data
}

// Função para obter mídia de um DJ
export async function getDJMedia(djId: string) {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('dj_id', djId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting DJ media:', error)
    return []
  }

  return data || []
}
// Função para fazer login
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// Função para fazer logout
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Função para registrar usuário
export async function signUp(email: string, password: string, metadata?: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
  return { data, error }
}
