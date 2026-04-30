'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Cotacao {
  id: string
  grao: string
  preco: number
  simbolo: string
  dolarReal: number
  volume?: number
  data: string
}

interface Estatisticas {
  grao: string
  priceAtual: number
  precoAnterior: number
  variacao: number
  min: number
  max: number
  count: number
}

export default function CotacoesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([])
  const [stats, setStats] = useState<Estatisticas[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [dias, setDias] = useState(7)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      fetchCotacoes()
    }
  }, [status, router, dias])

  const fetchCotacoes = async () => {
    try {
      const response = await fetch(`/api/cotacoes?dias=${dias}&limit=100`)
      if (!response.ok) {
        throw new Error('Erro ao buscar cotações')
      }
      const data = await response.json()
      setCotacoes(data.cotacoes || [])
      setStats(data.stats || [])
      setErro('')
    } catch (err) {
      setErro('Erro ao carregar cotações')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getGraoColor = (grao: string) => {
    switch (grao.toLowerCase()) {
      case 'soja':
        return 'bg-yellow-100 text-yellow-800'
      case 'milho':
        return 'bg-blue-100 text-blue-800'
      case 'trigo':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVariacaoColor = (variacao: number) => {
    if (variacao > 0) return 'text-green-600'
    if (variacao < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando cotações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Cotações em Tempo Real</h1>
              <p className="text-gray-600 mt-1">Acompanhe preços CBOT via TradingView</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período
          </label>
          <div className="flex gap-2">
            {[7, 30, 90, 365].map((d) => (
              <button
                key={d}
                onClick={() => setDias(d)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  dias === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {d === 7 ? '7d' : d === 30 ? '30d' : d === 90 ? '90d' : '1a'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {erro}
          </div>
        )}

        {/* Estatísticas */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.grao} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 capitalize">{stat.grao}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getGraoColor(
                      stat.grao
                    )}`}
                  >
                    CBOT
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Preço Atual</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${stat.priceAtual.toFixed(2)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Variação 24h</p>
                      <p className={`font-bold ${getVariacaoColor(stat.variacao)}`}>
                        {stat.variacao > 0 ? '+' : ''}
                        {stat.variacao.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mín/Máx</p>
                      <p className="text-sm font-semibold text-gray-700">
                        ${stat.min.toFixed(2)} / ${stat.max.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    {stat.count} cotações registradas
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabela de Cotações */}
        {cotacoes.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Histórico de Cotações</h2>
              <p className="text-sm text-gray-600">Últimos {dias} dias</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Grão
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Símbolo
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Preço USD
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      USD/BRL
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Preço BRL
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Volume
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cotacoes.map((cot) => {
                    const precoBRL = cot.preco * cot.dolarReal
                    return (
                      <tr key={cot.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(cot.data).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getGraoColor(
                              cot.grao
                            )}`}
                          >
                            {cot.grao}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                          {cot.simbolo}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                          ${cot.preco.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-600">
                          {cot.dolarReal.toFixed(4)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-blue-600">
                          R$ {precoBRL.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-600">
                          {cot.volume ? cot.volume.toLocaleString('pt-BR') : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">
              Nenhuma cotação registrada ainda
            </p>
            <p className="text-gray-500 mt-2">
              Configure TradingView webhooks para começar a receber cotações em tempo real
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 rounded-lg border-l-4 border-blue-500 p-6">
          <h3 className="font-bold text-gray-900 mb-2">📌 Como Configurar TradingView</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
            <li>Acesse TradingView e crie 3 alertas para: ZS (Soja), ZC (Milho), ZW (Trigo)</li>
            <li>Configure webhook para: https://seu-dominio.railway.app/api/webhooks/tradingview</li>
            <li>Use o TRADINGVIEW_WEBHOOK_SECRET para validação</li>
            <li>As cotações aparecerão aqui automaticamente</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
