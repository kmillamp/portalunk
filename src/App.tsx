import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSupabaseData } from '@/hooks/useSupabaseData'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import Calendar from '@/components/Calendar'
import FinancialControl from '@/components/FinancialControl'
import ProducerRegistration from '@/components/ProducerRegistration'
import AddDJModal from '@/components/AddDJModal'
import AccessDenied from '@/components/AccessDenied'
import DJProfile from '@/components/DJProfile'
import { AccessControlManager } from '@/lib/access-control'
import type { DJ, Event, Contract, Producer, ViewType } from '@/types'

export default function App() {
  const { user, loading, signOut } = useAuth()
  const { 
    djs, 
    events, 
    contracts, 
    producers, 
    loading: dataLoading, 
    error: dataError,
    addDJ,
    updateDJ,
    addEvent,
    updateEvent,
    deleteEvent,
    addProducer
  } = useSupabaseData()
  
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [selectedDJ, setSelectedDJ] = useState<DJ | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showAddDJModal, setShowAddDJModal] = useState(false)

  const handleDJSelect = (dj: DJ) => {
    if (!user) return

    const canAccess = AccessControlManager.canAccessDJ(user, dj.id, events)
    if (!canAccess && user.role === 'produtor') {
      alert('Você só pode visualizar DJs que já contratou através da UNK Assessoria.')
      return
    }

    setSelectedDJ(dj)
    setCurrentView('dj-details')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedDJ(null)
  }

  const handleViewChange = (view: ViewType) => {
    if (!user) return

    // Verificar permissões para views restritas
    const restrictedViews = ['calendar', 'contracts', 'financial', 'producers', 'producer-dashboard']
    if (restrictedViews.includes(view) && user.role === 'produtor') {
      return // Não fazer nada se o produtor tentar acessar áreas restritas
    }

    setCurrentView(view)
    setSelectedDJ(null)
  }

  const handleAddDJ = async () => {
    setShowAddDJModal(true)
  }

  const handleAddDJSubmit = async (newDJData: Omit<DJ, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await addDJ(newDJData)
      if (error) {
        console.error('Error adding DJ:', error)
        alert('Erro ao adicionar DJ. Tente novamente.')
        return
      }
      setShowAddDJModal(false)
    } catch (error) {
      console.error('Error adding DJ:', error)
      alert('Erro ao adicionar DJ. Tente novamente.')
    }
  }

  const handleDJUpdate = async (updatedDJ: DJ) => {
    try {
      const { error } = await updateDJ(updatedDJ.id, updatedDJ)
      if (error) {
        console.error('Error updating DJ:', error)
        alert('Erro ao atualizar DJ. Tente novamente.')
      }
    } catch (error) {
      console.error('Error updating DJ:', error)
      alert('Erro ao atualizar DJ. Tente novamente.')
    }
  }

  const handleEventAdded = async (newEvent: Event) => {
    try {
      const { error } = await addEvent(newEvent)
      if (error) {
        console.error('Error adding event:', error)
        alert('Erro ao adicionar evento. Tente novamente.')
      }
    } catch (error) {
      console.error('Error adding event:', error)
      alert('Erro ao adicionar evento. Tente novamente.')
    }
  }

  const handleEventUpdated = async (updatedEvent: Event) => {
    try {
      const { error } = await updateEvent(updatedEvent.id, updatedEvent)
      if (error) {
        console.error('Error updating event:', error)
        alert('Erro ao atualizar evento. Tente novamente.')
      }
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Erro ao atualizar evento. Tente novamente.')
    }
  }

  const handleEventDeleted = async (eventId: string) => {
    try {
      const { error } = await deleteEvent(eventId)
      if (error) {
        console.error('Error deleting event:', error)
        alert('Erro ao excluir evento. Tente novamente.')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Erro ao excluir evento. Tente novamente.')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      // O AuthContext já limpa o localStorage e o estado
      // O componente será re-renderizado automaticamente
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots mb-6">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-400 text-lg">
            {loading ? 'Carregando Portal UNK...' : 'Carregando dados...'}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  // Show error if data loading failed
  if (dataError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-400 mb-4">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }
  const isProducer = user.role === 'produtor'
  const filteredEvents = AccessControlManager.filterEvents(events, user)
  const filteredDJs = AccessControlManager.filterDJs(djs, events, user)
  const filteredContracts = AccessControlManager.filterContracts(contracts, user)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-800/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-700/10 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-800/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="flex h-screen relative z-10">
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole={user.role}
        />

        <div className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <TopBar user={user} onLogout={handleLogout} />

          <main className="flex-1 overflow-auto p-6 pt-20">
            {/* Dashboard */}
            {currentView === 'dashboard' && (
              <Dashboard
                djs={isProducer ? filteredDJs : djs}
                onDJSelect={handleDJSelect}
                onAddDJ={handleAddDJ}
              />
            )}

            {/* Add DJ Modal */}
            <AddDJModal
              isOpen={showAddDJModal}
              onClose={() => setShowAddDJModal(false)}
              onAddDJ={handleAddDJSubmit}
            />

            {/* Calendar - Admin only */}
            {currentView === 'calendar' && !isProducer && (
              <Calendar djs={djs} onEventAdded={handleEventAdded} />
            )}

            {/* Financial - Admin only */}
            {currentView === 'financial' && !isProducer && (
              <FinancialControl />
            )}

            {/* Producers - Admin only */}
            {currentView === 'producers' && !isProducer && (
              <ProducerRegistration />
            )}

            {/* Access denied for restricted areas */}
            {isProducer && (
              currentView === 'calendar' ||
              currentView === 'contracts' ||
              currentView === 'financial' ||
              currentView === 'producers' ||
              currentView === 'producer-dashboard'
            ) && (
              <AccessDenied
                message="Esta seção é exclusiva para administradores da UNK Assessoria."
                resource={currentView}
                showContact={true}
              />
            )}

            {/* DJ Details placeholder */}
            {currentView === 'dj-details' && selectedDJ && (
              <DJProfile
                dj={selectedDJ}
                onBack={handleBackToDashboard}
                events={filteredEvents}
                onDJUpdate={handleDJUpdate}
                onEventAdded={handleEventAdded}
                onEventUpdated={handleEventUpdated}
                onEventDeleted={handleEventDeleted}
              />
            )}

            {/* Contracts placeholder */}
            {currentView === 'contracts' && !isProducer && (
              <div className="glass rounded-xl p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Contratos</h2>
                  <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
                </div>
              </div>
            )}

            {/* Producer dashboard placeholder */}
            {currentView === 'producer-dashboard' && !isProducer && (
              <div className="glass rounded-xl p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Dashboard de Produtores</h2>
                  <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
