import React, { useState } from 'react'
import { Plus, Search, Building, Phone, Mail, MapPin, User } from 'lucide-react'
import { useSupabaseData } from '@/hooks/useSupabaseData'

export default function ProducerRegistration() {
  const { producers, addProducer } = useSupabaseData()
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    contact_person: ''
  })

  // Filter producers based on search
  const filteredProducers = producers.filter(producer =>
    producer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { error } = await addProducer({
        ...formData,
        status: 'active'
      })
      
      if (error) {
        console.error('Error adding producer:', error)
        alert('Erro ao adicionar produtor. Tente novamente.')
        return
      }
      
      setShowForm(false)
      setFormData({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        contact_person: ''
      })
    } catch (error) {
      console.error('Error adding producer:', error)
      alert('Erro ao adicionar produtor. Tente novamente.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white neon-text">Produtores</h1>
          <p className="text-gray-400 mt-1">Gerencie produtores e clientes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 btn-neon"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Produtor
        </button>
      </div>

      {/* Search */}
      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Buscar produtores..."
            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
          />
        </div>
      </div>

      {/* Producers list */}
      <div className="space-y-4">
        {filteredProducers.length > 0 ? (
          filteredProducers.map(producer => (
            <div key={producer.id} className="glass rounded-xl p-6 card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{producer.name}</h3>
                      <p className="text-gray-400">{producer.company_name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{producer.email}</span>
                      </div>
                      {producer.phone && (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{producer.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {producer.city && producer.state && (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{producer.city}, {producer.state}</span>
                        </div>
                      )}
                      {producer.contact_person && (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{producer.contact_person}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ml-6 text-right">
                  <div className="mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs border ${
                      producer.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {producer.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(producer.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass rounded-xl p-6 card-hover">
            <div className="text-center py-8">
              <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {producers.length === 0 ? 'Nenhum produtor cadastrado' : 'Nenhum produtor encontrado'}
              </h3>
              <p className="text-gray-500 mb-6">
                {producers.length === 0 
                  ? 'Comece adicionando seu primeiro produtor.'
                  : 'Tente ajustar o termo de busca.'
                }
              </p>
              {producers.length === 0 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Primeiro Produtor
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary stats */}
      {producers.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resumo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-black/20 rounded-xl">
              <p className="text-sm text-gray-400">Total de Produtores</p>
              <p className="text-2xl font-bold text-white">{producers.length}</p>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-xl">
              <p className="text-sm text-gray-400">Ativos</p>
              <p className="text-2xl font-bold text-green-400">
                {producers.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-xl">
              <p className="text-sm text-gray-400">Inativos</p>
              <p className="text-2xl font-bold text-red-400">
                {producers.filter(p => p.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New producer form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Novo Produtor</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Nome do produtor"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({...prev, company_name: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Razão social da empresa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                  className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Endereço completo"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({...prev, state: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Estado"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pessoa de Contato
                  </label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData(prev => ({...prev, contact_person: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/20 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 btn-neon"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}