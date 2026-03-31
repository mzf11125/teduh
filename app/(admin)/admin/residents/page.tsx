'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, User, Mail, Phone, MapPin, Shield } from 'lucide-react'

// Mock residents data
const mockResidents = [
  {
    id: 'user-1',
    full_name: 'Ahmad Wijaya',
    email: 'ahmad.wijaya@email.com',
    unit: 'A-123',
    phone: '081234567890',
    emergency_contact: 'Siti - 081234567891',
    role: 'resident' as const,
    created_at: '2024-01-15',
    booking_count: 5,
  },
  {
    id: 'user-2',
    full_name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    unit: 'B-456',
    phone: '081234567892',
    emergency_contact: 'Dewi - 081234567893',
    role: 'resident' as const,
    created_at: '2024-02-20',
    booking_count: 12,
  },
  {
    id: 'user-3',
    full_name: 'Citra Lestari',
    email: 'citra.lestari@email.com',
    unit: 'C-789',
    phone: '081234567894',
    emergency_contact: 'Agus - 081234567895',
    role: 'resident' as const,
    created_at: '2024-03-10',
    booking_count: 3,
  },
  {
    id: 'admin-1',
    full_name: 'Admin Utama',
    email: 'admin@teduh.app',
    unit: 'Kantor',
    phone: '081234567899',
    emergency_contact: null,
    role: 'admin' as const,
    created_at: '2024-01-01',
    booking_count: 0,
  },
]

export default function AdminResidentsPage() {
  const [residents] = useState(mockResidents)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredResidents = residents.filter(resident =>
    resident.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: residents.length,
    residents: residents.filter(r => r.role === 'resident').length,
    admins: residents.filter(r => r.role === 'admin').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Kelola Warga</h1>
        <p className="text-xl text-muted-foreground">
          Lihat daftar warga terdaftar di perumahan
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Warga</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warga</p>
                <p className="text-3xl font-bold">{stats.residents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admin</p>
                <p className="text-3xl font-bold">{stats.admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama, unit, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14"
            />
          </div>
        </CardContent>
      </Card>

      {/* Residents List */}
      <div className="space-y-4">
        {filteredResidents.length > 0 ? (
          filteredResidents.map((resident) => (
            <Card key={resident.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">
                        {resident.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold">{resident.full_name}</h3>
                        <Badge variant={resident.role === 'admin' ? 'default' : 'secondary'}>
                          {resident.role === 'admin' ? 'Admin' : 'Warga'}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="text-base">Unit {resident.unit}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span className="text-base">{resident.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span className="text-base">{resident.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Pesanan</p>
                    <p className="text-2xl font-bold">{resident.booking_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Tidak ada warga yang cocok dengan pencarian
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
