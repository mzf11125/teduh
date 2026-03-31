'use client'

import { useState } from 'react'
import { format, addDays, startOfDay, isSameDay, isToday } from 'date-fns'
import { id } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  minDays?: number
  maxDays?: number
}

export function BookingCalendar({
  selectedDate,
  onDateChange,
  minDays = 0,
  maxDays = 30,
}: BookingCalendarProps) {
  const [viewDate, setViewDate] = useState(selectedDate)

  // Generate dates to show (7 days at a time)
  const getVisibleDates = () => {
    const dates = []
    const startDate = startOfDay(viewDate)

    for (let i = 0; i < 7; i++) {
      dates.push(addDays(startDate, i))
    }

    return dates
  }

  const visibleDates = getVisibleDates()
  const today = new Date()

  const handlePrevWeek = () => {
    const newDate = addDays(viewDate, -7)
    if (addDays(today, minDays) <= newDate) {
      setViewDate(newDate)
    }
  }

  const handleNextWeek = () => {
    const newDate = addDays(viewDate, 7)
    const maxDate = addDays(today, maxDays)
    if (addDays(newDate, 6) <= maxDate) {
      setViewDate(newDate)
    }
  }

  const canGoBack = addDays(viewDate, -7) >= addDays(today, minDays)
  const canGoForward = addDays(viewDate, 7) <= addDays(today, maxDays - 6)

  const handleDateSelect = (date: Date) => {
    const minDate = addDays(today, minDays)
    const maxDate = addDays(today, maxDays)

    if (date >= minDate && date <= maxDate) {
      onDateChange(date)
    }
  }

  const getDayName = (date: Date) => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    return days[date.getDay()]
  }

  const getFullDayName = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    return days[date.getDay()]
  }

  const isDateSelectable = (date: Date) => {
    const minDate = addDays(today, minDays)
    const maxDate = addDays(today, maxDays)
    return date >= minDate && date <= maxDate
  }

  const selected = isSameDay(selectedDate, viewDate)
    ? selectedDate
    : visibleDates.find(d => isSameDay(d, selectedDate)) || selectedDate

  return (
    <div className="space-y-4">
      {/* Selected Date Display */}
      <div className="text-center">
        <p className="text-muted-foreground text-lg mb-1">Tanggal Terpilih</p>
        <p className="text-2xl font-bold">
          {getFullDayName(selectedDate)}, {format(selectedDate, 'd MMMM yyyy', { locale: id })}
        </p>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handlePrevWeek}
          disabled={!canGoBack}
          className="touch-target"
          aria-label="Minggu sebelumnya"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <span className="text-lg font-semibold">
          {format(visibleDates[0], 'MMMM yyyy', { locale: id })}
        </span>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleNextWeek}
          disabled={!canGoForward}
          className="touch-target"
          aria-label="Minggu selanjutnya"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-7 gap-2">
        {visibleDates.map((date) => {
          const selectable = isDateSelectable(date)
          const selected = isSameDay(date, selectedDate)

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => handleDateSelect(date)}
              disabled={!selectable}
              className={cn(
                'flex flex-col items-center p-4 rounded-xl transition-all min-h-[80px]',
                'hover:bg-accent active:scale-95',
                selected && 'bg-primary text-primary-foreground hover:bg-primary-light',
                !selectable && 'opacity-40 cursor-not-allowed hover:bg-transparent'
              )}
              aria-pressed={selected}
              aria-label={`${getFullDayName(date)} ${format(date, 'd MMMM yyyy')}`}
            >
              <span className="text-sm font-medium">{getDayName(date)}</span>
              <span className="text-2xl font-bold">{format(date, 'd')}</span>
              {isToday(date) && (
                <span className="text-xs">Hari ini</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
