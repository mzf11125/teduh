'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth'
import { mockBookings } from '@/lib/bookings'
import { format, isPast } from 'date-fns'
import { id } from 'date-fns/locale'
import { User, MapPin, Phone, UserCircle, LogOut, Edit3, Calendar, CheckCircle } from 'lucide-react'
import type { Profile } from '@/types'

export default function ProfilePage() {
  const { signOut } = useAuth()
  const [user, setUser] = useState<Profile | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Mock user data - replace with actual auth
  const [formData, setFormData] = useState({
    full_name: 'Ahmad Wijaya',
    unit: 'A-123',
    phone: '081234567890',
    emergency_contact: 'Siti - 081234567891',
  })

  useEffect(() => {
    // Mock user - replace with actual auth
    setUser({
      id: 'user-1',
      full_name: formData.full_name,
      unit: formData.unit,
      phone: formData.phone,
      emergency_contact: formData.emergency_contact,
      role: 'resident',
      created_at: new Date().toISOString(),
    })
  }, [])

  const upcomingBookings = mockBookings.filter(b => {
    const bookingDate = new Date(b.booking_date)
    return !isPast(bookingDate) && b.status === 'confirmed'
  }).slice(0, 3)

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Mock update - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setUser({
        ...user!,
        full_name: formData.full_name,
        unit: formData.unit,
        phone: formData.phone,
        emergency_contact: formData.emergency_contact,
      })

      setSuccess(true)
      setEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Gagal menyimpan profil. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      unit: user?.unit || '',
      phone: user?.phone || '',
      emergency_contact: user?.emergency_contact || '',
    })
    setEditing(false)
    setError('')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Profil Saya</h1>
        <p className="text-xl text-muted-foreground">
          Kelola informasi akun Anda
        </p>
      </div>

      {success && (
        <Alert variant="success" className="border-success/50 text-success">
          <CheckCircle className="w-5 h-5" />
          <AlertDescription>Profil berhasil diperbarui!</AlertDescription>
        </Alert>
      )}

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <UserCircle className="w-8 h-8" />
              Informasi Pribadi
            </CardTitle>
            {!editing && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setEditing(true)}
                className="gap-2"
              >
                <Edit3 className="w-5 h-5" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-center py-8">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-foreground">
                {user?.full_name.charAt(0) || 'U'}
              </span>
            </div>
          </div>

          {editing ? (
            <div className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="unit">Nomor Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="emergency_contact">Kontak Darurat</Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  placeholder="Nama - Nomor Telepon"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                  <p className="text-xl font-semibold">{user?.full_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nomor Unit</p>
                  <p className="text-xl font-semibold">{user?.unit}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nomor Telepon</p>
                  <p className="text-xl font-semibold">{user?.phone || 'Belum diisi'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kontak Darurat</p>
                  <p className="text-xl font-semibold">{user?.emergency_contact || 'Belum diisi'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Calendar className="w-8 h-8" />
            Pesanan Akan Datang
          </CardTitle>
        </CardHeader>

        <CardContent>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">
                      {booking.facility.type === 'pool' && '🏊'}
                      {booking.facility.type === 'basketball' && '🏀'}
                      {booking.facility.type === 'tennis' && '🎾'}
                      {booking.facility.type === 'futsal' && '⚽'}
                    </span>
                    <div>
                      <p className="font-bold text-lg">{booking.facility.name}</p>
                      <p className="text-muted-foreground">
                        {format(new Date(booking.booking_date), 'd MMMM yyyy', { locale: id })} • {booking.time_slot.start_time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/bookings'}>
                Lihat Semua Pesanan
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada pesanan yang akan datang
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card>
        <CardContent className="p-6">
          <Button
            variant="outline"
            className="w-full text-destructive border-destructive hover:bg-destructive/10 gap-2"
            onClick={() => signOut()}
          >
            <LogOut className="w-5 h-5" />
            Keluar dari Akun
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
