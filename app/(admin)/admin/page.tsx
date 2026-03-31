'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { mockFacilities } from '@/lib/facilities'
import { mockBookings } from '@/lib/bookings'
import { format, isToday, isTomorrow, startOfDay, endOfDay } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Calendar,
  Users,
  Building,
  TrendingUp,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalFacilities: mockFacilities.length,
    totalBookings: mockBookings.length,
    todayBookings: 0,
    upcomingBookings: 0,
    activeUsers: 0,
  })

  const [recentBookings, setRecentBookings] = useState(mockBookings.slice(0, 5))

  useEffect(() => {
    const today = new Date()
    const todayBookings = mockBookings.filter(b => {
      const bookingDate = new Date(b.booking_date)
      return isToday(bookingDate)
    })

    const upcomingBookings = mockBookings.filter(b => {
      const bookingDate = new Date(b.booking_date)
      return bookingDate >= startOfDay(today) && b.status === 'confirmed'
    })

    setStats({
      ...stats,
      todayBookings: todayBookings.length,
      upcomingBookings: upcomingBookings.length,
      activeUsers: new Set(mockBookings.map(b => b.user_id)).size,
    })
  }, [])

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard Admin</h1>
        <p className="text-xl text-muted-foreground">
          Selamat datang di panel admin Teduh
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Building className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Fasilitas</p>
                <p className="text-3xl font-bold">{stats.totalFacilities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Booking Hari Ini</p>
                <p className="text-3xl font-bold">{stats.todayBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Booking</p>
                <p className="text-3xl font-bold">{stats.totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pengguna Aktif</p>
                <p className="text-3xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/facilities">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Building className="w-6 h-6" />
                <span>Kelola Fasilitas</span>
              </Button>
            </Link>
            <Link href="/admin/bookings">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                <span>Kelola Pesanan</span>
              </Button>
            </Link>
            <Link href="/admin/residents">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Kelola Warga</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Pesanan Terbaru</CardTitle>
          <Link href="/admin/bookings">
            <Button variant="outline" size="lg" className="gap-2">
              Lihat Semua
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{getFacilityName(booking.facility_id)}</p>
                      <p className="text-muted-foreground">
                        {booking.user.full_name} • {formatDate(booking.booking_date)} • {booking.time_slot.start_time}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      booking.status === 'confirmed'
                        ? 'success'
                        : booking.status === 'cancelled'
                        ? 'destructive'
                        : 'outline'
                    }
                    className="text-base px-4 py-1"
                  >
                    {booking.status === 'confirmed' && 'Terkonfirmasi'}
                    {booking.status === 'cancelled' && 'Dibatalkan'}
                    {booking.status === 'completed' && 'Selesai'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada pesanan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Facility Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Status Fasilitas</CardTitle>
          <Link href="/admin/facilities">
            <Button variant="outline" size="lg" className="gap-2">
              Kelola
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockFacilities.map((facility) => (
              <div
                key={facility.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">
                    {facility.type === 'pool' && '🏊'}
                    {facility.type === 'basketball' && '🏀'}
                    {facility.type === 'tennis' && '🎾'}
                    {facility.type === 'futsal' && '⚽'}
                  </span>
                  <div>
                    <p className="font-bold text-lg">{facility.name}</p>
                    <p className="text-muted-foreground">Kapasitas: {facility.capacity} orang</p>
                  </div>
                </div>
                <Badge variant={facility.is_active ? 'success' : 'outline'} className="text-base px-4 py-1">
                  {facility.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
