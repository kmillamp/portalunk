import React, { useState, useEffect } from 'react'
import { X, Calendar, MapPin, DollarSign, Clock, User, Save, Eye, Edit } from 'lucide-react'
import type { Event } from '@/types'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit' | 'view'
  event?: Event | null
  djId?: string
  onEventSaved: (event: Event) => void
  onStatusChange?: (eventId: string, newStatus: Event['status']) => void
}

export default function EventModal({ 
  isOpen, 
  onClose, 
  mode, 
  event, 
  djId, 
  onEventSaved,
  onStatusChange
}: EventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    venue: '',
    city: '',
    state: '',
    booking_fee: '',
    status: 'pending' as Event['status']
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (event && (mode === 'edit' || mode === 'view')) {
      const eventDate = new Date(event.event_date)
      const formattedDate = eventDate.toISOString().slice(0, 16) // Format for datetime-local input
      
      setFormData({
        title: event.title,
        description: event.description || '',
        event_date: formattedDate,
        venue: event.venue,
        city: event.city,
        state: event.state,
        booking_fee: event.booking_fee?.toString() || '',
        status: event.status
      })
    } else if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        event_date: '',
        venue: '',
        city: '',
        state: '',
        booking_fee: '',
        status: 'pending'
      })
    }
  }, [event, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    }
    
    if (!formData.event_date) {
      newErrors.event_date = 'Data é obrigatória'
    }
    
    if (!formData.venue.trim()) {
      newErrors.venue = 'Local é obrigatório'
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Criar ou atualizar evento
    const eventData: Event = {
      id: event?.id || Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      event_date: new Date(formData.event_date).toISOString(),
      venue: formData.venue.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      dj_id: djId || event?.dj_id || '',
      producer_id: event?.producer_id || '1', // Mock producer ID
      status: formData.status,
      booking_fee: formData.booking_fee ? parseFloat(formData.booking_fee) : undefined,
      created_at: event?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    onEventSaved(eventData)
  }

  const handleStatusChange = (newStatus: Event['status']) => {
    if (event && onStatusChange) {
      onStatusChange(event.id, newStatus)
    }
    setFormData(prev => ({ ...prev, status: newStatus }))
  }

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'completed': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusLabel = (status: Event['status']) => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'pending': return 'Pendente'
      case 'completed': return 'Concluído'
      case 'cancelled': return 'Cancelado'
      default: return 'Pendente'
    }
  }

  if (!isOpen) return null

  const isReadOnly = mode === 'view'
  const title = mode === 'create' ? 'Novo Evento' : mode === 'edit' ? 'Editar Evento' : 'Detalhes do Evento'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'create' ? 'bg-gradient-to-br from-purple-600 to-blue-600' :
              mode === 'edit' ? 'bg-gradient-to-br from-blue-600 to-cyan-600' :
              'bg-gradient-to-br from-green-600 to-emerald-600'
            }`}>
              {mode === 'create' ? <Calendar className="w-5 h-5 text-white" /> :
               mode === 'edit' ? <Edit className="w-5 h-5 text-white" /> :
               <Eye className="w-5 h-5 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-white neon-text">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status selector for view/edit mode */}
          {mode !== 'create' && event && (
            <div className="glass-dark rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Status do Evento
              </label>
              <div className="flex flex-wrap gap-2">
                {(['pending', 'confirmed', 'completed', 'cancelled'] as Event['status'][]).map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    disabled={isReadOnly}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                      formData.status === status
                        ? getStatusColor(status)
                        : 'bg-black/20 text-gray-400 border-white/20 hover:bg-white/10'
                    } ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome do Evento *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-4 py-2.5 bg-black/20 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 ${
                  errors.title ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Nome do evento"
                readOnly={isReadOnly}
                required
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
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
                readOnly={isReadOnly}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data e Hora *
              </label>
              <input
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                className={`w-full px-4 py-2.5 bg-black/20 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300 ${
                  errors.event_date ? 'border-red-500' : 'border-white/20'
                }`}
                readOnly={isReadOnly}
                required
              />
              {errors.event_date && <p className="text-red-400 text-xs mt-1">{errors.event_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Valor do Cachê (R$)
              </label>
              <input
                type="number"
                value={formData.booking_fee}
                onChange={(e) => setFormData(prev => ({ ...prev, booking_fee: e.target.value }))}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="Valor do cachê"
                min="0"
                step="100"
                readOnly={isReadOnly}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Local *
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                className={`w-full px-4 py-2.5 bg-black/20 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 ${
                  errors.venue ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Nome do local"
                readOnly={isReadOnly}
                required
              />
              {errors.venue && <p className="text-red-400 text-xs mt-1">{errors.venue}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className={`w-full px-4 py-2.5 bg-black/20 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 ${
                  errors.city ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Cidade"
                readOnly={isReadOnly}
                required
              />
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="Estado"
                readOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Event Summary for view mode */}
          {mode === 'view' && event && (
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Resumo do Evento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Data de Criação</p>
                  <p className="text-white font-medium">
                    {new Date(event.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Última Atualização</p>
                  <p className="text-white font-medium">
                    {new Date(event.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">ID do Evento</p>
                  <p className="text-white font-mono text-sm">{event.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status Atual</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs border ${
                    event.status === 'confirmed' ? 'status-confirmed' :
                    event.status === 'pending' ? 'status-pending' :
                    event.status === 'completed' ? 'status-completed' : 'status-cancelled'
                  }`}>
                    {getStatusLabel(event.status)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/20 transition-colors"
            >
              {isReadOnly ? 'Fechar' : 'Cancelar'}
            </button>
            
            {!isReadOnly && (
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 btn-neon"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Criar Evento' : 'Salvar Alterações'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}