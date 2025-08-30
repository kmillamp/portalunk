import type { DJ, Event, Contract, Producer, User } from '@/types'

// Mock DJs data
export const mockDJs: DJ[] = [
  {
    id: '1', 
    name: 'Suzy Prado',
    email: 'suzy@unkassessoria.com',
    phone: '(11) 99999-1111',
    bio: 'DJ e produtora musical com vasta experiência em eventos corporativos e festas exclusivas.',
    genres: ['House', 'Deep House', 'Electronic'],
    booking_price: 8000,
    availability_status: 'available',
    instagram_handle: '@suzyprado',
    profile_image_url: '/suzy.JPEG',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Pedro Theodoro',
    email: 'pedro@unkassessoria.com',
    phone: '(11) 99999-2222',
    bio: 'DJ especializado em música eletrônica e eventos de alto padrão, com repertório diversificado.',
    genres: ['Electronic', 'Techno', 'Progressive'],
    booking_price: 12000,
    availability_status: 'available',
    instagram_handle: '@pedrotheo',
    profile_image_url: '/pedro.JPEG',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

// Mock Events data
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Evento Corporativo Premium',
    description: 'Evento corporativo de fim de ano com DJ Suzy Prado.',
    event_date: '2025-02-15T20:00:00Z',
    venue: 'Hotel Copacabana Palace',
    city: 'São Paulo',
    state: 'SP',
    dj_id: '1',
    producer_id: '1',
    status: 'confirmed',
    booking_fee: 35000,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Festa Privada VIP',
    description: 'Festa privada com Pedro Theodoro para clientes exclusivos.',
    event_date: '2025-03-08T22:00:00Z',
    venue: 'Rooftop Exclusive',
    city: 'Rio de Janeiro',
    state: 'RJ',
    dj_id: '2',
    producer_id: '1',
    status: 'pending',
    booking_fee: 25000,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

// Mock Contracts data
export const mockContracts: Contract[] = [
  {
    id: '1',
    event_id: '1',
    dj_id: '1',
    producer_id: '1',
    contract_value: 8000,
    payment_terms: 'Pagamento em 2 parcelas: 50% na assinatura, 50% após o evento',
    status: 'signed',
    signed_date: '2024-12-01T00:00:00Z',
    created_at: '2024-11-15T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z'
  },
  {
    id: '2',
    event_id: '2',
    dj_id: '2',
    producer_id: '1',
    contract_value: 12000,
    payment_terms: 'Pagamento integral 30 dias antes do evento',
    status: 'pending',
    signed_date: null,
    created_at: '2024-12-10T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z'
  }
]

// Mock Producers data
export const mockProducers: Producer[] = [
  {
    id: '1',
    name: 'Festa Company',
    company_name: 'Festa Company Ltda',
    email: 'contato@festacompany.com',
    phone: '(11) 3333-4444',
    address: 'Rua das Festas, 123',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01234-567',
    contact_person: 'João Silva',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Event Masters',
    company_name: 'Event Masters Eventos',
    email: 'info@eventmasters.com.br',
    phone: '(21) 2222-3333',
    address: 'Av. Copacabana, 456',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zip_code: '22070-001',
    contact_person: 'Maria Santos',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

// Mock login function
export function mockLogin(email: string, password: string): User | null {
  // Admin user
  if (email === 'admin@unk.com' && password === 'admin123') {
    return {
      id: 'admin-1',
      email: 'admin@unk.com',
      full_name: 'Administrador UNK',
      role: 'admin',
      producer_id: null,
      access_code: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }

  // Producer user
  if (email === 'produtor@festacompany.com' && password === 'prod123') {
    return {
      id: 'producer-1',
      email: 'produtor@festacompany.com',
      full_name: 'João Silva',
      role: 'produtor',
      producer_id: '1',
      access_code: 'FESTA2024',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }

  // Another producer user
  if (email === 'maria@eventmasters.com.br' && password === 'event123') {
    return {
      id: 'producer-2',
      email: 'maria@eventmasters.com.br',
      full_name: 'Maria Santos',
      role: 'produtor',
      producer_id: '2',
      access_code: 'EVENT2024',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }

  return null
}