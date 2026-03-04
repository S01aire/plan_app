import { useAppStore } from '../../store/useAppStore'
import { getTodayStr, subtractDays, formatShortDate } from '../../utils/dateUtils'
import { isDueOnDate } from '../../utils/planUtils'

export function WeeklyBarChart({ planId }) {
  const { state } = useAppStore()
  const today = getTodayStr()

  const days = Array.from({ length: 7 }, (_, i) => subtractDays(today, 6 - i))
  const plan = planId ? state.plans.find(p => p.id === planId) : null

  const bars = days.map(d => {
    if (planId && plan) {
      const due = isDueOnDate(plan, d)
      const done = due && state.checkIns.some(c => c.planId === planId && c.date === d)
      return { date: d, value: done ? 1 : 0, due }
    } else {
      // Aggregate across all plans
      const activePlans = state.plans.filter(p => !p.archived)
      const due = activePlans.filter(p => isDueOnDate(p, d)).length
      const done = activePlans.filter(p =>
        isDueOnDate(p, d) && state.checkIns.some(c => c.planId === p.id && c.date === d)
      ).length
      return { date: d, value: due > 0 ? done / due : 0, due }
    }
  })

  const maxValue = planId ? 1 : Math.max(...bars.map(b => b.due), 1)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div>
      <div className="flex items-end gap-2 h-24">
        {bars.map(({ date, value, due }) => {
          const pct = planId
            ? (value * 100)
            : (due > 0 ? Math.round(value * 100) : 0)
          const isToday = date === today
          const color = pct >= 80 ? '#A8D8B9' : pct >= 40 ? '#FF8C42' : '#FFD4B2'

          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-text-light">{pct > 0 ? `${pct}%` : ''}</span>
              <div className="w-full bg-warm-50 rounded-lg overflow-hidden flex-1 flex items-end" style={{ minHeight: 48 }}>
                <div
                  className="w-full rounded-lg transition-all duration-700"
                  style={{
                    height: `${Math.max(pct, due > 0 ? 8 : 0)}%`,
                    backgroundColor: due === 0 ? '#FFF8F0' : color,
                    minHeight: due > 0 ? 4 : 0,
                  }}
                />
              </div>
              <span className={`text-xs font-medium ${isToday ? 'text-warm-400' : 'text-text-light'}`}>
                {weekdays[new Date(date + 'T00:00:00').getDay()]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
