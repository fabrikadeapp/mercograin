'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Boleto {
  id: string
  numero: string
  banco: string
  valor: number
  vencimento: string
  status: 'aberto' | 'pago' | 'vencido'
  cliente: {
    id: string
    nome: string
  }
  criadoEm: string
}

export default function BoletosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [boletos, setBoletos] = useState<Boleto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      fetchBoletos()
    }
  }, [status, router])

  const fetchBoletos = async () => {
    try {
      const response = await fetch('/api/boletos')
      if (!response.ok) {
        throw new Error('Erro ao buscar boletos')
      }
      const data = await response.json()
      setBoletos(data)
      setError('')
    } catch (err) {
      setError('Erro ao carregar boletos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'bg-yellow-100 text-yellow-800'
      case 'pago':
        return 'bg-green-100 text-green-800'
      case 'vencido':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getBancoIcon = (banco: string) => {
    const bancos: { [key: string]: string } = {
      itau: '🏦',
      sicredi: '🏢',
      nubank: '💜',
      c6: '🟣',
      bradesco: '🔴',
      santander: '🔵',
      caixa: '💙',
    }
    return bancos[banco.toLowerCase()] || '🏦'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando boletos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💰 Boletos Bancários</h1>
              <p className="text-gray-600 mt-1">Gerencie boletos via Braspag</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/boletos/novo"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                + Novo Boleto
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {boletos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">Nenhum boleto criado ainda</p>
            <Link
              href="/boletos/novo"
              className="text-blue-600 hover:underline mt-4 inline-block font-semibold"
            >
              Criar primeiro boleto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {boletos.map((boleto) => {
              const diasParaVencer = Math.ceil(
                (new Date(boleto.vencimento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              )
              return (
                <div key={boleto.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getBancoIcon(boleto.banco)}</span>
                        <h3 className="text-lg font-bold text-gray-900">{boleto.banco.toUpperCase()}</h3>
                      </div>
                      <p className="text-sm text-gray-600">#{boleto.numero}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(boleto.status)}`}>
                      {boleto.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4 border-t border-b py-4">
                    <div>
                      <p className="text-sm text-gray-600">Cliente</p>
                      <p className="font-semibold text-gray-900">{boleto.cliente.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valor</p>
                      <p className="text-2xl font-bold text-green-600">
                        R$ {boleto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-600">Vencimento</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(boleto.vencimento).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Dias</p>
                        <p
                          className={`font-semibold ${
                            diasParaVencer < 0
                              ? 'text-red-600'
                              : diasParaVencer < 3
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {diasParaVencer < 0 ? `Vencido ${Math.abs(diasParaVencer)}d` : `${diasParaVencer}d`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/boletos/${boleto.id}`}
                    className="w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold block"
                  >
                    Visualizar
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
