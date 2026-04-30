'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const router = useRouter()

  // Não mostrar nav em páginas de auth
  if (pathname?.startsWith('/auth')) {
    return null
  }

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/')

  const menuItems = [
    { href: '/', label: '🏠 Dashboard', icon: '📊' },
    { href: '/clientes', label: '👥 Clientes', icon: '👥' },
    { href: '/cotacoes', label: '📈 Cotações', icon: '📈' },
    { href: '/propostas', label: '📄 Propostas', icon: '📄' },
    { href: '/contratos', label: '🤝 Contratos', icon: '🤝' },
    { href: '/boletos', label: '💰 Boletos', icon: '💰' },
  ]

  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
            🌾 MercoGrain
          </Link>

          {/* Menu */}
          <div className="hidden md:flex gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition font-medium text-sm ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User */}
          <div className="flex items-center gap-4">
            {session?.user && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
            )}
            <button
              onClick={() => signOut({ redirectTo: '/auth/login' })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-3 flex gap-1 overflow-x-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg transition text-sm font-medium whitespace-nowrap ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
