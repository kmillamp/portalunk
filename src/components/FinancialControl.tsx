import React from 'react'
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Banknote } from 'lucide-react'

export default function FinancialControl() {
  const financialData = {
    revenue: {
      current: 285000,
      previous: 245000,
      growth: 16.3
    },
    pending: {
      amount: 85000,
      count: 12
    },
    processed: {
      amount: 200000,
      count: 28
    }
  }

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
          {[
            { id: 1, dj: 'DJ Alok', amount: 50000, status: 'completed', date: '15/01/2025' },
            { id: 2, dj: 'Vintage Culture', amount: 35000, status: 'pending', date: '10/01/2025' },
            { id: 3, dj: 'Anitta', amount: 80000, status: 'completed', date: '05/01/2025' }
          ].map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/10">
              <div>
                <p className="font-medium text-white">{transaction.dj}</p>
                <p className="text-sm text-gray-400">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">
                  R$ {transaction.amount.toLocaleString('pt-BR')}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  transaction.status === 'completed' 
                    ? 'status-completed' 
                    : 'status-pending'
                }`}>
                  {transaction.status === 'completed' ? 'Pago' : 'Pendente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
