import { useState } from 'react'
import { PLAN_TYPE_CONFIG } from '../../constants/planTypes'
import { CheckInButton } from './CheckInButton'
import { ProgressBar } from '../ui/ProgressBar'
import { Badge } from '../ui/Badge'
import { useStreak } from '../../hooks/useStreak'
import { useAppStore } from '../../store/useAppStore'
import { getTodayStr, subtractDays, formatShortDate } from '../../utils/dateUtils'
import { getLongtermProgress, getDaysRemaining, isOverdue } from '../../utils/planUtils'

// ── Habit mini dots ───────────────────────────────────────────
function MiniDots({ planId }) {
  const { state } = useAppStore()
  const today = getTodayStr()
  const days = Array.from({ length: 7 }, (_, i) => subtractDays(today, 6 - i))
  return (
    <div className="flex gap-1 mt-2">
      {days.map(d => {
        const done = state.checkIns.some(c => c.planId === planId && c.date === d)
        return (
          <div
            key={d}
            title={formatShortDate(d)}
            className={`w-4 h-4 rounded-full ${done ? 'bg-mint-200' : 'bg-warm-100'}`}
          />
        )
      })}
    </div>
  )
}

// ── Habit card ────────────────────────────────────────────────
function HabitCard({ plan, date, onEdit, onDelete }) {
  const { current } = useStreak(plan.id)
  return (
    <CardShell plan={plan} date={date} onEdit={onEdit} onDelete={onDelete}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{plan.icon}</span>
            <span className="font-semibold text-text-primary truncate">{plan.title}</span>
          </div>
          {plan.note && <p className="text-xs text-text-light mt-0.5 line-clamp-1">{plan.note}</p>}
          <div className="flex items-center gap-1 mt-1.5 text-xs text-text-secondary">
            {current > 0 && (
              <span className="flex items-center gap-0.5 font-medium text-warm-400">
                🔥 {current} 天连续
              </span>
            )}
          </div>
          <MiniDots planId={plan.id} />
        </div>
        <CheckInButton planId={plan.id} date={date} />
      </div>
    </CardShell>
  )
}

// ── Longterm card ─────────────────────────────────────────────
function LongtermCard({ plan, date, onEdit, onDelete }) {
  const overdue = isOverdue(plan)
  const remaining = getDaysRemaining(plan)
  const progress = getLongtermProgress(plan)
  const { current } = useStreak(plan.id)

  return (
    <CardShell plan={plan} date={date} onEdit={onEdit} onDelete={onDelete}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">{plan.icon}</span>
            <span className="font-semibold text-text-primary truncate">{plan.title}</span>
            {overdue && <Badge color="coral">已逾期</Badge>}
          </div>
          {plan.note && <p className="text-xs text-text-light mt-0.5 line-clamp-1">{plan.note}</p>}
          <div className="text-xs text-text-light mt-1">
            {overdue
              ? `截止日期：${plan.deadline}`
              : remaining === 0
                ? '今天是最后一天！'
                : `还剩 ${remaining} 天`}
            {current > 0 && <span className="ml-2 text-warm-400">🔥 {current}天</span>}
          </div>
          <ProgressBar
            value={progress}
            max={100}
            color={overdue ? '#FF6B6B' : '#FF8C42'}
            showPercent={false}
            className="mt-2"
          />
        </div>
        <CheckInButton planId={plan.id} date={date} />
      </div>
    </CardShell>
  )
}

// ── Single-day card ────────────────────────────────────────────
function SingleCard({ plan, date, onEdit, onDelete }) {
  return (
    <CardShell plan={plan} date={date} onEdit={onEdit} onDelete={onDelete}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{plan.icon}</span>
            <span className="font-semibold text-text-primary truncate">{plan.title}</span>
          </div>
          {plan.note && <p className="text-xs text-text-light mt-0.5 line-clamp-1">{plan.note}</p>}
          <div className="text-xs text-text-light mt-1">一次性任务</div>
        </div>
        <CheckInButton planId={plan.id} date={date} />
      </div>
    </CardShell>
  )
}

// ── Shell wrapper ──────────────────────────────────────────────
function CardShell({ plan, date, onEdit, onDelete, children }) {
  const config = PLAN_TYPE_CONFIG[plan.type] || {}
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className="bg-white rounded-3xl shadow-warm-sm p-4 mb-3 relative overflow-hidden"
      style={{ borderLeft: `4px solid ${plan.colorTag || config.color}` }}
    >
      {children}

      {(onEdit || onDelete) && (
        <div className="flex justify-end mt-3 gap-2 pt-2 border-t border-warm-50">
          {onEdit && (
            <button onClick={() => onEdit(plan)} className="text-xs text-text-light hover:text-warm-400 transition-colors cursor-pointer border-none bg-transparent">
              编辑
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(plan.id)} className="text-xs text-text-light hover:text-coral transition-colors cursor-pointer border-none bg-transparent">
              删除
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────
export function PlanCard({ plan, date = getTodayStr(), onEdit, onDelete }) {
  switch (plan.type) {
    case 'habit':    return <HabitCard    plan={plan} date={date} onEdit={onEdit} onDelete={onDelete} />
    case 'longterm': return <LongtermCard plan={plan} date={date} onEdit={onEdit} onDelete={onDelete} />
    case 'single':   return <SingleCard   plan={plan} date={date} onEdit={onEdit} onDelete={onDelete} />
    default:         return null
  }
}
