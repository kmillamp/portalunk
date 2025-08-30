import React, { useState } from 'react'
import { 
  Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight, 
  Search, Filter, Eye, Edit, Trash2, DollarSign 
} from 'lucide-react'
import type { Event } from '@/types'

interface DJCalendarProps {
  djId: string
  events: Event[]
  onEventClick: (event: Event) => void
  onEventEdit?: (event: Event) => void
  onEventDelete?: (eventId: string) => void
  onCreateEvent?: () => void
}

export default function DJCalendar({ 
  djId, 
  events, 
  onEventClick, 
  onEventEdit,
  onEventDelete,
  onCreateEvent
}: DJCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Filtrar eventos do DJ
  const djEvents = events.filter(event => event.dj_id === djId)
  
  // Aplicar filtros
  const filteredEvents = djEvents.filter(event => {
    const matchesSearch = !searchTerm || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDate = !dateFilter || 
      new Date(event.event_date).toDateString() === new Date(dateFilter).toDateString()
    
    const matchesStatus = !statusFilter || event.status === statusFilter
    
    return matchesSearch && matchesDate && matchesStatus
  })

  // Separar eventos por período
  const upcomingEvents = filteredEvents.filter(event => new Date(event.event_date) > new Date())
  const todayEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.event_date)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  })

  // Gerar calendário do mês atual
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDay = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.event_date)
        return eventDate.toDateString() === currentDay.toDateString()
      })
      
      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === new Date().toDateString(),
        events: dayEvents
      })
      
      currentDay.setDate(currentDay.getDate() + 1)
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
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

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h2 className="text-2xl font-bold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex border border-white/20 rounded-xl overflow-hidden">
            {['month', 'week', 'list'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-2 transition-colors capitalize ${
                  viewMode === mode 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-black/20 text-gray-400 hover:bg-white/10'
                }`}
              >
                {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Lista'}
              </button>
            ))}
          </div>
          {onCreateEvent && (
            <button
              onClick={onCreateEvent}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar eventos..."
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-sm transition-all duration-300"
            />
          </div>
          
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm transition-all duration-300"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm transition-all duration-300"
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('')
              setDateFilter('')
              setStatusFilter('')
            }}
            className="px-4 py-2 bg-gray-600/20 border border-gray-500/30 rounded-xl text-gray-300 hover:bg-gray-600/30 transition-colors text-sm"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-400" />
            Eventos de Hoje
          </h3>
          <div className="space-y-3">
            {todayEvents.map(event => (
              <div 
                key={event.id} 
                className="p-4 bg-orange-600/20 border border-orange-500/30 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{event.title}</p>
                    <p className="text-sm text-gray-400">{event.venue} • {event.city}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-orange-400 font-medium">
                      {new Date(event.event_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEventClick(event)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      {onEventEdit && (
                        <button
                          onClick={() => onEventEdit(event)}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      {onEventDelete && (
                        <button
                          onClick={() => onEventDelete(event.id)}
                          className="p-1 rounded hover:bg-red-500/20 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'month' && (
        <div className="glass rounded-xl p-6">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-white/10 transition-colors ${
                  day.isCurrentMonth ? 'bg-black/20' : 'bg-black/10'
                } ${
                  day.isToday ? 'bg-purple-600/20 border-purple-500/50' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  day.isCurrentMonth ? 'text-white' : 'text-gray-600'
                } ${
                  day.isToday ? 'text-purple-400' : ''
                }`}>
                  {day.date.getDate()}
                </div>
                
                {/* Events for this day */}
                <div className="space-y-1">
                  {day.events.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getEventStatusColor(event.status)} text-white group relative`}
                      title={event.title}
                    >
                      <div className="truncate">{event.title}</div>
                      <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center space-x-1">
                          {onEventEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onEventEdit(event)
                              }}
                              className="p-0.5 bg-black/50 rounded"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          )}
                          {onEventDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onEventDelete(event.id)
                              }}
                              className="p-0.5 bg-red-500/50 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {day.events.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{day.events.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents
              .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
              .map(event => {
                const eventDate = new Date(event.event_date)
                const isUpcoming = eventDate > new Date()
                
                return (
                  <div 
                    key={event.id}
                    className="glass rounded-xl p-6 card-hover group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-white mb-2">{event.title}</h4>
                            {event.description && (
                              <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs border ${
                            event.status === 'confirmed' ? 'status-confirmed' :
                            event.status === 'pending' ? 'status-pending' :
                            event.status === 'completed' ? 'status-completed' : 'status-cancelled'
                          }`}>
                            {getStatusLabel(event.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
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
                            <DollarSign className="w-4 h-4" />
                            <div>
                              <p className="text-sm text-white font-medium">
                                {event.booking_fee ? `R$ ${event.booking_fee.toLocaleString('pt-BR')}` : 'Não informado'}
                              </p>
                              <p className="text-xs">Cachê</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <div>
                              <p className="text-sm text-white font-medium">
                                {isUpcoming ? 'Próximo' : 'Realizado'}
                              </p>
                              <p className="text-xs">
                                {Math.abs(Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} dias
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Event actions */}
                        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEventClick(event)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-600/30 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Visualizar
                          </button>
                          {onEventEdit && (
                            <button
                              onClick={() => onEventEdit(event)}
                              className="inline-flex items-center px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-sm font-medium text-purple-400 hover:bg-purple-600/30 transition-colors"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </button>
                          )}
                          {onEventDelete && (
                            <button
                              onClick={() => onEventDelete(event.id)}
                              className="inline-flex items-center px-3 py-1.5 bg-red-600/20 border border-red-500/30 rounded-lg text-sm font-medium text-red-400 hover:bg-red-600/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Excluir
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {djEvents.length === 0 ? 'Nenhum evento agendado' : 'Nenhum evento encontrado'}
              </h3>
              <p className="text-gray-500 mb-6">
                {djEvents.length === 0 
                  ? 'A agenda está livre para novos eventos'
                  : 'Tente ajustar os filtros para encontrar eventos'
                }
              </p>
              {djEvents.length === 0 && onCreateEvent && (
                <button
                  onClick={onCreateEvent}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeiro Evento
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Week View Placeholder */}
      {viewMode === 'week' && (
        <div className="glass rounded-xl p-8">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Visualização Semanal</h3>
            <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
          </div>
        </div>
      )}
    </div>
  )
}