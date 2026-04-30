/**
 * app/api/cotacoes/route.ts
 * Endpoints para gerenciar cotações
 */

import { db } from '@/lib/db'
import { getExchangeRate } from '@/lib/investing-client'
import { NextResponse } from 'next/server'

/**
 * GET /api/cotacoes
 * Lista as cotações mais recentes
 *
 * Query params:
 * - grao: filtrar por grão (soja, milho, trigo)
 * - dias: últimos N dias (padrão: 1)
 * - limit: limite de resultados (padrão: 100)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const grao = searchParams.get('grao')
    const dias = parseInt(searchParams.get('dias') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')

    // Data mínima
    const dataMinima = new Date()
    dataMinima.setDate(dataMinima.getDate() - dias)

    // Montar query
    const where: any = {
      data: { gte: dataMinima }
    }

    if (grao && ['soja', 'milho', 'trigo'].includes(grao)) {
      where.grao = grao
    }

    // Buscar cotações
    const cotacoes = await db.cotacao.findMany({
      where,
      orderBy: { data: 'desc' },
      take: limit
    })

    // Buscar taxa USD/BRL atual
    const dolarReal = await getExchangeRate()

    // Calcular estatísticas por grão
    const stats: Record<string, any> = {}

    for (const g of ['soja', 'milho', 'trigo']) {
      const graoCotacoes = cotacoes.filter(c => c.grao === g)

      if (graoCotacoes.length > 0) {
        const precos = graoCotacoes.map(c => parseFloat(String(c.preco)))
        const precoAtual = precos[0]
        const precoAnterior = precos[1] || precos[0]
        const precoMinimo = Math.min(...precos)
        const precoMaximo = Math.max(...precos)

        stats[g] = {
          precoAtual,
          precoAnterior,
          variacao: precoAtual - precoAnterior,
          variacaoPercent: ((precoAtual - precoAnterior) / precoAnterior * 100).toFixed(2),
          precoMinimo,
          precoMaximo,
          dataAtualiza: graoCotacoes[0].data,
          quantidade: graoCotacoes.length
        }
      }
    }

    return NextResponse.json({
      ok: true,
      dolarReal,
      cotacoes: cotacoes.slice(0, 10), // Retornar últimas 10
      stats,
      filtros: { grao: grao || 'todos', dias, limit }
    })
  } catch (error) {
    console.error('[Cotações] Erro ao listar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cotacoes
 * Criar cotação manualmente (fallback/teste)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { grao, preco, simbolo } = body

    if (!grao || !preco || !simbolo) {
      return NextResponse.json(
        { error: 'Missing required fields: grao, preco, simbolo' },
        { status: 400 }
      )
    }

    if (!['soja', 'milho', 'trigo'].includes(grao)) {
      return NextResponse.json(
        { error: 'Invalid grao. Must be: soja, milho, trigo' },
        { status: 400 }
      )
    }

    const dolarReal = await getExchangeRate()

    const cotacao = await db.cotacao.create({
      data: {
        grao,
        preco: String(parseFloat(preco)),
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
