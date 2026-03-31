'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { mockBookings, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/lib/bookings'
import { mockFacilities } from '@/lib/facilities'
import { format, isPast, isToday, isTomorrow } from 'date-fns'
import { id } from 'date-fns/locale'
import { Search, Filter, Eye, XCircle, CheckCircle } from 'lucide-react'
import type { BookingStatus } from '@/types'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(mockBookings)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const getFacilityName = (facilityId: string) => {
    const facility = mockFacilities.find(f => f.id === facilityId)
    return facility?.name || 'Unknown'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) return 'Hari ini'
    if (isTomorrow(date)) return 'Besok'
    return format(date, 'd MMM yyyy', { locale: id })
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getFacilityName(booking.facility_id).toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleView = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking)
    setShowDetailDialog(true)
  }

  const handleCancel = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking)
    setShowCancelDialog(true)
  }

  const confirmCancel = async () => {
    if (!selectedBooking) return

    setLoading(true)
    // Mock cancel - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setBookings(prev =>
      prev.map(b =>
        b.id === selectedBooking.id ? { ...b, status: 'cancelled' as BookingStatus } : b
      )
    )

    setShowCancelDialog(false)
    setSelectedBooking(null)
    setLoading(false)
  }

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Kelola Pesanan</h1>
        <p className="text-xl text-muted-foreground">
          Lihat dan kelola semua pesanan fasilitas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">{stats.confirmed}</p>
            <p className="text-muted-foreground">Terkonfirmasi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-500">{stats.completed}</p>
            <p className="text-muted-foreground">Selesai</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-destructive">{stats.cancelled}</p>
            <p className="text-muted-foreground">Dibatalkan</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan nama, ID, atau fasilitas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
                className="h-14 rounded-xl border-2 border-border bg-background px-4 text-base"
              >
                <option value="all">Semua Status</option>
                <option value="confirmed">Terkonfirmasi</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <span className="text-3xl">
                        {mockFacilities.find(f => f.id === booking.facility_id)?.type === 'pool' && '🏊'}
                        {mockFacilities.find(f => f.id === booking.facility_id)?.type === 'basketball' && '🏀'}
                        {mockFacilities.find(f => f.id === booking.facility_id)?.type === 'tennis' && '🎾'}
                        {mockFacilities.find(f => f.id === booking.facility_id)?.type === 'futsal' && '⚽'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold">{getFacilityName(booking.facility_id)}</h3>
                        <Badge variant={BOOKING_STATUS_COLORS[booking.status]}>
                          {BOOKING_STATUS_LABELS[booking.status]}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-base mb-1">
                        {booking.user.full_name} • Unit {booking.user.unit}
                      </p>
                      <p className="text-muted-foreground text-base">
                        {formatDate(booking.booking_date)} • {booking.time_slot.start_time} - {booking.time_slot.end_time}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">#{booking.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleView(booking)}
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                    {booking.status === 'confirmed' && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCancel(booking)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Tidak ada pesanan yang cocok dengan filter
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Detail Pesanan</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between pb-3 border-b">
                <span className="text-muted-foreground">ID Pesanan</span>
                <span className="font-bold">#{selectedBooking.id}</span>
              </div>
              <div className="flex justify-between pb-3 border-b">
                <span className="text-muted-foreground">Fasilitas</span>
                <span className="font-bold">{getFacilityName(selectedBooking.facility_id)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b">
                <span className="text-muted-foreground">Pemesan</span>
                <span className="font-bold">{selectedBooking.user.full_name}</span>
              </div>
              <div className="flex justify-between pb-3 border-b">
                <span className="text-muted-foreground">Unit</span>
                <span className="font-bold">{selectedBooking.user.unit}</span>
              </div>
              <div className="flex justify-between pb-3 border-b">
                <span className="text-muted-foreground">Telepon</span>
                <span className="font-bold">{selectedBooking.user.phone || '-'}</span>
              </div>
              <div className="flex justify-between pb-3 border-b">
                <span className="text-muted-foreground">Tanggal</span>
                <span className="font-bold">{formatDate(selectedBooking.booking_date)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b">
                <span className="text-muted-foreground">Jam</span>
                <span className="font-bold">
                  {selectedBooking.time_slot.start_time} - {selectedBooking.time_slot.end_time}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={BOOKING_STATUS_COLORS[selectedBooking.status]}>
                  {BOOKING_STATUS_LABELS[selectedBooking.status]}
                </Badge>
              </div>
              {selectedBooking.notes && (
                <div className="pt-2">
                  <p className="text-muted-foreground mb-1">Catatan</p>
                  <p className="font-medium">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowDetailDialog(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Batalkan Pesanan?</DialogTitle>
            <DialogDescription className="text-lg">
              Apakah Anda yakin ingin membatalkan pesanan &quot;{selectedBooking?.id}&quot;? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmCancel} disabled={loading}>
              {loading ? 'Memproses...' : 'Ya, Batalkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
