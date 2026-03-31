import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client (for client components)
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Types for our database
export type Tables = {
  profiles: any
  facilities: any
  operating_hours: any
  time_slots: any
  bookings: any
}
