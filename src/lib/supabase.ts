import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xqmhqrkguezadiqmsepc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

// Function to get complete user profile
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

// Function to get DJ financial data
export async function getDJFinancialData(djId: string) {
  const { data, error } = await supabase
    .from('financial_transactions')
    .select('*')
    .eq('user_id', djId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting DJ financial data:', error)
    return []
  }

  return data || []
}

// Function to get DJ media
export async function getDJMedia(djId: string) {
  const { data, error } = await supabase
    .from('media_files')
    .select('*')
    .eq('dj_id', djId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting DJ media:', error)
    return []
  }

  return data || []
}
// Function to sign in
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// Function to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Function to sign up
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
