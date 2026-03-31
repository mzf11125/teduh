'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/bookings', label: 'Pesanan Saya', icon: Calendar },
  { href: '/profile', label: 'Profil', icon: User },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdmin = pathname.startsWith('/admin')

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <nav className="container mx-auto px-4" aria-label="Navigasi utama">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 touch-target rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">T</span>
            </div>
            <span className="text-2xl font-bold text-primary">Teduh</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    touch-target gap-2 px-6 py-3 rounded-xl font-semibold text-lg
                    flex items-center transition-all
                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'hover:bg-accent hover:text-primary'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className={`touch-target gap-2 px-6 py-3 rounded-xl font-semibold text-lg flex items-center transition-all ${
                  pathname === '/admin' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden touch-target p-3 rounded-xl hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-8 h-8" aria-hidden="true" />
            ) : (
              <Menu className="w-8 h-8" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden py-4 border-t border-border"
            role="menu"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      touch-target gap-3 px-6 py-4 rounded-xl font-semibold text-lg
                      flex items-center transition-all
                      ${isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-accent'
                      }
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                    role="menuitem"
                  >
                    <Icon className="w-7 h-7" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="touch-target gap-3 px-6 py-4 rounded-xl font-semibold text-lg flex items-center hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
