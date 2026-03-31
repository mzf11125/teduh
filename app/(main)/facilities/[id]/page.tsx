'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BookingCalendar } from '@/components/booking-calendar'
import { TimeSlotPicker } from '@/components/time-slot-picker'
import { getFacilityById, FACILITY_TYPE_NAMES, FACILITY_ICONS } from '@/lib/facilities'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Check, AlertCircle, Clock, Users, Info, Calendar } from 'lucide-react'
import type { TimeSlotWithAvailability } from '@/types'

export default function FacilityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const facilityId = params.id as string

  const facility = getFacilityById(facilityId)

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)

  // Mock time slots
  const [timeSlots, setTimeSlots] = useState<TimeSlotWithAvailability[]>([
    {
      id: '1',
      facility_id: facilityId,
      start_time: '06:00',
      end_time: '07:00',
      max_capacity: 1,
      is_active: true,
      available: true,
      booked_count: 0,
    },
    {
      id: '2',
      facility_id: facilityId,
      start_time: '07:00',
      end_time: '08:00',
      max_capacity: 1,
      is_active: true,
      available: true,
      booked_count: 0,
    },
    {
      id: '3',
      facility_id: facilityId,
      start_time: '08:00',
      end_time: '09:00',
      max_capacity: 1,
      is_active: true,
      available: true,
      booked_count: 1,
    },
    {
      id: '4',
      facility_id: facilityId,
      start_time: '09:00',
      end_time: '10:00',
      max_capacity: 1,
      is_active: true,
      available: true,
      booked_count: 0,
    },
    {
      id: '5',
      facility_id: facilityId,
      start_time: '10:00',
      end_time: '11:00',
      max_capacity: 1,
      is_active: true,
      available: false,
      booked_count: 1,
    },
    {
      id: '6',
      facility_id: facilityId,
      start_time: '16:00',
      end_time: '17:00',
      max_capacity: 1,
      is_active: true,
      available: true,
      booked_count: 0,
    },
    {
      id: '7',
      facility_id: facilityId,
      start_time: '17:00',
      end_time: '18:00',
      max_capacity: 1,
      is_active: true,
      available: true,
      booked_count: 0,
    },
    {
      id: '8',
      facility_id: facilityId,
      start_time: '18:00',
      end_time: '19:00',
      max_capacity: 1,
      is_active: true,
      available: true,
      booked_count: 0,
    },
  ])

  if (!facility) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Fasilitas tidak ditemukan</h1>
        <Button onClick={() => router.push('/')}>Kembali ke Beranda</Button>
      </div>
    )
  }

  const selectedTimeSlot = timeSlots.find(s => s.id === selectedSlot)

  const handleBooking = async () => {
    if (!selectedSlot || !selectedTimeSlot) return

    setLoading(true)
    setError('')

    try {
      // Mock booking - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generate mock booking ID
      const newBookingId = `BK${Date.now()}`
      setBookingId(newBookingId)
      setSuccess(true)
      setShowConfirmDialog(false)

      // Reset form
      setSelectedSlot(null)
      setNotes('')
    } catch (err) {
      setError('Gagal membuat pesanan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const openConfirmDialog = () => {
    if (!selectedSlot || !selectedTimeSlot) return
    setShowConfirmDialog(true)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/')}
        className="gap-2"
      >
        ← Kembali
      </Button>

      {/* Facility Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge className="mb-3 text-base px-4 py-1" variant="secondary">
              {FACILITY_TYPE_NAMES[facility.type]}
            </Badge>
            <h1 className="text-4xl font-bold mb-2">{facility.name}</h1>
          </div>
          <span className="text-7xl">{FACILITY_ICONS[facility.type]}</span>
        </div>

        <p className="text-xl text-muted-foreground">{facility.description}</p>
      </div>

      {/* Facility Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kapasitas</p>
              <p className="text-xl font-bold">{facility.capacity} orang</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jam Operasional</p>
              <p className="text-xl font-bold">06:00 - 22:00</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Durasi</p>
              <p className="text-xl font-bold">1 jam</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-6 h-6" />
            Peraturan Fasilitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {facility.rules?.map((rule, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-primary font-bold">{index + 1}.</span>
                <span className="text-lg">{rule}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Booking Section */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Buat Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-5 h-5" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && bookingId && (
            <Alert variant="success" className="border-success/50 text-success">
              <Check className="w-5 h-5" />
              <AlertDescription>
                <p className="font-bold text-lg">Pesanan berhasil dibuat!</p>
                <p className="text-base">Nomor pesanan: {bookingId}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => router.push(`/bookings/${bookingId}`)}
                >
                  Lihat Tiket QR
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Calendar */}
          <div>
            <Label className="text-xl font-semibold mb-4 block">Pilih Tanggal</Label>
            <BookingCalendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              minDays={0}
              maxDays={30}
            />
          </div>

          {/* Time Slots */}
          <div>
            <TimeSlotPicker
              timeSlots={timeSlots}
              selectedSlot={selectedSlot}
              onSlotSelect={setSelectedSlot}
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-xl font-semibold mb-4 block">
              Catatan (Opsional)
            </Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk pesanan Anda..."
              className="w-full min-h-[120px] rounded-xl border-2 border-border bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Book Button */}
          <Button
            size="lg"
            className="w-full text-xl"
            disabled={!selectedSlot || loading}
            onClick={openConfirmDialog}
          >
            {loading ? 'Memproses...' : 'Konfirmasi Pesanan'}
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Konfirmasi Pesanan</DialogTitle>
            <DialogDescription className="text-lg">
              Mohon periksa kembali detail pesanan Anda
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">Fasilitas</span>
              <span className="font-bold text-lg">{facility.name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">Tanggal</span>
              <span className="font-bold text-lg">
                {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id })}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">Jam</span>
              <span className="font-bold text-lg">
                {selectedTimeSlot?.start_time} - {selectedTimeSlot?.end_time}
              </span>
            </div>
            {notes && (
              <div className="flex justify-between items-start pb-3 border-b">
                <span className="text-muted-foreground">Catatan</span>
                <span className="font-bold text-lg max-w-[60%] text-right">{notes}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button onClick={handleBooking} disabled={loading}>
              {loading ? 'Memproses...' : 'Ya, Konfirmasi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
