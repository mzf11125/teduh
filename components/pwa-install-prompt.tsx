'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, X } from 'lucide-react'

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
    if (isInstalled) return

    // Show iOS prompt after delay
    if (isIOSDevice) {
      const hasShownPrompt = localStorage.getItem('ios-prompt-shown')
      if (!hasShownPrompt) {
        const timer = setTimeout(() => {
          setShowPrompt(true)
        }, 5000)
        return () => clearTimeout(timer)
      }
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      const hasShownPrompt = localStorage.getItem('pwa-prompt-shown')
      if (!hasShownPrompt) {
        const timer = setTimeout(() => {
          setShowPrompt(true)
        }, 3000)
        return () => clearTimeout(timer)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      localStorage.setItem('pwa-prompt-shown', 'true')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem(isIOS ? 'ios-prompt-shown' : 'pwa-prompt-shown', 'true')
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom">
      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-primary-foreground">T</span>
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Install Aplikasi Teduh</h3>
              <p className="text-muted-foreground text-base mb-3">
                {isIOS ? (
                  <>
                    Tap tombol <strong>Share</strong> di browser, lalu pilih <strong>Add to Home Screen</strong>.
                  </>
                ) : (
                  'Install aplikasi untuk akses lebih cepat dan pengalaman terbaik.'
                )}
              </p>

              <div className="flex gap-2">
                {!isIOS && (
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Install
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDismiss}
                >
                  {isIOS ? 'Mengerti' : 'Nanti'}
                </Button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
