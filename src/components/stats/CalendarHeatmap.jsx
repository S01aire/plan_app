import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { getDaysInMonth, getFirstWeekdayOfMonth, formatShortDate, getTodayStr } from '../../utils/dateUtils'

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']

export function CalendarHeatmap({ planId }) {
  const { state } = useAppStore()
  const today = getTodayStr()
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() + 1 }
  })

  const { year, month } = viewDate
  const days = getDaysInMonth(year, month)
  const firstWeekday = getFirstWeekdayOfMonth(year, month)

  const checkedDates = new Set(
    state.checkIns
      .filter(c => !planId || c.planId === planId)
      .map(c => c.date)
  )

  function prevMonth() {
    setViewDate(v => {
      if (v.month === 1) return { year: v.year - 1, month: 12 }
      return { ...v, month: v.month - 1 }
    })
  }

  function nextMonth() {
    const now = new Date()
    setViewDate(v => {
      if (v.year === now.getFullYear() && v.month === now.getMonth() + 1) return v
      if (v.month === 12) return { year: v.year + 1, month: 1 }
      return { ...v, month: v.month + 1 }
    })
  }

  const plan = planId ? state.plans.find(p => p.id === planId) : null
  const accentColor = plan?.colorTag || '#FF8C42'

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-warm-100 text-text-secondary cursor-pointer border-none bg-transparent text-lg">
          ‹
        </button>
        <span className="text-sm font-semibold text-text-primary">
          {year}年{month}月
        </span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-warm-100 text-text-secondary cursor-pointer border-none bg-transparent text-lg">
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map(l => (
          <div key={l} className="text-center text-xs text-text-light py-1">{l}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstWeekday }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map(dateStr => {
          const done = checkedDates.has(dateStr)
          const isToday = dateStr === today
          const isFuture = dateStr > today

          return (
            <div
              key={dateStr}
              title={`${formatShortDate(dateStr)}${done ? ' ✓' : ''}`}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all
                ${isFuture ? 'opacity-30' : ''}
                ${isToday ? 'ring-2 ring-offset-1' : ''}
              `}
              style={{
                backgroundColor: done ? accentColor : '#FFF8F0',
                color: done ? 'white' : '#C4A99A',
                ringColor: isToday ? accentColor : undefined,
              }}
            >
              {new Date(dateStr + 'T00:00:00').getDate()}
            </div>
          )
        })}
      </div>
    </div>
  )
}
