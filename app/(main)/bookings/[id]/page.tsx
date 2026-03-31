'use client'

import { useParams, useRouter } from 'next/navigation'
import { getBookingById } from '@/lib/bookings'
import { QRTicket } from '@/components/qr-ticket'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const booking = getBookingById(bookingId)

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Pesanan tidak ditemukan</h1>
        <Button onClick={() => router.push('/bookings')}>Kembali ke Pesanan</Button>
      </div>
    )
  }

  const handleCancel = async () => {
    setCancelling(true)
    // Mock cancellation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setCancelled(true)
    setCancelling(false)
    setShowCancelDialog(false)
  }

  const canCancel = booking.status === 'confirmed'

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/bookings')}
        className="gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Pesanan Saya
      </Button>

      <div>
        <h1 className="text-3xl font-bold mb-2">Detail Pesanan</h1>
        <p className="text-lg text-muted-foreground">
          Tiket pesanan fasilitas Anda
        </p>
      </div>

      {cancelled && (
        <Alert variant="destructive">
          <AlertTriangle className="w-5 h-5" />
          <AlertDescription>
            Pesanan Anda telah dibatalkan.
          </AlertDescription>
        </Alert>
      )}

      <QRTicket booking={{ ...booking, status: cancelled ? 'cancelled' : booking.status }} />

      {/* Cancel Button */}
      {canCancel && !cancelled && (
        <div className="text-center">
          <Button
            variant="outline"
            className="text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => setShowCancelDialog(true)}
          >
            Batalkan Pesanan
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Pembatalan dapat dilakukan hingga 2 jam sebelum jadwal
          </p>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Batalkan Pesanan?</DialogTitle>
            <DialogDescription className="text-lg">
              Tindakan ini tidak dapat dibatalkan. Pesanan Anda akan dibatalkan dan slot waktu akan tersedia kembali untuk orang lain.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={cancelling}
            >
              Tidak, Kembali
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Memproses...' : 'Ya, Batalkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
