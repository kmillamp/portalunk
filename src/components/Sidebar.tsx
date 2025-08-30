import React from 'react'
import { 
  Home, 
  Calendar, 
  FileText, 
  DollarSign, 
  Users, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Music
} from 'lucide-react'
import type { ViewType } from '@/types'

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  collapsed: boolean
  onToggleCollapse: () => void
  userRole?: string
}

const navigationItems = [
  {
    id: 'dashboard' as ViewType,
    label: 'Dashboard',
    icon: Home,
    adminOnly: false
  },
  {
    id: 'calendar' as ViewType,
    label: 'Calendário',
    icon: Calendar,
    adminOnly: true
  },
  {
    id: 'contracts' as ViewType,
    label: 'Contratos',
    icon: FileText,
    adminOnly: true
  },
  {
    id: 'financial' as ViewType,
    label: 'Financeiro',
    icon: DollarSign,
    adminOnly: true
  },
  {
    id: 'producers' as ViewType,
    label: 'Produtores',
    icon: Users,
    adminOnly: true
  },
  {
    id: 'producer-dashboard' as ViewType,
    label: 'Relatórios',
    icon: BarChart3,
    adminOnly: true
  }
]

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  collapsed, 
  onToggleCollapse, 
  userRole 
}: SidebarProps) {
  const isAdmin = userRole === 'admin'

  const filteredItems = navigationItems.filter(item => 
    !item.adminOnly || isAdmin
  )

  return (
    <div className={`fixed left-0 top-0 h-full sidebar transition-all duration-300 z-40 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className={`flex items-center transition-opacity duration-300 ${
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3 neon-glow">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white neon-text">UNK</h2>
                <p className="text-xs text-gray-400">Assessoria</p>
              </div>
            </div>
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredItems.map((item) => {
            const IconComponent = item.icon
            const isActive = currentView === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 neon-glow'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${
                  collapsed ? 'mx-auto' : 'mr-3'
                } transition-colors`} />
                <span className={`font-medium transition-opacity duration-300 ${
                  collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                }`}>
                  {item.label}
                </span>
                {isActive && !collapsed && (
                  <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full neon-glow"></div>
                )}
              </button>
            )
          })}
        </nav>

        {/* User role indicator */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}>
            <div className={`flex items-center transition-opacity duration-300 ${
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
              <Music className="w-4 h-4 text-purple-400 mr-2" />
              <div>
                <p className="text-xs font-medium text-white">
                  {isAdmin ? 'Administrador' : 'Produtor'}
                </p>
                <p className="text-xs text-gray-500">Portal UNK</p>
              </div>
            </div>
            {collapsed && (
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full neon-glow"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
