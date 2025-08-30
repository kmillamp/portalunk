import React from 'react'
import { Music, Phone, Mail, Instagram, MapPin } from 'lucide-react'
import type { DJ } from '@/types'

interface DJCardProps {
  dj: DJ
  onClick: () => void
}

const statusConfig = {
  available: {
    label: 'Disponível',
    className: 'status-available',
    dotColor: 'bg-green-500'
  },
  busy: {
    label: 'Ocupado',
    className: 'status-busy',
    dotColor: 'bg-yellow-500'
  },
  unavailable: {
    label: 'Indisponível',
    className: 'status-unavailable',
    dotColor: 'bg-red-500'
  }
}

const genreColors: Record<string, string> = {
  'Electronic': 'genre-electronic',
  'House': 'genre-house',
  'Techno': 'genre-techno',
  'Pop': 'genre-pop',
  'Funk': 'genre-funk',
  'Deep House': 'genre-house',
  'Tech House': 'genre-techno',
  'Progressive': 'genre-electronic',
  'Reggaeton': 'genre-pop'
}

export default function DJCard({ dj, onClick }: DJCardProps) {
  const status = statusConfig[dj.availability_status]
  
  return (
    <div 
      onClick={onClick}
      className="glass rounded-xl p-6 card-hover cursor-pointer group transition-all duration-300 relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
      {/* Header with image and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
            {dj.profile_image_url ? (
              <img 
                src={dj.profile_image_url} 
                alt={dj.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <Music className={`w-6 h-6 text-white ${dj.profile_image_url ? 'hidden' : ''}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg group-hover:text-purple-300 transition-colors truncate">
              {dj.name}
            </h3>
            <div className="flex items-center space-x-1 mt-1">
              <div className={`w-2 h-2 rounded-full ${status.dotColor}`}></div>
              <span className={`text-xs px-2 py-1 rounded-full border ${status.className}`}>
                {status.label}
              </span>
              {dj.booking_price && (
                <span className="text-xs text-green-400 font-medium">
                  R$ {(dj.booking_price / 1000).toFixed(0)}k
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {dj.bio && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {dj.bio}
        </p>
      )}

      {/* Genres */}
      {dj.genres && dj.genres.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {dj.genres.slice(0, 3).map((genre, index) => (
            <span 
              key={index}
              className={`text-xs px-2 py-1 rounded-full border ${
                genreColors[genre] || 'genre-electronic'
              }`}
            >
              {genre}
            </span>
          ))}
          {dj.genres.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full border border-gray-500/30 text-gray-400">
              +{dj.genres.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Contact info */}
      <div className="space-y-2 mb-4">
        {dj.email && (
          <div className="flex items-center space-x-2 text-gray-400 group-hover:text-gray-300 transition-colors">
            <Mail className="w-4 h-4" />
            <span className="text-sm truncate">{dj.email}</span>
          </div>
        )}
        {dj.phone && (
          <div className="flex items-center space-x-2 text-gray-400 group-hover:text-gray-300 transition-colors">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{dj.phone}</span>
          </div>
        )}
        {dj.instagram_handle && (
          <div className="flex items-center space-x-2 text-gray-400 group-hover:text-gray-300 transition-colors">
            <Instagram className="w-4 h-4" />
            <span className="text-sm">{dj.instagram_handle}</span>
          </div>
        )}
      </div>

      {/* Booking price */}
      {dj.booking_price && (
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between group-hover:scale-105 transition-transform duration-300">
            <span className="text-sm text-gray-400">Preço base</span>
            <span className="font-semibold text-green-400">
              R$ {dj.booking_price.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      )}

      {/* Hover effect indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-b-xl transform scale-x-0 group-hover:scale-x-100"></div>
      </div>
    </div>
  )
}
