import React, { useState } from 'react'
import { Bell, Search, Settings, LogOut, User, Menu, X } from 'lucide-react'
import type { User as UserType } from '@/types'

interface TopBarProps {
  user: UserType
  onLogout: () => void
}

export default function TopBar({ user, onLogout }: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    setShowUserMenu(false)
    onLogout()
  }

  return (
    <header className="fixed top-0 right-0 left-0 h-16 glass-dark border-b border-white/10 z-30">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar DJs, eventos, contratos..."
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-sm transition-all duration-300"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full neon-glow"></div>
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 glass rounded-xl border border-white/10 neon-glow z-50">
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-3">Notificações</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                      <p className="text-sm text-white font-medium">Novo contrato pendente</p>
                      <p className="text-xs text-gray-400 mt-1">DJ Alok - Summer Festival 2025</p>
                      <p className="text-xs text-purple-400 mt-1">Há 2 horas</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                      <p className="text-sm text-white font-medium">Evento confirmado</p>
                      <p className="text-xs text-gray-400 mt-1">House Night Rio - 08/03/2025</p>
                      <p className="text-xs text-purple-400 mt-1">Há 5 horas</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                      <p className="text-sm text-white font-medium">Pagamento processado</p>
                      <p className="text-xs text-gray-400 mt-1">Vintage Culture - R$ 35.000</p>
                      <p className="text-xs text-purple-400 mt-1">Ontem</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Ver todas as notificações
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">
                  {user.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {user.role === 'admin' ? 'Administrador' : 'Produtor'}
                </p>
              </div>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-64 glass rounded-xl border border-white/10 neon-glow z-50">
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {user.full_name || 'Usuário'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {user.email}
                      </p>
                      <p className="text-xs text-purple-400 capitalize">
                        {user.role === 'admin' ? 'Administrador' : 'Produtor'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-white">Meu Perfil</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-white">Configurações</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <Bell className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-white">Notificações</span>
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-left group"
                    >
                      <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                      <span className="text-sm text-white group-hover:text-red-400">Sair</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => {
            setShowUserMenu(false)
            setShowNotifications(false)
          }}
        />
      )}
    </header>
  )
}
