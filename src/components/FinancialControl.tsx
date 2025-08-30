import React from 'react'
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Banknote } from 'lucide-react'
import { useSupabaseData } from '@/hooks/useSupabaseData'

export default function FinancialControl() {
  const { events, contracts } = useSupabaseData()
  
  // Calculate real financial data from Supabase
  const calculateFinancialData = () => {
    const completedEvents = events.filter(e => e.status === 'completed')
    const pendingEvents = events.filter(e => e.status === 'confirmed' || e.status === 'pending')
    
    const totalRevenue = completedEvents.reduce((sum, event) => sum + (event.booking_fee || 0), 0)
    const pendingAmount = pendingEvents.reduce((sum, event) => sum + (event.booking_fee || 0), 0)
    
    const previousMonthEvents = completedEvents.filter(event => {
      const eventDate = new Date(event.event_date)
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      return eventDate.getMonth() === lastMonth.getMonth() && 
             eventDate.getFullYear() === lastMonth.getFullYear()
    })
    
    const currentMonthEvents = completedEvents.filter(event => {
      const eventDate = new Date(event.event_date)
      const now = new Date()
      return eventDate.getMonth() === now.getMonth() && 
             eventDate.getFullYear() === now.getFullYear()
    })
    
    const previousMonthRevenue = previousMonthEvents.reduce((sum, event) => sum + (event.booking_fee || 0), 0)
    const currentMonthRevenue = currentMonthEvents.reduce((sum, event) => sum + (event.booking_fee || 0), 0)
    
    const growth = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0
    
    return {
      revenue: {
        current: totalRevenue,
        previous: previousMonthRevenue,
        growth: growth
      },
      pending: {
        amount: pendingAmount,
        count: pendingEvents.length
      },
      processed: {
        amount: totalRevenue,
        count: completedEvents.length
      }
    }
  }
  
  const financialData = calculateFinancialData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white neon-text">Controle Financeiro</h1>
        <p className="text-gray-400 mt-1">Acompanhe receitas, pagamentos e estatísticas</p>
      </div>

      {/* Financial summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Receita Total</h3>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-green-400">
              R$ {financialData.revenue.current.toLocaleString('pt-BR')}
            </p>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">+{financialData.revenue.growth}%</span>
              <span className="text-sm text-gray-400">vs mês anterior</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Pendentes</h3>
            <CreditCard className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-yellow-400">
              R$ {financialData.pending.amount.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-400">
              {financialData.pending.count} pagamentos pendentes
            </p>
          </div>
        </div>

        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Processados</h3>
            <Banknote className="w-6 h-6 text-blue-400" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-blue-400">
              R$ {financialData.processed.amount.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-400">
              {financialData.processed.count} pagamentos realizados
            </p>
          </div>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="glass rounded-xl p-8">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Gráficos Financeiros</h3>
          <p className="text-gray-400">Visualização de dados em desenvolvimento</p>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Transações Recentes</h2>
        <div className="space-y-4">
          {events
            .filter(event => event.booking_fee && event.booking_fee > 0)
            .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
            .slice(0, 10)
            .map(event => {
              const dj = djs.find(d => d.id === event.dj_id)
              return (
                <div key={event.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/10">
                  <div>
                    <p className="font-medium text-white">{dj?.name || 'DJ não encontrado'}</p>
                    <p className="text-sm text-gray-400">{new Date(event.event_date).toLocaleDateString('pt-BR')}</p>
                    <p className="text-xs text-gray-500">{event.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      R$ {event.booking_fee?.toLocaleString('pt-BR')}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.status === 'completed' 
                        ? 'status-completed' 
                        : event.status === 'confirmed'
                        ? 'status-confirmed'
                        : 'status-pending'
                    }`}>
                      {event.status === 'completed' ? 'Pago' : 
                       event.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </span>
                  </div>
                </div>
              )
            })}
          
          {events.filter(e => e.booking_fee && e.booking_fee > 0).length === 0 && (
              <div>
                <p className="font-medium text-white">{transaction.dj}</p>
                <p className="text-sm text-gray-400">{transaction.date}</p>
              </div>
                    : 'status-pending'
          )}
              <p className="text-center text-gray-400 py-8">
                Nenhuma transação encontrada
    </div>
  )
}
