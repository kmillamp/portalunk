import React, { useState } from 'react'
import { Plus, Search, Filter, Music, Users, Calendar, TrendingUp, Grid, List, SortAsc, SortDesc } from 'lucide-react'
import type { DJ } from '@/types'
import DJCard from './DJCard'

interface DashboardProps {
  djs: DJ[]
  onDJSelect: (dj: DJ) => void
  onAddDJ: () => void
}

export default function Dashboard({ djs, onDJSelect, onAddDJ }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'status' | 'created'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Extrair gêneros únicos dos DJs
  const allGenres = Array.from(
    new Set(djs.flatMap(dj => dj.genres || []))
  )

  // Filtrar DJs com base nos critérios
  const filteredDJs = djs.filter(dj => {
    const matchesSearch = dj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dj.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dj.genres?.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesGenre = !selectedGenre || dj.genres?.includes(selectedGenre)
    const matchesStatus = !selectedStatus || dj.availability_status === selectedStatus
    
    return matchesSearch && matchesGenre && matchesStatus
  })

  // Ordenar DJs
  const sortedDJs = [...filteredDJs].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'price':
        comparison = (a.booking_price || 0) - (b.booking_price || 0)
        break
      case 'status':
        comparison = a.availability_status.localeCompare(b.availability_status)
        break
      case 'created':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Estatísticas rápidas
  const stats = {
    total: djs.length,
    available: djs.filter(dj => dj.availability_status === 'available').length,
    busy: djs.filter(dj => dj.availability_status === 'busy').length,
    avgPrice: djs.length > 0 ? djs.reduce((sum, dj) => sum + (dj.booking_price || 0), 0) / djs.length : 0,
    topGenres: allGenres.slice(0, 3)
  }

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white neon-text">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            {djs.length > 0 
              ? `${djs.length} DJ${djs.length > 1 ? 's' : ''} cadastrado${djs.length > 1 ? 's' : ''} • ${stats.available} disponível${stats.available !== 1 ? 'is' : ''}`
              : 'Nenhum DJ cadastrado ainda'
            }
          </p>
        </div>
        <button
          onClick={onAddDJ}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 btn-neon"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar DJ
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total de DJs</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Music className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Disponíveis</p>
              <p className="text-2xl font-bold text-green-400">{stats.available}</p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Ocupados</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.busy}</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Preço Médio</p>
              <p className="text-2xl font-bold text-blue-400">
                {stats.avgPrice > 0 ? `R$ ${(stats.avgPrice / 1000).toFixed(0)}k` : 'N/A'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Gêneros</p>
              <p className="text-lg font-bold text-purple-400">{allGenres.length}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {stats.topGenres.map(genre => (
                  <span key={genre} className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            <Music className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, bio ou gênero..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>
          </div>

          {/* Filters row */}
          <>
            {/* Genre filter */}
            <div className="w-full sm:w-40">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm transition-all duration-300"
              >
                <option value="">Todos os gêneros</option>
                {allGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div className="w-full sm:w-40">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm transition-all duration-300"
              >
                <option value="">Todos os status</option>
                <option value="available">Disponível</option>
                <option value="busy">Ocupado</option>
                <option value="unavailable">Indisponível</option>
              </select>
            </div>

            {/* Sort */}
            <div className="w-full sm:w-40">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm transition-all duration-300"
              >
                <option value="name">Nome</option>
                <option value="price">Preço</option>
                <option value="status">Status</option>
                <option value="created">Data</option>
              </select>
            </div>

            {/* Sort order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2.5 bg-black/20 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
              title={`Ordenar ${sortOrder === 'asc' ? 'decrescente' : 'crescente'}`}
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-5 h-5 text-gray-400" />
              ) : (
                <SortDesc className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* View mode toggle */}
            <div className="flex border border-white/20 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2.5 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-black/20 text-gray-400 hover:bg-white/10'
                }`}
                title="Visualização em grade"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2.5 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-black/20 text-gray-400 hover:bg-white/10'
                }`}
                title="Visualização em lista"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </>
        </div>

        {/* Active filters indicator */}
        {(searchTerm || selectedGenre || selectedStatus) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
            <span className="text-sm text-gray-400">Filtros ativos:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs">
                Busca: "{searchTerm}"
              </span>
            )}
            {selectedGenre && (
              <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">
                Gênero: {selectedGenre}
              </span>
            )}
            {selectedStatus && (
              <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded-full text-xs">
                Status: {selectedStatus === 'available' ? 'Disponível' : selectedStatus === 'busy' ? 'Ocupado' : 'Indisponível'}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedGenre('')
                setSelectedStatus('')
              }}
              className="px-2 py-1 bg-red-600/20 text-red-300 rounded-full text-xs hover:bg-red-600/30 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Results summary */}
      {djs.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Mostrando {sortedDJs.length} de {djs.length} DJ{djs.length > 1 ? 's' : ''}
            {filteredDJs.length !== djs.length && ` (${djs.length - filteredDJs.length} filtrado${djs.length - filteredDJs.length > 1 ? 's' : ''})`}
          </span>
          <span>
            Ordenado por {sortBy === 'name' ? 'nome' : sortBy === 'price' ? 'preço' : sortBy === 'status' ? 'status' : 'data'} 
            ({sortOrder === 'asc' ? 'crescente' : 'decrescente'})
          </span>
        </div>
      )}

      {/* DJs Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedDJs.map(dj => (
            <DJCard
              key={dj.id}
              dj={dj}
              onClick={() => onDJSelect(dj)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDJs.map(dj => (
            <div
              key={dj.id}
              onClick={() => onDJSelect(dj)}
              className="glass rounded-xl p-6 card-hover cursor-pointer group transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                {/* Profile image */}
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
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
                  <Music className={`w-8 h-8 text-white ${dj.profile_image_url ? 'hidden' : ''}`} />
                </div>

                {/* DJ Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-xl group-hover:text-purple-300 transition-colors truncate">
                        {dj.name}
                      </h3>
                      {dj.bio && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {dj.bio}
                        </p>
                      )}
                      
                      {/* Genres */}
                      {dj.genres && dj.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {dj.genres.slice(0, 4).map((genre, index) => (
                            <span 
                              key={index}
                              className="text-xs px-2 py-1 rounded-full border border-purple-500/30 text-purple-300 bg-purple-600/20"
                            >
                              {genre}
                            </span>
                          ))}
                          {dj.genres.length > 4 && (
                            <span className="text-xs px-2 py-1 rounded-full border border-gray-500/30 text-gray-400">
                              +{dj.genres.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status and Price */}
                    <div className="ml-4 text-right flex-shrink-0">
                      <div className="flex items-center space-x-1 mb-2">
                        <div className={`w-2 h-2 rounded-full ${
                          dj.availability_status === 'available' ? 'bg-green-500' :
                          dj.availability_status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          dj.availability_status === 'available' ? 'status-available' :
                          dj.availability_status === 'busy' ? 'status-busy' : 'status-unavailable'
                        }`}>
                          {dj.availability_status === 'available' ? 'Disponível' :
                           dj.availability_status === 'busy' ? 'Ocupado' : 'Indisponível'}
                        </span>
                      </div>
                      {dj.booking_price && (
                        <p className="font-semibold text-green-400">
                          R$ {dj.booking_price.toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {sortedDJs.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {djs.length === 0 ? 'Nenhum DJ cadastrado' : 'Nenhum DJ encontrado'}
          </h3>
          <p className="text-gray-500 mb-6">
            {djs.length === 0 
              ? 'Comece adicionando seu primeiro DJ ao portal.'
              : 'Tente ajustar os filtros para encontrar o que procura.'
            }
          </p>
          {djs.length === 0 ? (
            <button
              onClick={onAddDJ}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 btn-neon"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Primeiro DJ
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedGenre('')
                setSelectedStatus('')
              }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 btn-neon"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      )}
    </div>
  )
}
