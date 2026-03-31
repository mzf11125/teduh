// Database types matching Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      facilities: {
        Row: Facility
        Insert: FacilityInsert
        Update: FacilityUpdate
      }
      operating_hours: {
        Row: OperatingHours
        Insert: OperatingHoursInsert
        Update: OperatingHoursUpdate
      }
      time_slots: {
        Row: TimeSlot
        Insert: TimeSlotInsert
        Update: TimeSlotUpdate
      }
      bookings: {
        Row: Booking
        Insert: BookingInsert
        Update: BookingUpdate
      }
    }
  }
}

// Profile types
export type Profile = {
  id: string
  full_name: string
  unit: string
  phone: string | null
  emergency_contact: string | null
  role: 'resident' | 'admin'
  created_at: string
}

export type ProfileInsert = {
  id?: string
  full_name: string
  unit: string
  phone?: string | null
  emergency_contact?: string | null
  role?: 'resident' | 'admin'
  created_at?: string
}

export type ProfileUpdate = {
  id?: string
  full_name?: string
  unit?: string
  phone?: string | null
  emergency_contact?: string | null
  role?: 'resident' | 'admin'
}

// Facility types
export type FacilityType = 'pool' | 'basketball' | 'tennis' | 'futsal'

export type Facility = {
  id: string
  name: string
  type: FacilityType
  description: string | null
  capacity: number | null
  image_url: string | null
  rules: string[] | null
  is_active: boolean
  created_at: string
}

export type FacilityInsert = {
  id?: string
  name: string
  type: FacilityType
  description?: string | null
  capacity?: number | null
  image_url?: string | null
  rules?: string[] | null
  is_active?: boolean
  created_at?: string
}

export type FacilityUpdate = {
  name?: string
  type?: FacilityType
  description?: string | null
  capacity?: number | null
  image_url?: string | null
  rules?: string[] | null
  is_active?: boolean
}

// Operating Hours types
export type OperatingHours = {
  id: string
  facility_id: string
  day_of_week: number // 0-6 (Sunday-Saturday)
  open_time: string // HH:mm format
  close_time: string // HH:mm format
}

export type OperatingHoursInsert = {
  id?: string
  facility_id: string
  day_of_week: number
  open_time: string
  close_time: string
}

export type OperatingHoursUpdate = {
  facility_id?: string
  day_of_week?: number
  open_time?: string
  close_time?: string
}

// Time Slot types
export type TimeSlot = {
  id: string
  facility_id: string
  start_time: string // HH:mm format
  end_time: string // HH:mm format
  max_capacity: number
  is_active: boolean
}

export type TimeSlotInsert = {
  id?: string
  facility_id: string
  start_time: string
  end_time: string
  max_capacity?: number
  is_active?: boolean
}

export type TimeSlotUpdate = {
  facility_id?: string
  start_time?: string
  end_time?: string
  max_capacity?: number
  is_active?: boolean
}

// Booking types
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed'

export type Booking = {
  id: string
  user_id: string
  facility_id: string
  booking_date: string // YYYY-MM-DD format
  time_slot_id: string
  status: BookingStatus
  qr_code: string | null
  notes: string | null
  created_at: string
}

export type BookingInsert = {
  id?: string
  user_id: string
  facility_id: string
  booking_date: string
  time_slot_id: string
  status?: BookingStatus
  qr_code?: string | null
  notes?: string | null
  created_at?: string
}

export type BookingUpdate = {
  user_id?: string
  facility_id?: string
  booking_date?: string
  time_slot_id?: string
  status?: BookingStatus
  qr_code?: string | null
  notes?: string | null
}

// Extended types with relations
export type BookingWithDetails = Booking & {
  facility: Facility
  time_slot: TimeSlot
  user: Profile
}

export type FacilityWithSlots = Facility & {
  time_slots: TimeSlot[]
  operating_hours: OperatingHours[]
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  full_name: string
  unit: string
  phone?: string
  emergency_contact?: string
}

export interface BookingFormData {
  facility_id: string
  date: Date
  time_slot_id: string
  notes?: string
}

// UI State types
export interface TimeSlotWithAvailability extends TimeSlot {
  available: boolean
  booked_count: number
}

export interface FacilityCardProps {
  facility: Facility
  availableToday?: boolean
}

// Navigation items
export interface NavItem {
  href: string
  label: string
  icon?: any
  requireAuth?: boolean
  requireAdmin?: boolean
}

// Day names in Indonesian
export const DAY_NAMES = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
] as const

export const FACILITY_TYPE_NAMES: Record<FacilityType, string> = {
  pool: 'Kolam Renang',
  basketball: 'Lapangan Basket',
  tennis: 'Lapangan Tenis',
  futsal: 'Lapangan Futsal',
}

export const FACILITY_ICONS: Record<FacilityType, string> = {
  pool: '🏊',
  basketball: '🏀',
  tennis: '🎾',
  futsal: '⚽',
}
