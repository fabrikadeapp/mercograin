import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const signupSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { nome, email, senha } = signupSchema.parse(body)

    // Verificar se usuário já existe
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email já registrado' }, { status: 400 })
    }

    // Hash da senha
    const hashedPassword = await hash(senha, 10)

    // Criar usuário
    const user = await db.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
      },
    })

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso',
        user: { id: user.id, email: user.email, nome: user.nome },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 })
  }
}
