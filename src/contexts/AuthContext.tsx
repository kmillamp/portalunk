import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, AuthContextType } from '@/types'
import { supabase, getUserProfile } from '@/lib/supabase'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificar sessão do Supabase na inicialização
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }

        if (session?.user) {
          const profile = await getUserProfile(session.user.id)
          if (profile) {
            const userData: User = {
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name || undefined,
              role: profile.role,
              producer_id: profile.producer_id || undefined,
              access_code: profile.access_code || undefined,
              created_at: profile.created_at,
              updated_at: profile.updated_at
            }
            setUser(userData)
          }
        }
      } catch (error) {
        console.error('Error loading session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await getUserProfile(session.user.id)
        if (profile) {
          const userData: User = {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name || undefined,
            role: profile.role,
            producer_id: profile.producer_id || undefined,
            access_code: profile.access_code || undefined,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          }
          setUser(userData)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { data: null, error }
      }

      // Get user profile
      const profile = await getUserProfile(data.user.id)
      if (profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name || undefined,
          role: profile.role,
          producer_id: profile.producer_id || undefined,
          access_code: profile.access_code || undefined,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }
        setUser(userData)
        return { data: { user: userData }, error: null }
      }

      return { data, error: null }
      
    } catch (error: any) {
      console.error('Erro no login:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setUser(null)
      await supabase.auth.signOut()
      
    } catch (error: any) {
      console.error('Erro no logout:', error)
    }
  }

  const signUp = async (email: string, password: string, userData?: Partial<User>) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name,
            role: userData?.role || 'produtor'
          }
        }
      })

      if (error) {
        return { data: null, error }
      }

      return { data, error: null }
      
    } catch (error: any) {
      console.error('Erro no registro:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    signUp
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
