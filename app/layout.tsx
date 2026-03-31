import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Teduh - Fasilitas Perumahan',
  description: 'Aplikasi pemesanan fasilitas perumahan seperti kolam renang, lapangan basket, tenis, dan futsal.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Teduh',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#E65100',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <a href="#main-content" className="skip-to-content">
          Langsung ke konten utama
        </a>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main id="main-content" className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>
          <footer className="border-t border-border py-6 text-center text-muted-foreground no-print">
            <p className="text-lg">© 2026 Teduh - Fasilitas Perumahan</p>
          </footer>
          <PWAInstallPrompt />
        </div>
      </body>
    </html>
  )
}
