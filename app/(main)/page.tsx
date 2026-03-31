import { FacilityCard } from '@/components/facility-card'
import { mockFacilities } from '@/lib/facilities'

async function HomePage() {
  // Check authentication - redirect to login if not authenticated
  // Uncomment this when authentication is fully set up
  // const user = await requireAuth()

  const facilities = mockFacilities

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-3">Fasilitas Perumahan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Pesan fasilitas perumahan dengan mudah. Kolam renang, lapangan basket, tenis, dan futsal tersedia untuk Anda.
        </p>
      </section>

      {/* Facilities Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {facilities.map((facility) => (
          <FacilityCard key={facility.id} facility={facility} />
        ))}
      </section>
    </div>
  )
}

export default HomePage
