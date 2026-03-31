'use client'

import { createClient } from './supabase'
import type { Profile, LoginFormData, RegisterFormData } from '@/types'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const supabase = createClient()
  const router = useRouter()

  const signIn = async (data: LoginFormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      throw new Error(error.message)
    }

    router.push('/')
    router.refresh()
  }

  const signUp = async (data: RegisterFormData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          unit: data.unit,
          phone: data.phone || '',
          emergency_contact: data.emergency_contact || '',
        },
      },
    })

    if (authError) {
      throw new Error(authError.message)
    }

    if (authData.user) {
      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: data.full_name,
        unit: data.unit,
        phone: data.phone || null,
        emergency_contact: data.emergency_contact || null,
        role: 'resident',
      })

      if (profileError) {
        throw new Error(profileError.message)
      }
    }

    router.push('/')
    router.refresh()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile as Profile | null
  }

  return {
    signIn,
    signUp,
    signOut,
    getUser,
  }
}
