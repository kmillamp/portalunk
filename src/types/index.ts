// User types
export interface User {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'produtor'
  producer_id?: string | null
  access_code?: string | null
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<{ data: any; error: any }>
}

// DJ types
export interface DJ {
  id: string
  name: string
  email?: string
  phone?: string
  bio?: string
  genres?: string[]
  booking_price?: number
  availability_status: 'available' | 'busy' | 'unavailable'
  instagram_handle?: string
  profile_image_url?: string | null
  created_at: string
  updated_at: string
}

// Event types
export interface Event {
  id: string
  title: string
  description?: string
  event_date: string
  venue: string
  city: string
  state: string
  dj_id?: string
  producer_id?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  booking_fee?: number
  created_at: string
  updated_at: string
}

// Contract types
export interface Contract {
  id: string
  event_id: string
  dj_id: string
  producer_id: string
  contract_value: number
  payment_terms?: string
  additional_terms?: string
  equipment_requirements?: string
  performance_duration?: string
  setup_time?: string
  cancellation_policy?: string
  dress_code?: string
  technical_rider?: string
  status: 'pending' | 'signed' | 'completed' | 'cancelled'
  signed_date?: string | null
  created_at: string
  updated_at: string
}

// Producer types
export interface Producer {
  id: string
  name: string
  company_name?: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  contact_person?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

// Media types
export interface Media {
  id: string
  dj_id?: string
  event_id?: string
  file_url: string
  file_type: 'image' | 'video' | 'audio'
  category: 'presskit' | 'logo' | 'backdrop' | 'performance' | 'other'
  title?: string
  description?: string
  file_size?: string
  created_at: string
  updated_at: string
}

// Financial data types
export interface FinancialData {
  dj_id: string
  total_earnings: number
  pending_payments: number
  completed_events: number
  average_event_value: number
  commission_rate: number
  net_earnings: number
  monthly_earnings: { month: string; amount: number }[]
  created_at: string
  updated_at: string
}

// View types for navigation
export type ViewType = 
  | 'dashboard' 
  | 'calendar' 
  | 'contracts' 
  | 'financial' 
  | 'producers' 
  | 'producer-dashboard'
  | 'dj-details'