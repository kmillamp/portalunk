import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
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
import { mockDJs, mockEvents, mockContracts, mockProducers } from '@/data/mockData'

export default function App() {
  const { user, loading, signOut } = useAuth()
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [selectedDJ, setSelectedDJ] = useState<DJ | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showAddDJModal, setShowAddDJModal] = useState(false)
  
  // Estados dos dados (usando dados mockados temporariamente)
  const [djs, setDJs] = useState<DJ[]>(mockDJs)
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [producers, setProducers] = useState<Producer[]>(mockProducers)

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

  const handleAddDJ = () => {
    setShowAddDJModal(true)
  }

  const handleAddDJSubmit = (newDJData: Omit<DJ, 'id' | 'created_at' | 'updated_at'>) => {
    const newDJ: DJ = {
      ...newDJData,
      id: Date.now().toString(), // ID temporário
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    setDJs(prev => [...prev, newDJ])
    setShowAddDJModal(false)
  }

  const handleDJUpdate = (updatedDJ: DJ) => {
    setDJs(prev => prev.map(dj => dj.id === updatedDJ.id ? updatedDJ : dj))
  }

  const handleEventAdded = (newEvent: Event) => {
    setEvents(prev => [...prev, newEvent])
  }

  const handleEventUpdated = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event))
  }

  const handleEventDeleted = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId))
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots mb-6">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-400 text-lg">Carregando Portal UNK...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
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
