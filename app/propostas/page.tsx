'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Proposta {
  id: string
  numero: string
  assunto: string
  valor: number
  status: 'rascunho' | 'enviada' | 'aceita' | 'rejeitada'
  cliente: {
    id: string
    nome: string
  }
  dataValidade?: string
  criadoEm: string
}

export default function PropostasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      fetchPropostas()
    }
  }, [status, router])

  const fetchPropostas = async () => {
    try {
      const response = await fetch('/api/propostas')
      if (!response.ok) {
        throw new Error('Erro ao buscar propostas')
      }
      const data = await response.json()
      setPropostas(data)
      setError('')
    } catch (err) {
      setError('Erro ao carregar propostas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rascunho':
        return 'bg-gray-100 text-gray-800'
      case 'enviada':
        return 'bg-blue-100 text-blue-800'
      case 'aceita':
        return 'bg-green-100 text-green-800'
      case 'rejeitada':
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
          <p className="mt-4 text-gray-600">Carregando propostas...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">📄 Propostas Comerciais</h1>
              <p className="text-gray-600 mt-1">Crie e gerencie suas propostas</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/propostas/nova"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                + Nova Proposta
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

        {propostas.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">Nenhuma proposta criada ainda</p>
            <Link
              href="/propostas/nova"
              className="text-blue-600 hover:underline mt-4 inline-block font-semibold"
            >
              Criar primeira proposta
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {propostas.map((proposta) => (
              <div key={proposta.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{proposta.assunto}</h3>
                    <p className="text-sm text-gray-600">#{proposta.numero}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(proposta.status)}`}>
                    {proposta.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4 border-t border-b py-4">
                  <div>
                    <p className="text-sm text-gray-600">Cliente</p>
                    <p className="font-semibold text-gray-900">{proposta.cliente.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {(proposta.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  {proposta.dataValidade && (
                    <div>
                      <p className="text-sm text-gray-600">Válida até</p>
                      <p className="text-gray-900">
                        {new Date(proposta.dataValidade).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/propostas/${proposta.id}`}
                    className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Visualizar
                  </Link>
                  <Link
                    href={`/propostas/${proposta.id}/editar`}
                    className="flex-1 text-center bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
