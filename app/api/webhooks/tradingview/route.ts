/**
 * app/api/webhooks/tradingview/route.ts
 * Webhook para receber cotações do TradingView
 */

import { db } from '@/lib/db'
import { getExchangeRate } from '@/lib/investing-client'
import { NextResponse } from 'next/server'

// Mapeamento de símbolo TradingView para grão
const SYMBOL_TO_GRAO: Record<string, string> = {
  'ZS': 'soja',
  'ZC': 'milho',
  'ZW': 'trigo',
  'CBOT:ZS': 'soja',
  'CBOT:ZC': 'milho',
  'CBOT:ZW': 'trigo'
}

/**
 * POST /api/webhooks/tradingview
 * Recebe webhooks do TradingView com preços CBOT
 *
 * Body esperado:
 * {
 *   "symbol": "ZS",
 *   "close": 565.50,
 *   "time": 1704067200,
 *   "high": 568.00,
 *   "low": 563.00,
 *   "volume": 150000
 * }
 */
export async function POST(req: Request) {
  try {
    // Validar webhook secret
    const secret = req.headers.get('x-tradingview-secret')
    if (secret !== process.env.TRADINGVIEW_WEBHOOK_SECRET) {
      console.warn('[TradingView] Webhook secret inválido')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await req.json()

    console.log('[TradingView] Webhook recebido:', {
      symbol: payload.symbol,
      close: payload.close,
      time: payload.time
    })

    // Normalizar símbolo
    let symbol = payload.symbol?.toUpperCase() || ''
    if (!symbol.startsWith('CBOT:')) {
      symbol = symbol.substring(symbol.lastIndexOf(':') + 1)
    } else {
      symbol = symbol.substring(5) // Remove "CBOT:" prefix
    }

    // Validar símbolo
    if (!SYMBOL_TO_GRAO[symbol]) {
      console.warn(`[TradingView] Símbolo desconhecido: ${symbol}`)
      return NextResponse.json(
        { error: `Unknown symbol: ${symbol}` },
        { status: 400 }
      )
    }

    const grao = SYMBOL_TO_GRAO[symbol]
    const price = parseFloat(payload.close)

    if (isNaN(price) || price <= 0) {
      console.warn(`[TradingView] Preço inválido: ${payload.close}`)
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      )
    }

    // Buscar taxa USD/BRL atual (do Investing.com)
    const dolarReal = await getExchangeRate()

    // Salvar cotação no banco
    const cotacao = await db.cotacao.create({
      data: {
        grao,
        preco: String(price),
        simbolo: symbol,
        fonte: 'TradingView',
        dolarReal: dolarReal ? String(dolarReal) : null,
        volume: payload.volume || null,
        data: payload.time ? new Date(payload.time * 1000) : new Date()
      }
    })

    console.log(`[TradingView] Cotação salva: ${grao} - ${price} (USD/BRL: ${dolarReal})`)

    // Log do webhook para auditoria
    await db.webhookLog.create({
      data: {
        tipo: 'tradingview',
        payload,
        status: 200
      }
    })

    return NextResponse.json({
      ok: true,
      cotacao: {
        grao: cotacao.grao,
        preco: cotacao.preco,
        dolarReal: cotacao.dolarReal,
        timestamp: cotacao.data
      }
    })
  } catch (error) {
    console.error('[TradingView] Erro ao processar webhook:', error)

    // Log de erro
    await db.webhookLog.create({
      data: {
        tipo: 'tradingview',
        payload: await req.json().catch(() => ({})),
        status: 500,
        erro: error instanceof Error ? error.message : 'Unknown error'
      }
    }).catch(console.error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

