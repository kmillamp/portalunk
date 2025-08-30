import React, { useState } from 'react'
import { 
  ArrowLeft, Calendar, Image, DollarSign, User, Music, 
  Phone, Mail, Instagram, MapPin, Clock, Star, Download,
  Upload, Edit, Save, X, Play, Pause, Volume2, ExternalLink,
  Plus, Eye, Trash2
} from 'lucide-react'
import type { DJ, Event } from '@/types'
import DJCalendar from './DJCalendar'
import EventModal from './EventModal'

interface DJProfileProps {
  dj: DJ
  onBack: () => void
  events: Event[]
  onDJUpdate?: (updatedDJ: DJ) => void
  onEventAdded?: (event: Event) => void
  onEventUpdated?: (event: Event) => void
  onEventDeleted?: (eventId: string) => void
}

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'audio'
  url: string
  title: string
  description?: string
  category: 'presskit' | 'logo' | 'backdrop' | 'performance' | 'other'
}

interface FinancialData {
  totalEarnings: number
  pendingPayments: number
  completedEvents: number
  averageEventValue: number
  monthlyEarnings: { month: string; amount: number }[]
}

export default function DJProfile({ 
  dj, 
  onBack, 
  events, 
  onDJUpdate,
  onEventAdded,
  onEventUpdated,
  onEventDeleted
}: DJProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'media' | 'financial'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [eventModalMode, setEventModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [isLoadingFinancials, setIsLoadingFinancials] = useState(false)
  
  // Estado para edição do DJ
  const [editData, setEditData] = useState({
    name: dj.name,
    email: dj.email || '',
    phone: dj.phone || '',
    bio: dj.bio || '',
    genres: dj.genres || [],
    booking_price: dj.booking_price || 0,
    availability_status: dj.availability_status,
    instagram_handle: dj.instagram_handle || '',
    profile_image_url: dj.profile_image_url || ''
  })

  const availableGenres = [
    'Electronic', 'House', 'Deep House', 'Tech House', 'Techno', 
    'Progressive', 'Trance', 'Pop', 'Funk', 'Hip Hop', 'R&B', 
    'Rock', 'Reggaeton', 'Trap', 'Bass', 'Ambient'
  ]

  // Mock media data - will be replaced with real Supabase data
  const mockMedia: MediaItem[] = [
    {
      id: '1',
      type: 'image',
      url: dj.profile_image_url || '/suzy.prado.JPEG',
      title: 'Logo Principal',
      category: 'logo'
    },
    {
      id: '2',
      type: 'image',
      url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      title: 'Backdrop para Eventos',
      category: 'backdrop'
    },
    {
      id: '3',
      type: 'image',
      url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
      title: 'Press Kit - Foto 1',
      description: 'Foto profissional para divulgação',
      category: 'presskit'
    },
    {
      id: '4',
      type: 'image',
      url: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg',
      title: 'Performance ao Vivo',
      category: 'performance'
    }
  ]

  // Calculate real financial data from events
  const calculateFinancialData = (): FinancialData => {
    const djEvents = events.filter(event => event.dj_id === dj.id)
    const completedEvents = djEvents.filter(event => event.status === 'completed')
    const pendingEvents = djEvents.filter(event => event.status === 'confirmed' || event.status === 'pending')
    
    const totalEarnings = completedEvents.reduce((sum, event) => sum + (event.booking_fee || 0), 0)
    const pendingPayments = pendingEvents.reduce((sum, event) => sum + (event.booking_fee || 0), 0)
    const averageEventValue = completedEvents.length > 0 ? totalEarnings / completedEvents.length : 0
    
    // Calculate monthly earnings for the last 6 months
    const monthlyEarnings = []
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthEvents = completedEvents.filter(event => {
        const eventDate = new Date(event.event_date)
        return eventDate.getMonth() === date.getMonth() && 
               eventDate.getFullYear() === date.getFullYear()
      })
      
      monthlyEarnings.push({
        month: months[date.getMonth()],
        amount: monthEvents.reduce((sum, event) => sum + (event.booking_fee || 0), 0)
      })
    }
    
    return {
      totalEarnings,
      pendingPayments,
      completedEvents: completedEvents.length,
      averageEventValue,
      monthlyEarnings
    }
  }

  const financialData = calculateFinancialData()
  
  // Filtrar eventos do DJ
  const djEvents = events.filter(event => event.dj_id === dj.id)
  const upcomingEvents = djEvents.filter(event => new Date(event.event_date) > new Date())
  const pastEvents = djEvents.filter(event => new Date(event.event_date) <= new Date())

  const handleSaveProfile = () => {
    if (onDJUpdate) {
      const updatedDJ: DJ = {
        ...dj,
        ...editData,
        updated_at: new Date().toISOString()
      }
      onDJUpdate(updatedDJ)
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditData({
      name: dj.name,
      email: dj.email || '',
      phone: dj.phone || '',
      bio: dj.bio || '',
      genres: dj.genres || [],
      booking_price: dj.booking_price || 0,
      availability_status: dj.availability_status,
      instagram_handle: dj.instagram_handle || '',
      profile_image_url: dj.profile_image_url || ''
    })
    setIsEditing(false)
  }

  const handleGenreToggle = (genre: string) => {
    setEditData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setEventModalMode('create')
    setShowEventModal(true)
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setEventModalMode('edit')
    setShowEventModal(true)
  }

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event)
    setEventModalMode('view')
    setShowEventModal(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      if (onEventDeleted) {
        onEventDeleted(eventId)
      }
    }
  }

  const getMediaByCategory = (category: MediaItem['category']) => {
    return mockMedia.filter(item => item.category === category)
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: User },
    { id: 'calendar', label: 'Agenda', icon: Calendar },
    { id: 'media', label: 'Mídia', icon: Image },
    { id: 'financial', label: 'Financeiro', icon: DollarSign }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white neon-text">Perfil do DJ</h1>
          <p className="text-gray-400">{dj.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/20 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-semibold text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </button>
          )}
        </div>
      </div>

      {/* DJ Header Card */}
      <div className="glass rounded-2xl p-8 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Profile Image */}
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
            {(isEditing ? editData.profile_image_url : dj.profile_image_url) ? (
              <img 
                src={isEditing ? editData.profile_image_url : dj.profile_image_url} 
                alt={isEditing ? editData.name : dj.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="w-12 h-12 text-white" />
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nome Artístico</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Biografia</label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 text-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Gêneros Musicais</label>
                  <div className="flex flex-wrap gap-2">
                    {availableGenres.map(genre => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleGenreToggle(genre)}
                        className={`px-2 py-1 rounded-lg text-xs transition-all duration-300 ${
                          editData.genres.includes(genre)
                            ? 'bg-purple-600 text-white border border-purple-500'
                            : 'bg-black/20 text-gray-400 border border-white/20 hover:bg-white/10'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">{dj.name}</h2>
                {dj.bio && (
                  <p className="text-gray-400 mb-4">{dj.bio}</p>
                )}
                
                {/* Genres */}
                {dj.genres && dj.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dj.genres.map((genre, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Contact Info */}
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={editData.instagram_handle}
                    onChange={(e) => setEditData(prev => ({ ...prev, instagram_handle: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="@username"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dj.email && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{dj.email}</span>
                  </div>
                )}
                {dj.phone && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{dj.phone}</span>
                  </div>
                )}
                {dj.instagram_handle && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Instagram className="w-4 h-4" />
                    <span className="text-sm">{dj.instagram_handle}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status and Price */}
          <div className="text-right">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    value={editData.availability_status}
                    onChange={(e) => setEditData(prev => ({ 
                      ...prev, 
                      availability_status: e.target.value as 'available' | 'busy' | 'unavailable'
                    }))}
                    className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    <option value="available">Disponível</option>
                    <option value="busy">Ocupado</option>
                    <option value="unavailable">Indisponível</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Preço Base (R$)</label>
                  <input
                    type="number"
                    value={editData.booking_price}
                    onChange={(e) => setEditData(prev => ({ ...prev, booking_price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                    min="0"
                    step="100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">URL da Foto</label>
                  <input
                    type="url"
                    value={editData.profile_image_url}
                    onChange={(e) => setEditData(prev => ({ ...prev, profile_image_url: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    dj.availability_status === 'available' ? 'bg-green-500' :
                    dj.availability_status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`px-3 py-1 rounded-full text-sm border ${
                    dj.availability_status === 'available' ? 'status-available' :
                    dj.availability_status === 'busy' ? 'status-busy' : 'status-unavailable'
                  }`}>
                    {dj.availability_status === 'available' ? 'Disponível' :
                     dj.availability_status === 'busy' ? 'Ocupado' : 'Indisponível'}
                  </span>
                </div>
                {dj.booking_price && (
                  <p className="text-2xl font-bold text-green-400">
                    R$ {dj.booking_price.toLocaleString('pt-BR')}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="glass rounded-xl p-2">
        <div className="flex space-x-1">
          {tabs.map(tab => {
            const IconComponent = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white neon-glow'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Professional Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-400" />
                  Informações Profissionais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nome Artístico</label>
                    <p className="text-white font-medium">{dj.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm border ${
                      dj.availability_status === 'available' ? 'status-available' :
                      dj.availability_status === 'busy' ? 'status-busy' : 'status-unavailable'
                    }`}>
                      {dj.availability_status === 'available' ? 'Disponível' :
                       dj.availability_status === 'busy' ? 'Ocupado' : 'Indisponível'}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Biografia</label>
                    <p className="text-white">{dj.bio || 'Nenhuma biografia cadastrada'}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Preço Base</label>
                    <p className="text-green-400 font-semibold text-lg">
                      {dj.booking_price ? `R$ ${dj.booking_price.toLocaleString('pt-BR')}` : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Eventos Realizados</label>
                    <p className="text-white font-medium">{pastEvents.length}</p>
                  </div>
                </div>
              </div>

              {/* Recent Events */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                  Eventos Recentes
                </h3>
                {pastEvents.length > 0 ? (
                  <div className="space-y-3">
                    {pastEvents.slice(0, 3).map(event => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10">
                        <div>
                          <p className="font-medium text-white">{event.title}</p>
                          <p className="text-sm text-gray-400">{event.venue} • {event.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white">
                            {new Date(event.event_date).toLocaleDateString('pt-BR')}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            event.status === 'completed' ? 'status-completed' : 'status-confirmed'
                          }`}>
                            {event.status === 'completed' ? 'Concluído' : 'Confirmado'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Nenhum evento realizado ainda</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Estatísticas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total de Eventos</span>
                    <span className="text-white font-semibold">{djEvents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Próximos</span>
                    <span className="text-blue-400 font-semibold">{upcomingEvents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Concluídos</span>
                    <span className="text-green-400 font-semibold">{pastEvents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Avaliação</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-white font-semibold ml-1">5.0</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Gêneros Musicais</h3>
                <div className="space-y-2">
                  {dj.genres?.map((genre, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-400">{genre}</span>
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.random() * 40 + 60}%` }}
                        ></div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-400 text-center">Nenhum gênero cadastrado</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Agenda de {dj.name}</h2>
              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </button>
            </div>

            <DJCalendar
              djId={dj.id}
              events={djEvents}
              onEventClick={handleViewEvent}
              onEventEdit={handleEditEvent}
              onEventDelete={handleDeleteEvent}
              onCreateEvent={handleCreateEvent}
            />
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Media Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Galeria de Mídia</h2>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </button>
            </div>

            {/* Media Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Press Kit */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center">
                  <Image className="w-5 h-5 mr-2 text-green-400" />
                  Press Kit
                </h3>
                <div className="space-y-3">
                  {getMediaByCategory('presskit').map(item => (
                    <div key={item.id} className="group cursor-pointer">
                      <img 
                        src={item.url} 
                        alt={item.title}
                        className="w-full h-20 object-cover rounded-lg border border-white/10 group-hover:border-purple-500/50 transition-colors"
                      />
                      <p className="text-xs text-gray-400 mt-1 truncate">{item.title}</p>
                    </div>
                  ))}
                  <button className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors text-sm">
                    + Adicionar
                  </button>
                </div>
              </div>

              {/* Logos */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center">
                  <Image className="w-5 h-5 mr-2 text-blue-400" />
                  Logos
                </h3>
                <div className="space-y-3">
                  {getMediaByCategory('logo').map(item => (
                    <div key={item.id} className="group cursor-pointer">
                      <img 
                        src={item.url} 
                        alt={item.title}
                        className="w-full h-20 object-cover rounded-lg border border-white/10 group-hover:border-blue-500/50 transition-colors bg-white/5"
                      />
                      <p className="text-xs text-gray-400 mt-1 truncate">{item.title}</p>
                    </div>
                  ))}
                  <button className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors text-sm">
                    + Adicionar
                  </button>
                </div>
              </div>

              {/* Backdrops */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center">
                  <Image className="w-5 h-5 mr-2 text-purple-400" />
                  Backdrops
                </h3>
                <div className="space-y-3">
                  {getMediaByCategory('backdrop').map(item => (
                    <div key={item.id} className="group cursor-pointer">
                      <img 
                        src={item.url} 
                        alt={item.title}
                        className="w-full h-20 object-cover rounded-lg border border-white/10 group-hover:border-purple-500/50 transition-colors"
                      />
                      <p className="text-xs text-gray-400 mt-1 truncate">{item.title}</p>
                    </div>
                  ))}
                  <button className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors text-sm">
                    + Adicionar
                  </button>
                </div>
              </div>

              {/* Performance Photos */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center">
                  <Music className="w-5 h-5 mr-2 text-orange-400" />
                  Performances
                </h3>
                <div className="space-y-3">
                  {getMediaByCategory('performance').map(item => (
                    <div key={item.id} className="group cursor-pointer">
                      <img 
                        src={item.url} 
                        alt={item.title}
                        className="w-full h-20 object-cover rounded-lg border border-white/10 group-hover:border-orange-500/50 transition-colors"
                      />
                      <p className="text-xs text-gray-400 mt-1 truncate">{item.title}</p>
                    </div>
                  ))}
                  <button className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-orange-500 hover:text-orange-400 transition-colors text-sm">
                    + Adicionar
                  </button>
                </div>
              </div>
            </div>

            {/* Media Gallery */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Galeria Completa</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mockMedia.map(item => (
                  <div key={item.id} className="group cursor-pointer relative">
                    <img 
                      src={item.url} 
                      alt={item.title}
                      className="w-full h-24 object-cover rounded-lg border border-white/10 group-hover:border-purple-500/50 transition-colors"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button className="p-2 bg-white/20 rounded-full">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Financial Header */}
            <div>
              <h2 className="text-2xl font-bold text-white">Informações Financeiras</h2>
              <p className="text-gray-400">Dados financeiros e histórico de pagamentos</p>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass rounded-xl p-6 card-hover">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-400">Ganhos Totais</h3>
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-green-400">
                  R$ {financialData.totalEarnings.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500 mt-1">Últimos 12 meses</p>
              </div>

              <div className="glass rounded-xl p-6 card-hover">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-400">Pendente</h3>
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  R$ {financialData.pendingPayments.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500 mt-1">A receber</p>
              </div>

              <div className="glass rounded-xl p-6 card-hover">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-400">Eventos</h3>
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {financialData.completedEvents}
                </p>
                <p className="text-xs text-gray-500 mt-1">Concluídos</p>
              </div>

              <div className="glass rounded-xl p-6 card-hover">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-400">Média/Evento</h3>
                  <Star className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  R$ {financialData.averageEventValue.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500 mt-1">Valor médio</p>
              </div>
            </div>

            {/* Monthly Earnings Chart */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Ganhos Mensais</h3>
              <div className="space-y-4">
                {financialData.monthlyEarnings.map((month, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-400 w-12">{month.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(month.amount / Math.max(...financialData.monthlyEarnings.map(m => m.amount))) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-white font-semibold w-20 text-right">
                      R$ {(month.amount / 1000).toFixed(0)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment History */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Histórico de Pagamentos</h3>
              <div className="space-y-3">
                {djEvents
                  .filter(event => event.booking_fee && event.booking_fee > 0)
                  .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
                  .slice(0, 10)
                  .map(event => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/10">
                      <div>
                        <p className="font-medium text-white">{event.title}</p>
                        <p className="text-sm text-gray-400">{new Date(event.event_date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          R$ {event.booking_fee?.toLocaleString('pt-BR')}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.status === 'completed' ? 'status-completed' : 'status-pending'
                        }`}>
                          {event.status === 'completed' ? 'Pago' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))}
                
                {djEvents.filter(e => e.booking_fee && e.booking_fee > 0).length === 0 && (
                    <div>
                      <p className="font-medium text-white">{payment.event}</p>
                      <p className="text-sm text-gray-400">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        R$ {payment.amount.toLocaleString('pt-BR')}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        payment.status === 'paid' ? 'status-completed' : 'status-pending'
                      }`}>
                        {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                    <p className="text-center text-gray-400 py-8">
                      Nenhum histórico de pagamento encontrado
          </div>
        )}
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false)
            setSelectedEvent(null)
          }}
          mode={eventModalMode}
          event={selectedEvent}
          djId={dj.id}
          onEventSaved={(event) => {
            if (eventModalMode === 'create' && onEventAdded) {
              onEventAdded(event)
            } else if (eventModalMode === 'edit' && onEventUpdated) {
              onEventUpdated(event)
            }
            setShowEventModal(false)
            setSelectedEvent(null)
          }}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Upload de Mídia</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoria
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                >
                  <option value="presskit">Press Kit</option>
                  <option value="logo">Logo</option>
                  <option value="backdrop">Backdrop</option>
                  <option value="performance">Performance</option>
                  <option value="other">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL da Mídia
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Nome da mídia"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/20 transition-colors"
                >
                  Cancelar
                </button>
                <button
                >
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}