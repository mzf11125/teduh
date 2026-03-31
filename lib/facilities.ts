import type { Facility } from '@/types'
import { FACILITY_TYPE_NAMES, FACILITY_ICONS } from '@/types'

// Re-export facility type constants for convenience
export { FACILITY_TYPE_NAMES, FACILITY_ICONS }

// Mock facilities data - replace with database queries
export const mockFacilities: Facility[] = [
  {
    id: '1',
    name: 'Kolam Renang Utama',
    type: 'pool',
    description: 'Kolam renang dengan ukuran 25 meter, dilengkapi dengan kolam anak dan area bersantai. Tersedia kursi loung dan payung.',
    capacity: 50,
    image_url: '/images/pool.jpg',
    rules: [
      'Wajib menggunakan pakaian renang yang sopan',
      'Anak-anak harus didampingi orang dewasa',
      'Dilarang membawa makanan dan minuman dari luar',
      'Wajib mandi sebelum masuk kolam',
      'Jam operasional: 06:00 - 21:00 WIB',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Lapangan Basket',
    type: 'basketball',
    description: 'Lapangan basket standar dengan lantai vinyl dan penerangan yang baik. Tersedia bola dan keranjang tambahan.',
    capacity: 10,
    image_url: '/images/basketball.jpg',
    rules: [
      'Wajib menggunakan sepatu olahraga non-marking',
      'Maksimal 10 orang per lapangan',
      'Dilarang membawa makanan dan minuman ke lapangan',
      'Jam operasional: 06:00 - 22:00 WIB',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Lapangan Tenis',
    type: 'tennis',
    description: 'Lapangan tenis hard court dengan permukaan berkualitas tinggi. Tersedia raket dan bola untuk sewa.',
    capacity: 4,
    image_url: '/images/tennis.jpg',
    rules: [
      'Wajib menggunakan sepatu tenis non-marking',
      'Maksimal 4 orang per lapangan',
      'Dilarang menggunakan pakaian yang tidak sopan',
      'Jam operasional: 06:00 - 21:00 WIB',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Lapangan Futsal',
    type: 'futsal',
    description: 'Lapangan futsal dengan rumput sintetis berkualitas. Tersedia bola dan rompi tim.',
    capacity: 12,
    image_url: '/images/futsal.jpg',
    rules: [
      'Wajib menggunakan sepatu futsal dengan sol datar',
      'Maksimal 12 orang (6 vs 6)',
      'Dilaranig membawa makanan dan minuman ke lapangan',
      'Jam operasional: 07:00 - 22:00 WIB',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

export function getFacilityImage(type: Facility['type']): string {
  const images: Record<Facility['type'], string> = {
    pool: '🏊',
    basketball: '🏀',
    tennis: '🎾',
    futsal: '⚽',
  }
  return images[type]
}

export function getFacilityName(type: Facility['type']): string {
  const names: Record<Facility['type'], string> = {
    pool: 'Kolam Renang',
    basketball: 'Lapangan Basket',
    tennis: 'Lapangan Tenis',
    futsal: 'Lapangan Futsal',
  }
  return names[type]
}

export function getFacilitiesByType(type: Facility['type']): Facility[] {
  return mockFacilities.filter((f) => f.type === type)
}

export function getFacilityById(id: string): Facility | undefined {
  return mockFacilities.find((f) => f.id === id)
}
