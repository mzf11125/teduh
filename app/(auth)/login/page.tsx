'use client'

import { Suspense } from 'react'
import LoginPage from './login-page'

export default function LoginSuspense() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Memuat...</div>}>
      <LoginPage />
    </Suspense>
  )
}
