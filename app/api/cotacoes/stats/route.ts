import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dias = parseInt(searchParams.get('dias') || '7')
    const grao = searchParams.get('grao')

    const dataInicio = new Date()
    dataInicio.setDate(dataInicio.getDate() - dias)

    const where: any = {
      data: {
        gte: dataInicio,
      },
    }

    if (grao) {
      where.grao = grao.toLowerCase()
    }

    // Buscar cotações
    const cotacoes = await db.cotacao.findMany({
      where,
      orderBy: { data: 'desc' },
    })

    // Calcular estatísticas por grão
    const statsMap = new Map()

    cotacoes.forEach((cot) => {
      if (!statsMap.has(cot.grao)) {
        statsMap.set(cot.grao, {
          grao: cot.grao,
          precos: [],
          taxas: [],
        })
      }
      const stat = statsMap.get(cot.grao)
      stat.precos.push(Number(cot.preco))
      if (cot.dolarReal) {
        stat.taxas.push(Number(cot.dolarReal))
      }
    })

    // Processar estatísticas
    const stats = Array.from(statsMap.values()).map((stat: any) => {
      const precos = stat.precos.sort((a: number, b: number) => a - b)
      const precoAnterior = precos[precos.length - 1] || 0
      const priceAtual = precos[0] || 0
      const variacao = precoAnterior > 0 ? ((priceAtual - precoAnterior) / precoAnterior) * 100 : 0

      return {
        grao: stat.grao,
        priceAtual,
        precoAnterior,
        variacao: variacao.toFixed(2),
        min: Math.min(...precos),
        max: Math.max(...precos),
        media: (precos.reduce((a: number, b: number) => a + b, 0) / precos.length).toFixed(2),
        count: precos.length,
        taxaMediumBRL:
          stat.taxas.length > 0
            ? (stat.taxas.reduce((a: number, b: number) => a + b, 0) / stat.taxas.length).toFixed(4)
            : null,
      }
    })

    return NextResponse.json({
      dias,
      dataInicio,
      dataFim: new Date(),
      stats,
      total: cotacoes.length,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 })
  }
}
