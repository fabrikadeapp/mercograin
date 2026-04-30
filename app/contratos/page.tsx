'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Contrato {
  id: string
  numero: string
  status: 'pendente' | 'assinado' | 'cancelado'
  valor: number
  cliente: {
    id: string
    nome: string
  }
  dataAssinatura?: string
  criadoEm: string
}

export default function ContratosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      fetchContratos()
    }
  }, [status, router])

  const fetchContratos = async () => {
    try {
      const response = await fetch('/api/contratos')
      if (!response.ok) {
        throw new Error('Erro ao buscar contratos')
      }
      const data = await response.json()
      setContratos(data)
      setError('')
    } catch (err) {
      setError('Erro ao carregar contratos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800'
      case 'assinado':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando contratos...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">🤝 Contratos</h1>
              <p className="text-gray-600 mt-1">Gerencie contratos eletrônicos</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/contratos/novo"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                + Novo Contrato
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

        {contratos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">Nenhum contrato criado ainda</p>
            <Link
              href="/contratos/novo"
              className="text-blue-600 hover:underline mt-4 inline-block font-semibold"
            >
              Criar primeiro contrato
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Número</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Valor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {contratos.map((contrato) => (
                  <tr key={contrato.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{contrato.numero}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contrato.cliente.nome}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-blue-600">
                      R$ {contrato.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contrato.status)}`}>
                        {contrato.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(contrato.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <Link
                        href={`/contratos/${contrato.id}`}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
