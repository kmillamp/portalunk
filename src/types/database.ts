export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'dj' | 'produtor'
          producer_id: string | null
          access_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'dj' | 'produtor'
          producer_id?: string | null
          access_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'dj' | 'produtor'
          producer_id?: string | null
          access_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      producers: {
        Row: {
          id: string
          name: string
          company_name: string | null
          email: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          contact_person: string | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          company_name?: string | null
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          contact_person?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          company_name?: string | null
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          contact_person?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      djs: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          bio: string | null
          genres: string[] | null
          booking_price: number | null
          availability_status: 'available' | 'busy' | 'unavailable'
          instagram_handle: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          bio?: string | null
          genres?: string[] | null
          booking_price?: number | null
          availability_status?: 'available' | 'busy' | 'unavailable'
          instagram_handle?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          bio?: string | null
          genres?: string[] | null
          booking_price?: number | null
          availability_status?: 'available' | 'busy' | 'unavailable'
          instagram_handle?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          venue: string
          city: string
          state: string
          dj_id: string | null
          producer_id: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          booking_fee: number | null
          ticket_price: number | null
          expected_attendance: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          venue: string
          city: string
          state: string
          dj_id?: string | null
          producer_id?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          booking_fee?: number | null
          ticket_price?: number | null
          expected_attendance?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          venue?: string
          city?: string
          state?: string
          dj_id?: string | null
          producer_id?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          booking_fee?: number | null
          ticket_price?: number | null
          expected_attendance?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          event_id: string
          dj_id: string
          producer_id: string
          contract_value: number
          payment_terms: string | null
          additional_terms: string | null
          equipment_requirements: string | null
          performance_duration: string | null
          setup_time: string | null
          cancellation_policy: string | null
          dress_code: string | null
          technical_rider: string | null
          status: 'pending' | 'signed' | 'completed' | 'cancelled'
          signed_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          dj_id: string
          producer_id: string
          contract_value: number
          payment_terms?: string | null
          additional_terms?: string | null
          equipment_requirements?: string | null
          performance_duration?: string | null
          setup_time?: string | null
          cancellation_policy?: string | null
          dress_code?: string | null
          technical_rider?: string | null
          status?: 'pending' | 'signed' | 'completed' | 'cancelled'
          signed_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          dj_id?: string
          producer_id?: string
          contract_value?: number
          payment_terms?: string | null
          additional_terms?: string | null
          equipment_requirements?: string | null
          performance_duration?: string | null
          setup_time?: string | null
          cancellation_policy?: string | null
          dress_code?: string | null
          technical_rider?: string | null
          status?: 'pending' | 'signed' | 'completed' | 'cancelled'
          signed_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          dj_id: string | null
          event_id: string | null
          file_url: string
          file_type: 'image' | 'video' | 'audio'
          category: 'presskit' | 'logo' | 'backdrop' | 'performance' | 'other'
          title: string
          description: string | null
          file_size: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dj_id?: string | null
          event_id?: string | null
          file_url: string
          file_type?: 'image' | 'video' | 'audio'
          category?: 'presskit' | 'logo' | 'backdrop' | 'performance' | 'other'
          title: string
          description?: string | null
          file_size?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dj_id?: string | null
          event_id?: string | null
          file_url?: string
          file_type?: 'image' | 'video' | 'audio'
          category?: 'presskit' | 'logo' | 'backdrop' | 'performance' | 'other'
          title?: string
          description?: string | null
          file_size?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      financial_data: {
        Row: {
          id: string
          dj_id: string
          total_earnings: number
          pending_payments: number
          completed_events: number
          average_event_value: number
          commission_rate: number
          net_earnings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dj_id: string
          total_earnings?: number
          pending_payments?: number
          completed_events?: number
          average_event_value?: number
          commission_rate?: number
          net_earnings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dj_id?: string
          total_earnings?: number
          pending_payments?: number
          completed_events?: number
          average_event_value?: number
          commission_rate?: number
          net_earnings?: number
          created_at?: string
          updated_at?: string
        }
      }
      monthly_earnings: {
        Row: {
          id: string
          dj_id: string
          year: number
          month: number
          amount: number
          events_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dj_id: string
          year: number
          month: number
          amount?: number
          events_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dj_id?: string
          year?: number
          month?: number
          amount?: number
          events_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_role: {
        Args: {
          user_id: string
          new_role: 'admin' | 'dj' | 'produtor'
          new_producer_id?: string
        }
        Returns: void
      }
      get_platform_stats: {
        Args: {}
        Returns: Json
      }
      calculate_dj_financials: {
        Args: {
          target_dj_id: string
        }
        Returns: void
      }
      generate_producer_access_code: {
        Args: {
          producer_id: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: 'admin' | 'dj' | 'produtor'
      producer_status: 'active' | 'inactive'
      dj_availability_status: 'available' | 'busy' | 'unavailable'
      event_status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
      contract_status: 'pending' | 'signed' | 'completed' | 'cancelled'
      media_file_type: 'image' | 'video' | 'audio'
      media_category: 'presskit' | 'logo' | 'backdrop' | 'performance' | 'other'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}