import { db } from '@/lib/db'
import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contratoSchema = z.object({
  proposIdFk: z.string().min(1),
  clienteId: z.string().min(1),
  numero: z.string().min(1),
  descricao: z.string().optional(),
  valor: z.number().positive(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const contratos = await db.contrato.findMany({
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

    return NextResponse.json(contratos)
  } catch (error) {
    console.error('Get contratos error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar contratos' },
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
    const data = contratoSchema.parse(body)

    const cliente = await db.cliente.findUnique({
      where: { id: data.clienteId },
    })

    if (!cliente || cliente.usuarioId !== session.user.id) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    const contrato = await db.contrato.create({
      data: {
        ...data,
        dataInicio: new Date(),
        statusAssinatura: 'pendente',
      },
      include: { cliente: true },
    })

    return NextResponse.json(contrato, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Create contrato error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar contrato' },
      { status: 500 }
    )
  }
}
