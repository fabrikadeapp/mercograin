import { db } from '@/lib/db'
import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const clienteSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  tipo: z.enum(['comprador', 'vendedor']),
})

// GET - Listar clientes
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const clientes = await db.cliente.findMany({
      where: { usuarioId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(clientes)
  } catch (error) {
    console.error('Get clientes error:', error)
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 })
  }
}

// POST - Criar cliente
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const data = clienteSchema.parse(body)

    const cliente = await db.cliente.create({
      data: {
        ...data,
        usuarioId: session.user.id,
      },
    })

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Create cliente error:', error)
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }
}
