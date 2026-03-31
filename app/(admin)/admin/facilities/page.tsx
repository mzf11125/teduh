'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { mockFacilities, FACILITY_TYPE_NAMES, FACILITY_ICONS } from '@/lib/facilities'
import { Plus, Edit, Trash2, ToggleRight, ToggleLeft } from 'lucide-react'
import type { Facility, FacilityType } from '@/types'

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState(mockFacilities)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    type: 'pool' as FacilityType,
    description: '',
    capacity: '',
    rules: '',
  })

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'pool',
      description: '',
      capacity: '',
      rules: '',
    })
  }

  const handleAdd = () => {
    resetForm()
    setShowAddDialog(true)
  }

  const handleEdit = (facility: Facility) => {
    setSelectedFacility(facility)
    setFormData({
      name: facility.name,
      type: facility.type,
      description: facility.description || '',
      capacity: facility.capacity?.toString() || '',
      rules: facility.rules?.join('\n') || '',
    })
    setShowEditDialog(true)
  }

  const handleDelete = (facility: Facility) => {
    setSelectedFacility(facility)
    setShowDeleteDialog(true)
  }

  const handleToggleActive = (facility: Facility) => {
    setFacilities(prev =>
      prev.map(f =>
        f.id === facility.id ? { ...f, is_active: !f.is_active } : f
      )
    )
  }

  const handleSubmitAdd = async () => {
    setLoading(true)
    // Mock add - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newFacility: Facility = {
      id: `f${Date.now()}`,
      name: formData.name,
      type: formData.type,
      description: formData.description,
      capacity: parseInt(formData.capacity) || null,
      rules: formData.rules.split('\n').filter(r => r.trim()),
      is_active: true,
      created_at: new Date().toISOString(),
      image_url: null,
    }

    setFacilities([...facilities, newFacility])
    setShowAddDialog(false)
    resetForm()
    setLoading(false)
  }

  const handleSubmitEdit = async () => {
    if (!selectedFacility) return

    setLoading(true)
    // Mock edit - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setFacilities(prev =>
      prev.map(f =>
        f.id === selectedFacility.id
          ? {
              ...f,
              name: formData.name,
              type: formData.type,
              description: formData.description,
              capacity: parseInt(formData.capacity) || null,
              rules: formData.rules.split('\n').filter(r => r.trim()),
            }
          : f
      )
    )

    setShowEditDialog(false)
    setSelectedFacility(null)
    resetForm()
    setLoading(false)
  }

  const handleSubmitDelete = async () => {
    if (!selectedFacility) return

    setLoading(true)
    // Mock delete - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setFacilities(prev => prev.filter(f => f.id !== selectedFacility.id))
    setShowDeleteDialog(false)
    setSelectedFacility(null)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Kelola Fasilitas</h1>
          <p className="text-xl text-muted-foreground">
            Tambah, edit, atau nonaktifkan fasilitas perumahan
          </p>
        </div>
        <Button size="lg" onClick={handleAdd} className="gap-2">
          <Plus className="w-5 h-5" />
          Tambah Fasilitas
        </Button>
      </div>

      {/* Facilities List */}
      <div className="space-y-4">
        {facilities.map((facility) => (
          <Card key={facility.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <span className="text-5xl">{FACILITY_ICONS[facility.type]}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{facility.name}</h3>
                      <Badge variant={facility.is_active ? 'success' : 'outline'}>
                        {facility.is_active ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-lg mb-2">
                      {FACILITY_TYPE_NAMES[facility.type]} • Kapasitas {facility.capacity} orang
                    </p>
                    <p className="text-base max-w-2xl">{facility.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleActive(facility)}
                    title={facility.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    {facility.is_active ? (
                      <ToggleRight className="w-6 h-6 text-success" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(facility)}
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(facility)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tambah Fasilitas Baru</DialogTitle>
            <DialogDescription className="text-lg">
              Isi detail fasilitas yang ingin ditambahkan
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-3">
              <Label htmlFor="name">Nama Fasilitas</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Kolam Renang Utama"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="type">Tipe Fasilitas</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as FacilityType })}
                className="flex h-14 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
              >
                <option value="pool">Kolam Renang</option>
                <option value="basketball">Lapangan Basket</option>
                <option value="tennis">Lapangan Tenis</option>
                <option value="futsal">Lapangan Futsal</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="capacity">Kapasitas</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="Jumlah orang"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi fasilitas..."
                className="w-full min-h-[100px] rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="rules">Peraturan (satu peraturan per baris)</Label>
              <textarea
                id="rules"
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                placeholder="Peraturan 1&#10;Peraturan 2&#10;Peraturan 3"
                className="w-full min-h-[120px] rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmitAdd} disabled={loading || !formData.name}>
              {loading ? 'Menyimpan...' : 'Tambah'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Fasilitas</DialogTitle>
            <DialogDescription className="text-lg">
              Ubah detail fasilitas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-3">
              <Label htmlFor="edit-name">Nama Fasilitas</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-type">Tipe Fasilitas</Label>
              <select
                id="edit-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as FacilityType })}
                className="flex h-14 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
              >
                <option value="pool">Kolam Renang</option>
                <option value="basketball">Lapangan Basket</option>
                <option value="tennis">Lapangan Tenis</option>
                <option value="futsal">Lapangan Futsal</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-capacity">Kapasitas</Label>
              <Input
                id="edit-capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-description">Deskripsi</Label>
              <textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[100px] rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-rules">Peraturan (satu peraturan per baris)</Label>
              <textarea
                id="edit-rules"
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                className="w-full min-h-[120px] rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmitEdit} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Hapus Fasilitas?</DialogTitle>
            <DialogDescription className="text-lg">
              Apakah Anda yakin ingin menghapus &quot;{selectedFacility?.name}&quot;? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleSubmitDelete} disabled={loading}>
              {loading ? 'Menghapus...' : 'Ya, Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
