import React, { useState } from 'react'
import { X, Upload, Music } from 'lucide-react'
import type { DJ } from '@/types'

interface AddDJModalProps {
  isOpen: boolean
  onClose: () => void
  onAddDJ: (dj: Omit<DJ, 'id' | 'created_at' | 'updated_at'>) => void
}

const availableGenres = [
  'Electronic', 'House', 'Deep House', 'Tech House', 'Techno', 
  'Progressive', 'Trance', 'Pop', 'Funk', 'Hip Hop', 'R&B', 
  'Rock', 'Reggaeton', 'Trap', 'Bass', 'Ambient'
]

export default function AddDJModal({ isOpen, onClose, onAddDJ }: AddDJModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    genres: [] as string[],
    booking_price: '',
    availability_status: 'available' as const,
    instagram_handle: '',
    profile_image_url: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }
    
    if (formData.genres.length === 0) {
      newErrors.genres = 'Selecione pelo menos um gênero musical'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Criar objeto DJ
    const newDJ: Omit<DJ, 'id' | 'created_at' | 'updated_at'> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      bio: formData.bio.trim() || undefined,
      genres: formData.genres,
      booking_price: formData.booking_price ? parseFloat(formData.booking_price) : undefined,
      availability_status: formData.availability_status,
      instagram_handle: formData.instagram_handle.trim() || undefined,
      profile_image_url: formData.profile_image_url.trim() || null
    }

    onAddDJ(newDJ)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      bio: '',
      genres: [],
      booking_price: '',
      availability_status: 'available',
      instagram_handle: '',
      profile_image_url: ''
    })
    setErrors({})
    onClose()
  }

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white neon-text">Adicionar Novo DJ</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-2.5 bg-black/20 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 ${
                  errors.name ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Nome do DJ"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-4 py-2.5 bg-black/20 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 ${
                  errors.email ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="email@exemplo.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram_handle}
                onChange={(e) => setFormData(prev => ({ ...prev, instagram_handle: e.target.value }))}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="@username"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Biografia
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 resize-none"
              placeholder="Descreva a experiência e estilo do DJ..."
            />
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gêneros Musicais *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableGenres.map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    formData.genres.includes(genre)
                      ? 'bg-purple-600 text-white border border-purple-500'
                      : 'bg-black/20 text-gray-400 border border-white/20 hover:bg-white/10'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            {errors.genres && <p className="text-red-400 text-xs mt-1">{errors.genres}</p>}
          </div>

          {/* Price and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preço Base (R$)
              </label>
              <input
                type="number"
                value={formData.booking_price}
                onChange={(e) => setFormData(prev => ({ ...prev, booking_price: e.target.value }))}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="5000"
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status de Disponibilidade
              </label>
              <select
                value={formData.availability_status}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  availability_status: e.target.value as 'available' | 'busy' | 'unavailable'
                }))}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
              >
                <option value="available">Disponível</option>
                <option value="busy">Ocupado</option>
                <option value="unavailable">Indisponível</option>
              </select>
            </div>
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL da Foto de Perfil
            </label>
            <input
              type="url"
              value={formData.profile_image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, profile_image_url: e.target.value }))}
              className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              placeholder="https://exemplo.com/foto.jpg ou /foto.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Cole a URL da imagem ou use um caminho relativo (ex: /foto.jpg)
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/20 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 btn-neon"
            >
              Adicionar DJ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}