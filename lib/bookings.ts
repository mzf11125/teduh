import type { BookingWithDetails, BookingStatus } from '@/types'
import { getFacilityById } from './facilities'

// Mock bookings data - replace with database queries
export const mockBookings: BookingWithDetails[] = [
  {
    id: 'BK1234567890',
    user_id: 'user-1',
    facility_id: '1',
    booking_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time_slot_id: '1',
    status: 'confirmed',
    qr_code: 'BK1234567890',
    notes: null,
    created_at: new Date().toISOString(),
    facility: {
      id: '1',
      name: 'Kolam Renang Utama',
      type: 'pool',
      description: 'Kolam renang dengan ukuran 25 meter',
      capacity: 50,
      image_url: '/images/pool.jpg',
      rules: [],
      is_active: true,
      created_at: new Date().toISOString(),
    },
    time_slot: {
      id: '1',
      facility_id: '1',
      start_time: '07:00',
      end_time: '08:00',
      max_capacity: 1,
      is_active: true,
    },
    user: {
      id: 'user-1',
      full_name: 'Ahmad Wijaya',
      unit: 'A-123',
      phone: '081234567890',
      emergency_contact: 'Siti - 081234567891',
      role: 'resident',
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'BK0987654321',
    user_id: 'user-1',
    facility_id: '2',
    booking_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    time_slot_id: '2',
    status: 'completed',
    qr_code: 'BK0987654321',
    notes: 'Bawa bola sendiri',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    facility: {
      id: '2',
      name: 'Lapangan Basket',
      type: 'basketball',
      description: 'Lapangan basket standar',
      capacity: 10,
      image_url: '/images/basketball.jpg',
      rules: [],
      is_active: true,
      created_at: new Date().toISOString(),
    },
    time_slot: {
      id: '2',
      facility_id: '2',
      start_time: '16:00',
      end_time: '17:00',
      max_capacity: 1,
      is_active: true,
    },
    user: {
      id: 'user-1',
      full_name: 'Ahmad Wijaya',
      unit: 'A-123',
      phone: '081234567890',
      emergency_contact: 'Siti - 081234567891',
      role: 'resident',
      created_at: new Date().toISOString(),
    },
  },
]

export function getUserBookings(userId: string): BookingWithDetails[] {
  return mockBookings.filter(b => b.user_id === userId)
}

export function getBookingById(bookingId: string): BookingWithDetails | undefined {
  return mockBookings.find(b => b.id === bookingId)
}

export function getUpcomingBookings(userId: string): BookingWithDetails[] {
  const now = new Date()
  return mockBookings
    .filter(b => b.user_id === userId && b.status === 'confirmed' && new Date(b.booking_date) >= now)
    .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())
}

export function getPastBookings(userId: string): BookingWithDetails[] {
  const now = new Date()
  return mockBookings
    .filter(b => b.user_id === userId && (b.status === 'completed' || b.status === 'cancelled' || new Date(b.booking_date) < now))
    .sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: 'Terkonfirmasi',
  cancelled: 'Dibatalkan',
  completed: 'Selesai',
}

export const BOOKING_STATUS_COLORS: Record<BookingStatus, 'default' | 'success' | 'outline' | 'destructive'> = {
  confirmed: 'success',
  cancelled: 'destructive',
  completed: 'outline',
}
