'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    unit: '',
    phone: '',
    emergency_contact: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok')
      return
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter')
      return
    }

    setLoading(true)

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        unit: formData.unit,
        phone: formData.phone || undefined,
        emergency_contact: formData.emergency_contact || undefined,
      })
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mendaftar. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-primary-foreground">T</span>
          </div>
          <CardTitle className="text-3xl">Daftar Akun</CardTitle>
          <CardDescription className="text-lg">
            Daftar sebagai penghuni perumahan
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.full_name}
                onChange={handleChange}
                required
                autoComplete="name"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="unit">Nomor Unit</Label>
              <Input
                id="unit"
                name="unit"
                type="text"
                placeholder="Contoh: A-123"
                value={formData.unit}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Ulangi kata sandi"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone">Nomor Telepon (Opsional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="emergency_contact">Kontak Darurat (Opsional)</Label>
              <Input
                id="emergency_contact"
                name="emergency_contact"
                type="tel"
                placeholder="Nama - 08xxxxxxxxxx"
                value={formData.emergency_contact}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </Button>

            <p className="text-lg text-muted-foreground">
              Sudah punya akun?{' '}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Masuk
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
