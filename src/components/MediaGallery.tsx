import React, { useState } from 'react'
import { Image, Video, Music, Download, ExternalLink, Trash2, Edit, X } from 'lucide-react'

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'audio'
  url: string
  title: string
  description?: string
  category: 'presskit' | 'logo' | 'backdrop' | 'performance' | 'other'
  size?: string
  uploadDate: string
}

interface MediaGalleryProps {
  djId: string
  media: MediaItem[]
  onUpload: (media: Omit<MediaItem, 'id' | 'uploadDate'>) => void
  onDelete: (mediaId: string) => void
  onEdit: (mediaId: string, updates: Partial<MediaItem>) => void
}

export default function MediaGallery({ djId, media, onUpload, onDelete, onEdit }: MediaGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<MediaItem['category'] | 'all'>('all')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null)

  const categories = [
    { id: 'all', label: 'Todos', icon: Image },
    { id: 'presskit', label: 'Press Kit', icon: Image },
    { id: 'logo', label: 'Logos', icon: Image },
    { id: 'backdrop', label: 'Backdrops', icon: Image },
    { id: 'performance', label: 'Performances', icon: Video },
    { id: 'other', label: 'Outros', icon: Music }
  ]

  const filteredMedia = selectedCategory === 'all' 
    ? media 
    : media.filter(item => item.category === selectedCategory)

  const getMediaIcon = (type: MediaItem['type']) => {
    switch (type) {
      case 'image': return Image
      case 'video': return Video
      case 'audio': return Music
      default: return Image
    }
  }

  const handleEdit = (mediaItem: MediaItem) => {
    setEditingMedia(mediaItem)
    setShowEditModal(true)
  }

  const handleDelete = (mediaId: string) => {
    if (confirm('Tem certeza que deseja excluir esta mídia?')) {
      onDelete(mediaId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const IconComponent = category.icon
          const isActive = selectedCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white neon-glow'
                  : 'bg-black/20 text-gray-400 hover:text-white hover:bg-white/10 border border-white/20'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium">{category.label}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {category.id === 'all' ? media.length : media.filter(m => m.category === category.id).length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedia.map(item => {
          const IconComponent = getMediaIcon(item.type)
          
          return (
            <div key={item.id} className="glass rounded-xl overflow-hidden card-hover group">
              {/* Media Preview */}
              <div className="relative aspect-video bg-black/20">
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onClick={() => setSelectedMedia(item)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center cursor-pointer"
                       onClick={() => setSelectedMedia(item)}>
                    <IconComponent className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setSelectedMedia(item)}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                {/* Category badge */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Media Info */}
              <div className="p-4">
                <h4 className="font-medium text-white mb-1 truncate">{item.title}</h4>
                {item.description && (
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{item.type.toUpperCase()}</span>
                  {item.size && <span>{item.size}</span>}
                </div>
              </div>
            </div>
          )
        })}

        {/* Add new media card */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="glass rounded-xl p-8 border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors group"
        >
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-600 group-hover:text-purple-400 mx-auto mb-3 transition-colors" />
            <p className="text-gray-400 group-hover:text-purple-400 font-medium transition-colors">
              Adicionar Mídia
            </p>
          </div>
        </button>
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">{selectedMedia.title}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.open(selectedMedia.url, '_blank')}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Download className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {selectedMedia.type === 'image' ? (
                <img 
                  src={selectedMedia.url} 
                  alt={selectedMedia.title}
                  className="w-full max-h-[70vh] object-contain rounded-xl"
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-black/20 rounded-xl">
                  <div className="text-center">
                    {React.createElement(getMediaIcon(selectedMedia.type), { 
                      className: "w-16 h-16 text-gray-400 mx-auto mb-4" 
                    })}
                    <p className="text-gray-400">Preview não disponível</p>
                    <button
                      onClick={() => window.open(selectedMedia.url, '_blank')}
                      className="mt-4 px-4 py-2 bg-purple-600 rounded-xl text-white hover:bg-purple-700 transition-colors"
                    >
                      Abrir Arquivo
                    </button>
                  </div>
                </div>
              )}
              {selectedMedia.description && (
                <p className="text-gray-400 mt-4">{selectedMedia.description}</p>
              )}
            </div>
          </div>
        </div>
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

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoria *
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                  required
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
                  URL da Mídia *
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="https://exemplo.com/arquivo.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Nome da mídia"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 resize-none"
                  placeholder="Descrição opcional..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/20 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowUploadModal(false)
                    // Implementar upload real aqui
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}