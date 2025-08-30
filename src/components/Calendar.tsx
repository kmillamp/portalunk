import React, { useState } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, Edit, FileText, DollarSign, Eye, Trash2 } from 'lucide-react'
import type { DJ, Event } from '@/types'
import ContractModal from './ContractModal'

interface CalendarProps {
  djs: DJ[]
  onEventAdded: (event: Event) => void
}

export default function Calendar({ djs, onEventAdded }: CalendarProps) {
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showContract, setShowContract] = useState(false)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    venue: '',
    city: '',
    state: '',
    dj_id: '',
    producer_id: '',
    booking_fee: ''
  })

  // Mock events - em produção viriam do banco de dados
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Summer Music Festival 2025',
      description: 'Grande festival de música eletrônica com lineup internacional',
      event_date: '2025-02-15T20:00:00Z',
      venue: 'Allianz Parque',
      city: 'São Paulo',
      state: 'SP',
      dj_id: '1',
      producer_id: '1',
      status: 'confirmed',
      ticket_price: 150,
      expected_attendance: 15000,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'House Night Rio',
      description: 'Noite especial de house music na Marina da Glória',
      event_date: '2025-03-08T22:00:00Z',
      venue: 'Marina da Glória',
      city: 'Rio de Janeiro',
      state: 'RJ',
      dj_id: '2',
      producer_id: '1',
      status: 'pending',
      ticket_price: 80,
      expected_attendance: 3000,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      title: 'Corporate Event Premium',
      description: 'Evento corporativo exclusivo para clientes VIP',
      event_date: '2025-01-25T19:00:00Z',
      venue: 'Hotel Copacabana Palace',
      city: 'Rio de Janeiro',
      state: 'RJ',
      dj_id: '1',
      producer_id: '2',
      status: 'confirmed',
      ticket_price: 0,
      expected_attendance: 200,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]

  const getDJName = (djId: string) => {
    const dj = djs.find(d => d.id === djId)
    return dj?.name || 'DJ não encontrado'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed'
      case 'pending': return 'status-pending'
      case 'completed': return 'status-completed'
      case 'cancelled': return 'status-cancelled'
      default: return 'status-pending'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'pending': return 'Pendente'
      case 'completed': return 'Concluído'
      case 'cancelled': return 'Cancelado'
      default: return 'Pendente'
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      event_date: new Date(formData.event_date).toISOString(),
      venue: formData.venue,
      city: formData.city,
      state: formData.state,
      dj_id: formData.dj_id,
      producer_id: formData.producer_id,
      status: 'pending',
      booking_fee: formData.booking_fee ? parseFloat(formData.booking_fee) : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    onEventAdded(newEvent)
    setShowAddEvent(false)
    setFormData({
      title: '',
      description: '',
      event_date: '',
      venue: '',
      city: '',
      state: '',
      dj_id: '',
      producer_id: '',
      booking_fee: ''
    })
  }

  const handleCreateContract = (event: Event) => {
    setSelectedEvent(event)
    setShowContract(true)
  }

  // Ordenar eventos por data
  const sortedEvents = [...mockEvents].sort((a, b) => 
    new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white neon-text">Calendário</h1>
          <p className="text-gray-400 mt-1">
            {mockEvents.length} evento{mockEvents.length !== 1 ? 's' : ''} agendado{mockEvents.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex border border-white/20 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/20 text-gray-400 hover:bg-white/10'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/20 text-gray-400 hover:bg-white/10'
              }`}
            >
              Calendário
            </button>
          </div>
          <button
            onClick={() => setShowAddEvent(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 btn-neon"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Evento
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total de Eventos</p>
              <p className="text-2xl font-bold text-white">{mockEvents.length}</p>
            </div>
            <CalendarIcon className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Confirmados</p>
              <p className="text-2xl font-bold text-green-400">
                {mockEvents.filter(e => e.status === 'confirmed').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-400">
                {mockEvents.filter(e => e.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Este Mês</p>
              <p className="text-2xl font-bold text-blue-400">
                {mockEvents.filter(e => {
                  const eventDate = new Date(e.event_date)
                  const now = new Date()
                  return eventDate.getMonth() === now.getMonth() && 
                         eventDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Events display */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {sortedEvents.map(event => {
            const eventDate = new Date(event.event_date)
            const djName = getDJName(event.dj_id || '')
            
            return (
              <div key={event.id} className="glass rounded-xl p-6 card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                        {event.description && (
                          <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(event.status)}`}>
                        {getStatusLabel(event.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <CalendarIcon className="w-4 h-4" />
                        <div>
                          <p className="text-sm text-white font-medium">
                            {eventDate.toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-xs">
                            {eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <div>
                          <p className="text-sm text-white font-medium">{event.venue}</p>
                          <p className="text-xs">{event.city}, {event.state}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <div>
                          <p className="text-sm text-white font-medium">{djName}</p>
                          <p className="text-xs">DJ Principal</p>
                        </div>
                      </div>
                      
                      {event.expected_attendance && (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <div>
                            <p className="text-sm text-white font-medium">
                              {event.booking_fee ? `R$ ${event.booking_fee.toLocaleString('pt-BR')}` : 'Não informado'}
                            </p>
                            <p className="text-xs">Cachê</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Event details */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-4">
                        {event.booking_fee && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400 font-medium">
                              R$ {event.booking_fee.toLocaleString('pt-BR')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCreateContract(event)}
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-sm font-medium text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Contrato
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-sm font-medium text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-300">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg text-sm font-medium text-white hover:from-red-700 hover:to-pink-700 transition-all duration-300">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass rounded-xl p-8">
          <div className="text-center">
            <CalendarIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Visualização de Calendário</h3>
            <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {mockEvents.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum evento agendado</h3>
          <p className="text-gray-500 mb-6">Comece criando seu primeiro evento</p>
          <button
            onClick={() => setShowAddEvent(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 btn-neon"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Primeiro Evento
          </button>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white neon-text">Novo Evento</h2>
              <button
                onClick={() => setShowAddEvent(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-400 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Evento *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Nome do evento"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 resize-none"
                    placeholder="Descrição do evento..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data e Hora
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Valor do Cachê (R$)
                  </label>
                  <input
                    type="number"
                    value={formData.booking_fee}
                    onChange={(e) => setFormData(prev => ({ ...prev, booking_fee: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                    placeholder="Valor do cachê"
                    min="0"
                    step="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    DJ *
                  </label>
                  <select
                    value={formData.dj_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, dj_id: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                    required
                  >
                    <option value="">Selecione um DJ</option>
                    {djs.map(dj => (
                      <option key={dj.id} value={dj.id}>{dj.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Local *
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Nome do local"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Cidade"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="px-6 py-2.5 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/20 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 btn-neon"
                >
                  Criar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contract Modal */}
      {showContract && selectedEvent && (
        <ContractModal
          isOpen={showContract}
          onClose={() => {
            setShowContract(false)
            setSelectedEvent(null)
          }}
          event={selectedEvent}
          dj={djs.find(d => d.id === selectedEvent.dj_id)}
        />
      )}
    </div>
  )
}