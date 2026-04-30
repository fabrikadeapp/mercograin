'use client'

export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WebhooksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  const webhookUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/tradingview` : ''
  const secret = process.env.NEXT_PUBLIC_TRADINGVIEW_WEBHOOK_SECRET || 'seu-secret-aqui'

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copiado para clipboard!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">🔗 Configurar Webhooks</h1>
          <p className="text-gray-600 mt-1">Integre TradingView para receber cotações em tempo real</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instrução Principal */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Passo a Passo: Configurar TradingView</h2>

          <div className="space-y-6">
            {/* Passo 1 */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">1️⃣ Ir para TradingView</h3>
              <p className="text-gray-600 mb-3">
                Acesse sua conta TradingView e navigate para <code className="bg-gray-100 px-2 py-1 rounded">Alertas</code>
              </p>
              <a
                href="https://www.tradingview.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                → Ir para TradingView
              </a>
            </div>

            {/* Passo 2 */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">2️⃣ Criar 3 Alertas</h3>
              <p className="text-gray-600 mb-4">Crie alertas para cada commodity:</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">ZS</span>
                  <span className="text-gray-700">Soja (Soybean Futures)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">ZC</span>
                  <span className="text-gray-700">Milho (Corn Futures)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">ZW</span>
                  <span className="text-gray-700">Trigo (Wheat Futures)</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                💡 Dica: Use alertas de preço diário para receber uma atualização por dia
              </p>
            </div>

            {/* Passo 3 */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">3️⃣ Configurar Webhook</h3>
              <p className="text-gray-600 mb-4">Para cada alerta, vá em Notificações e adicione um webhook:</p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Webhook URL:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={webhookUrl}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(webhookUrl)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Header: Authorization
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`Bearer ${secret}`}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(`Bearer ${secret}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Body (JSON):
                  </label>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    {JSON.stringify(
                      {
                        symbol: '{{ticker}}',
                        close: '{{close}}',
                        high: '{{high}}',
                        low: '{{low}}',
                        volume: '{{volume}}',
                        time: '{{time}}',
                      },
                      null,
                      2
                    )}
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify({
                          symbol: '{{ticker}}',
                          close: '{{close}}',
                          high: '{{high}}',
                          low: '{{low}}',
                          volume: '{{volume}}',
                          time: '{{time}}',
                        })
                      )
                    }
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                  >
                    Copiar JSON
                  </button>
                </div>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">4️⃣ Testar Webhook</h3>
              <p className="text-gray-600 mb-4">Após configurar, faça um teste:</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 mb-3">
                  Vá para <code className="bg-white px-2 py-1 rounded">Alertas → Seu Alerta → Teste</code>
                </p>
                <p className="text-sm text-blue-900">
                  Você deve receber uma notificação. Se funcionar, verá os dados em{' '}
                  <code className="bg-white px-2 py-1 rounded">/api/webhooks/tradingview</code>
                </p>
              </div>
            </div>

            {/* Passo 5 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">✅ Pronto!</h3>
              <p className="text-gray-600">
                As cotações começarão a aparecer em{' '}
                <a href="/cotacoes" className="text-blue-600 hover:underline font-semibold">
                  /cotacoes
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-8">
          <h3 className="text-lg font-bold text-yellow-900 mb-4">🆘 Dúvidas?</h3>
          <ul className="space-y-3 text-yellow-900">
            <li>
              <strong>Webhook não dispara:</strong> Verifique se a URL está correta e acessível publicamente
            </li>
            <li>
              <strong>Erro 401 (Unauthorized):</strong> Verifique se o Bearer token está no header correto
            </li>
            <li>
              <strong>Cotações não aparecem:</strong> Verifique os logs em{' '}
              <code className="bg-yellow-100 px-2 py-1 rounded">WebhookLog</code> table
            </li>
            <li>
              <strong>Precisa de ajuda?:</strong> Leia{' '}
              <code className="bg-yellow-100 px-2 py-1 rounded">TRADINGVIEW_SETUP.md</code> no repositório
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
