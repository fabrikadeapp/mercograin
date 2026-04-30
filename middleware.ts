import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
}

export default auth((req) => {
  const isLoggedIn = !!req.auth

  // Redirecionar usuários não autenticados para login
  if (!isLoggedIn && !req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Redirecionar usuários autenticados do /auth para /clientes
  if (isLoggedIn && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/clientes', req.url))
  }

  return NextResponse.next()
})
