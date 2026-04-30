/**
 * app/api/cotacoes/route.ts
 * Endpoints para gerenciar cotações (CBOT via TradingView)
 */

import { db } from '@/lib/db'
import { getExchangeRate } from '@/lib/investing-client'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const grao = searchParams.get('grao')
    const dias = parseInt(searchParams.get('dias') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')

    const dataMinima = new Date()
    dataMinima.setDate(dataMinima.getDate() - dias)

    const where: any = { data: { gte: dataMinima } }
    if (grao && ['soja', 'milho', 'trigo'].includes(grao)) {
      where.grao = grao
    }

    const cotacoes = await db.cotacao.findMany({
      where,
      orderBy: { data: 'desc' },
      take: limit
    })

    const dolarReal = await getExchangeRate()

    const stats: Record<string, any> = {}
    for (const g of ['soja', 'milho', 'trigo']) {
      const graoCotacoes = cotacoes.filter(c => c.grao === g)
      if (graoCotacoes.length > 0) {
        const precos = graoCotacoes.map(c => parseFloat(String(c.preco)))
        stats[g] = {
          precoAtual: precos[0],
          precoAnterior: precos[1] || precos[0],
          variacao: precos[0] - (precos[1] || precos[0]),
          precoMinimo: Math.min(...precos),
          precoMaximo: Math.max(...precos)
        }
      }
    }

    return NextResponse.json({
      ok: true,
      dolarReal,
      cotacoes: cotacoes.slice(0, 10),
      stats
    })
  } catch (error) {
    console.error('[Cotações] Erro:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { grao, preco, simbolo } = body

    if (!grao || !preco || !simbolo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['soja', 'milho', 'trigo'].includes(grao)) {
      return NextResponse.json(
        { error: 'Invalid grao' },
        { status: 400 }
      )
    }

    const dolarReal = await getExchangeRate()
    const precoNum = parseFloat(preco)

    if (isNaN(precoNum) || precoNum <= 0) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      )
    }

    const cotacao = await db.cotacao.create({
      data: {
        grao,
        preco: String(precoNum),
        simbolo,
        fonte: 'API',
        dolarReal: dolarReal ? String(dolarReal) : null
      }
    })

    return NextResponse.json(
      { ok: true, cotacao },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Cotações] Erro ao criar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
