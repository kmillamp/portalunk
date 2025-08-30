import React from 'react'
import { DollarSign, TrendingUp, TrendingDown, Calendar, CreditCard, Banknote, PieChart } from 'lucide-react'

interface FinancialData {
  totalEarnings: number
  pendingPayments: number
  completedEvents: number
  averageEventValue: number
  monthlyEarnings: { month: string; amount: number }[]
  commissionRate: number
  netEarnings: number
}

interface FinancialSummaryProps {
  djId: string
  data: FinancialData
}

export default function FinancialSummary({ djId, data }: FinancialSummaryProps) {
  const currentMonth = new Date().getMonth()
  const currentMonthEarnings = data.monthlyEarnings[currentMonth]?.amount || 0
  const previousMonthEarnings = data.monthlyEarnings[currentMonth - 1]?.amount || 0
  const growthPercentage = previousMonthEarnings > 0 
    ? ((currentMonthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100 
    : 0

  const maxEarnings = Math.max(...data.monthlyEarnings.map(m => m.amount))

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-400">Ganhos Totais</h3>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400 mb-2">
            R$ {data.totalEarnings.toLocaleString('pt-BR')}
          </p>
          <div className="flex items-center space-x-1">
            {growthPercentage >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm ${growthPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Math.abs(growthPercentage).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-400">vs mês anterior</span>
          </div>
        </div>

        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-400">Valor Líquido</h3>
            <Banknote className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400 mb-2">
            R$ {data.netEarnings.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-gray-500">
            Após comissão UNK ({data.commissionRate}%)
          </p>
        </div>

        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-400">Pendente</h3>
            <CreditCard className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400 mb-2">
            R$ {data.pendingPayments.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-gray-500">A receber</p>
        </div>

        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-400">Média/Evento</h3>
            <PieChart className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mb-2">
            R$ {data.averageEventValue.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-gray-500">
            {data.completedEvents} eventos
          </p>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
          Evolução Mensal
        </h3>
        <div className="space-y-4">
          {data.monthlyEarnings.map((month, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="text-gray-400 w-12 text-sm">{month.month}</span>
              <div className="flex-1">
                <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${(month.amount / maxEarnings) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <span className="text-white font-semibold w-24 text-right">
                R$ {(month.amount / 1000).toFixed(0)}k
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Breakdown de Comissões</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
              <div>
                <p className="text-white font-medium">Valor Bruto</p>
                <p className="text-sm text-gray-400">Total dos cachês</p>
              </div>
              <p className="text-xl font-bold text-white">
                R$ {data.totalEarnings.toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-600/10 border border-red-500/20 rounded-xl">
              <div>
                <p className="text-red-400 font-medium">Comissão UNK</p>
                <p className="text-sm text-gray-400">{data.commissionRate}% do valor bruto</p>
              </div>
              <p className="text-xl font-bold text-red-400">
                - R$ {(data.totalEarnings * (data.commissionRate / 100)).toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-600/10 border border-green-500/20 rounded-xl">
              <div>
                <p className="text-green-400 font-medium">Valor Líquido</p>
                <p className="text-sm text-gray-400">Valor final para o DJ</p>
              </div>
              <p className="text-xl font-bold text-green-400">
                R$ {data.netEarnings.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Estatísticas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Eventos Concluídos</span>
              <span className="text-white font-semibold">{data.completedEvents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Valor Médio/Evento</span>
              <span className="text-white font-semibold">
                R$ {data.averageEventValue.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Taxa de Comissão</span>
              <span className="text-white font-semibold">{data.commissionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Pagamentos Pendentes</span>
              <span className="text-yellow-400 font-semibold">
                R$ {data.pendingPayments.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}