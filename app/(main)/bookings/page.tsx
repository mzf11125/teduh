'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { QRTicket } from '@/components/qr-ticket'
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS, getUserBookings } from '@/lib/bookings'
import { mockBookings } from '@/lib/bookings'
import { format, isPast, isToday, isTomorrow } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ChevronRight, Ticket } from 'lucide-react'
import type { BookingWithDetails } from '@/types'

export default function BookingsPage() {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming')

  // Mock user ID - replace with actual auth
  const userId = 'user-1'
  const bookings = mockBookings

  const upcomingBookings = bookings.filter(b => {
    const bookingDate = new Date(b.booking_date)
    return !isPast(bookingDate) && b.status === 'confirmed'
  }).sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())

  const pastBookings = bookings.filter(b => {
    const bookingDate = new Date(b.booking_date)
    return isPast(bookingDate) || b.status !== 'confirmed'
  }).sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) return 'Hari ini'
    if (isTomorrow(date)) return 'Besok'
    return format(date, 'd MMMM yyyy', { locale: id })
  }

  const renderBookingCard = (booking: BookingWithDetails) => (
    <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">
                {booking.facility.type === 'pool' && '🏊'}
                {booking.facility.type === 'basketball' && '🏀'}
                {booking.facility.type === 'tennis' && '🎾'}
                {booking.facility.type === 'futsal' && '⚽'}
              </div>
              <div>
                <h3 className="text-xl font-bold">{booking.facility.name}</h3>
                <p className="text-muted-foreground">#{booking.id}</p>
              </div>
            </div>
            <Badge
              variant={BOOKING_STATUS_COLORS[booking.status]}
              className="text-base px-4 py-1"
            >
              {BOOKING_STATUS_LABELS[booking.status]}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-5 h-5" />
              <span className="text-base">{formatDate(booking.booking_date)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span className="text-base">
                {booking.time_slot.start_time} - {booking.time_slot.end_time}
              </span>
            </div>
          </div>

          <Link href={`/bookings/${booking.id}`}>
            <Button variant="outline" className="w-full gap-2">
              <Ticket className="w-5 h-5" />
              Lihat Tiket
              <ChevronRight className="w-5 h-5 ml-auto" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Pesanan Saya</h1>
        <p className="text-xl text-muted-foreground">
          Kelola dan lihat semua pesanan fasilitas Anda
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setSelectedTab('upcoming')}
          className={`px-6 py-3 text-lg font-semibold border-b-2 transition-colors ${
            selectedTab === 'upcoming'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Akan Datang ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setSelectedTab('past')}
          className={`px-6 py-3 text-lg font-semibold border-b-2 transition-colors ${
            selectedTab === 'past'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Riwayat ({pastBookings.length})
        </button>
      </div>

      {/* Booking Lists */}
      <div className="space-y-4">
        {selectedTab === 'upcoming' ? (
          upcomingBookings.length > 0 ? (
            upcomingBookings.map(renderBookingCard)
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-xl text-muted-foreground">
                  Anda belum memiliki pesanan yang akan datang
                </p>
                <Link href="/" className="inline-block mt-4">
                  <Button>Pesan Sekarang</Button>
                </Link>
              </CardContent>
            </Card>
          )
        ) : pastBookings.length > 0 ? (
          pastBookings.map(renderBookingCard)
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-xl text-muted-foreground">
                Belum ada riwayat pesanan
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
