'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TimeSlotWithAvailability } from '@/types'

interface TimeSlotPickerProps {
  timeSlots: TimeSlotWithAvailability[]
  selectedSlot: string | null
  onSlotSelect: (slotId: string) => void
}

export function TimeSlotPicker({
  timeSlots,
  selectedSlot,
  onSlotSelect,
}: TimeSlotPickerProps) {
  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">
          Tidak ada slot waktu tersedia untuk tanggal ini.
        </p>
      </div>
    )
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const formattedHour = hour === 0 ? 24 : hour
    return `${formattedHour}:${minutes}`
  }

  const getSlotStatus = (slot: TimeSlotWithAvailability) => {
    if (!slot.available) return 'unavailable'
    if (slot.booked_count === 0) return 'available'
    return 'limited'
  }

  const getSlotStatusText = (slot: TimeSlotWithAvailability) => {
    const status = getSlotStatus(slot)
    if (status === 'unavailable') return 'Penuh'
    if (status === 'limited') {
      return `${slot.max_capacity - slot.booked_count} tersedia`
    }
    return 'Tersedia'
  }

  const getSlotStatusVariant = (slot: TimeSlotWithAvailability): 'default' | 'outline' | 'destructive' => {
    const status = getSlotStatus(slot)
    if (status === 'unavailable') return 'outline'
    if (status === 'limited') return 'default'
    return 'default'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Pilih Jam</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-success" />
            <span>Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-destructive/30 border border-destructive" />
            <span>Penuh</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {timeSlots.map((slot) => {
          const status = getSlotStatus(slot)
          const isAvailable = status !== 'unavailable'
          const isSelected = selectedSlot === slot.id

          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => isAvailable && onSlotSelect(slot.id)}
              disabled={!isAvailable}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all min-h-[80px]',
                'flex flex-col items-center justify-center gap-2',
                'active:scale-95',
                isSelected && 'border-primary bg-primary text-primary-foreground shadow-md',
                !isAvailable && 'opacity-50 cursor-not-allowed',
                isAvailable && !isSelected && 'border-border hover:border-primary/50 hover:bg-accent'
              )}
            >
              <span className="text-xl font-bold">
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </span>
              <Badge
                variant={isSelected ? 'secondary' : getSlotStatusVariant(slot)}
                className="text-xs"
              >
                {getSlotStatusText(slot)}
              </Badge>
            </button>
          )
        })}
      </div>
    </div>
  )
}
