import { db } from '@/lib/db'
import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const boletoSchema = z.object({
  clienteId: z.string().min(1),
  numero: z.string().min(1),
  banco: z.string().min(1),
  valor: z.number().positive(),
  vencimento: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const boletos = await db.boleto.findMany({
      where: {
        cliente: {
          usuarioId: session.user.id,
        },
      },
      include: {
        cliente: {
          select: { id: true, nome: true },
        },
      },
      orderBy: { criadoEm: 'desc' },
    })

    return NextResponse.json(boletos)
  } catch (error) {
    console.error('Get boletos error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar boletos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const data = boletoSchema.parse(body)

    const cliente = await db.cliente.findUnique({
      where: { id: data.clienteId },
    })

    if (!cliente || cliente.usuarioId !== session.user.id) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // TODO: Integração Braspag
    // const braspagResponse = await fetch('https://api.braspag.com.br/v2/sales', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.BRASPAG_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     MerchantOrderId: data.numero,
    //     Customer: {
    //       Name: cliente.nome,
    //       Identity: cliente.cpf || cliente.cnpj,
    //     },
    //     Payment: {
    //       Type: 'Boleto',
    //       Amount: data.valor,
    //       Provider: data.banco.toLowerCase(),
    //       BoletoNumber: data.numero,
    //       Demonstrative: `Boleto ${data.numero}`,
    //     },
    //   }),
    // })

    const boleto = await db.boleto.create({
      data: {
        ...data,
        vencimento: new Date(data.vencimento),
        status: 'aberto',
      },
      include: { cliente: true },
    })

    return NextResponse.json(boleto, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Create boleto error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar boleto' },
      { status: 500 }
    )
  }
}
