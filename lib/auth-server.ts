import { createServerSupabaseClient } from './supabase-server'
import { redirect } from 'next/navigation'
import type { Profile } from '@/types'

export async function getServerUser(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile as Profile | null
}

export async function requireAuth(): Promise<Profile> {
  const user = await getServerUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

export async function requireAdmin(): Promise<Profile> {
  const user = await requireAuth()

  if (user.role !== 'admin') {
    redirect('/')
  }

  return user
}
