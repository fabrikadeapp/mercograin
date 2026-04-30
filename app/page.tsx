import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🌾 MercoGrain</h1>
              <p className="text-gray-600">Sistema Integrado de Trading de Grãos</p>
            </div>
            <div className="text-right">
              <p className="text-gray-700 font-medium">Bem-vindo, {session.user?.name || 'Usuário'}</p>
              <p className="text-gray-500 text-sm">{session.user?.email}</p>
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/auth/login' })
                }}
              >
                <button
                  type="submit"
                  className="text-red-600 hover:text-red-700 text-sm font-semibold mt-2"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">0</div>
              <p className="text-gray-600 mt-2">Clientes</p>
              <Link href="/clientes" className="text-blue-600 hover:underline text-sm mt-3 inline-block">
                Gerenciar →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">0</div>
              <p className="text-gray-600 mt-2">Propostas</p>
              <p className="text-gray-500 text-sm mt-3">Semana 4</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">0</div>
              <p className="text-gray-600 mt-2">Contratos</p>
              <p className="text-gray-500 text-sm mt-3">Semana 5</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">0</div>
              <p className="text-gray-600 mt-2">Boletos</p>
              <p className="text-gray-500 text-sm mt-3">Semana 6-7</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Clientes */}
          <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
            <div className="bg-blue-600 h-32 flex items-center justify-center">
              <span className="text-white text-5xl">👥</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gestão de Clientes</h3>
              <p className="text-gray-600 mb-4">
                Cadastre e gerencie seus clientes (compradores e vendedores).
              </p>
              <Link
                href="/clientes"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Acessar Clientes
              </Link>
            </div>
          </div>

          {/* Cotações */}
          <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
            <div className="bg-green-600 h-32 flex items-center justify-center">
              <span className="text-white text-5xl">📊</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cotações em Tempo Real</h3>
              <p className="text-gray-600 mb-4">
                Receba cotações automáticas de CBOT via TradingView (ZS, ZC, ZW).
              </p>
              <div className="flex gap-2">
                <Link
                  href="/cotacoes"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                >
                  Ver Cotações
                </Link>
                <Link
                  href="/webhooks"
                  className="inline-block bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold text-sm"
                >
                  Configurar
                </Link>
              </div>
            </div>
          </div>

          {/* Propostas */}
          <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
            <div className="bg-purple-600 h-32 flex items-center justify-center">
              <span className="text-white text-5xl">📄</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Propostas Comerciais</h3>
              <p className="text-gray-600 mb-4">
                Crie propostas com templates e exportação para PDF.
              </p>
              <p className="text-gray-500 text-sm">⏳ Semana 4</p>
            </div>
          </div>

          {/* Contratos */}
          <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
            <div className="bg-red-600 h-32 flex items-center justify-center">
              <span className="text-white text-5xl">🤝</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contratos Eletrônicos</h3>
              <p className="text-gray-600 mb-4">
                Crie contratos digitais com assinatura via Signaturely.
              </p>
              <p className="text-gray-500 text-sm">⏳ Semana 5</p>
            </div>
          </div>

          {/* Boletos */}
          <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
            <div className="bg-orange-600 h-32 flex items-center justify-center">
              <span className="text-white text-5xl">💰</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Boletos Bancários</h3>
              <p className="text-gray-600 mb-4">
                Gere boletos via Braspag para múltiplos bancos.
              </p>
              <p className="text-gray-500 text-sm">⏳ Semana 6-7</p>
            </div>
          </div>

          {/* Dashboard */}
          <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
            <div className="bg-indigo-600 h-32 flex items-center justify-center">
              <span className="text-white text-5xl">📈</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard Financeiro</h3>
              <p className="text-gray-600 mb-4">
                Visualize estatísticas e fluxo de caixa.
              </p>
              <p className="text-gray-500 text-sm">⏳ Semana 8</p>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Status do Sistema</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600">Autenticação</p>
              <p className="text-green-600 font-bold">✅ Ativa</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Clientes (CRM)</p>
              <p className="text-green-600 font-bold">✅ Ativa</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">PostgreSQL</p>
              <p className="text-green-600 font-bold">✅ Conectado</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">TradingView</p>
              <p className="text-yellow-600 font-bold">⏳ Pendente</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
