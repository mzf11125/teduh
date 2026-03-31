'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Share2, Calendar, Clock, MapPin } from 'lucide-react'
import type { BookingWithDetails } from '@/types'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface QRTicketProps {
  booking: BookingWithDetails
}

export function QRTicket({ booking }: QRTicketProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrImageUrl, setQrImageUrl] = useState<string>('')
  const ticketRef = useRef<HTMLDivElement>(null)

  // Generate QR code using canvas
  useEffect(() => {
    const generateQR = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Simple QR code visualization (replace with proper QR library)
      const size = 200
      canvas.width = size
      canvas.height = size

      // Draw background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, size, size)

      // Draw QR-like pattern
      ctx.fillStyle = '#000000'
      const cellSize = size / 25

      // Draw corner squares
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if ((i < 2 || i > 4) && (j < 2 || j > 4)) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
          }
        }
      }

      // Draw random pattern based on booking ID
      const seed = booking.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      for (let i = 8; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          const shouldFill = ((seed * (i + 1) * (j + 1)) % 3) === 0
          if (shouldFill) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
          }
        }
      }

      // Bottom right corner square
      for (let i = 18; i < 25; i++) {
        for (let j = 18; j < 25; j++) {
          if ((i < 19 || i > 23) && (j < 19 || j > 23)) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
          }
        }
      }

      setQrImageUrl(canvas.toDataURL())
    }

    generateQR()
  }, [booking.id])

  const handleDownload = () => {
    const ticket = ticketRef.current
    if (!ticket) return

    // Create a simple download of the QR code
    const link = document.createElement('a')
    link.download = `tiket-${booking.id}.png`
    link.href = qrImageUrl
    link.click()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tiket Pesanan Teduh',
          text: `Pesanan ${booking.facility.name} pada ${format(new Date(booking.booking_date), 'd MMMM yyyy', { locale: id })} jam ${booking.time_slot.start_time}`,
        })
      } catch (err) {
        console.log('Share canceled')
      }
    }
  }

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />

      <div ref={ticketRef} className="bg-white rounded-3xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary-foreground rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">T</span>
            </div>
            <span className="text-3xl font-bold">Teduh</span>
          </div>
          <p className="text-lg opacity-90">Tiket Pesanan Fasilitas</p>
        </div>

        {/* QR Code */}
        <div className="p-8 flex justify-center bg-gradient-to-b from-primary/5 to-transparent">
          <div className="bg-white p-4 rounded-2xl shadow-inner border-4 border-primary/20">
            {qrImageUrl && (
              <img
                src={qrImageUrl}
                alt="QR Code"
                className="w-48 h-48"
              />
            )}
          </div>
        </div>

        {/* Booking Details */}
        <CardContent className="space-y-4 pb-8">
          <div className="text-center pb-4 border-b border-dashed">
            <p className="text-sm text-muted-foreground">Nomor Pesanan</p>
            <p className="text-2xl font-bold tracking-wider">{booking.id}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fasilitas</p>
                <p className="text-lg font-bold">{booking.facility.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal</p>
                <p className="text-lg font-bold">
                  {format(new Date(booking.booking_date), 'EEEE, d MMMM yyyy', { locale: id })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jam</p>
                <p className="text-lg font-bold">
                  {booking.time_slot.start_time} - {booking.time_slot.end_time}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t text-center">
            <Badge
              variant={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'destructive' : 'outline'}
              className="text-base px-6 py-2"
            >
              {booking.status === 'confirmed' ? 'Terkonfirmasi' : booking.status === 'cancelled' ? 'Dibatalkan' : 'Selesai'}
            </Badge>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="bg-muted/30 px-6 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Tunjukkan QR code ini kepada petugas saat check-in
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 no-print">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleDownload}
        >
          <Download className="w-5 h-5" />
          Unduh
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleShare}
        >
          <Share2 className="w-5 h-5" />
          Bagikan
        </Button>
      </div>
    </>
  )
}
