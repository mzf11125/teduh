import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Facility, FACILITY_ICONS, FACILITY_TYPE_NAMES } from '@/types'
import { Clock, Users, ChevronRight } from 'lucide-react'

interface FacilityCardProps {
  facility: Facility
}

export function FacilityCard({ facility }: FacilityCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image / Icon */}
      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
        <span className="text-8xl">{FACILITY_ICONS[facility.type]}</span>
        <Badge className="absolute top-4 left-4 text-base px-4 py-1" variant="secondary">
          {FACILITY_TYPE_NAMES[facility.type]}
        </Badge>
      </div>

      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-2">{facility.name}</h3>
        <p className="text-muted-foreground text-lg mb-4 line-clamp-2">
          {facility.description}
        </p>

        <div className="flex items-center gap-4 text-muted-foreground">
          {facility.capacity && (
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-base">Kapasitas {facility.capacity}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/facilities/${facility.id}`} className="w-full">
          <Button className="w-full" size="lg">
            Pesan Sekarang
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
