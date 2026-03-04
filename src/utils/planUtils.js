import { getTodayStr, subtractDays, parseDate, formatDateStr } from './dateUtils'

/**
 * Returns true if a plan should appear on the given date
 */
export function isDueOnDate(plan, dateStr) {
  if (plan.archived) return false

  switch (plan.type) {
    case 'single':
      return plan.targetDate === dateStr

    case 'longterm': {
      const created = plan.createdAt.slice(0, 10)
      const deadline = plan.deadline
      return dateStr >= created && dateStr <= deadline
    }

    case 'habit': {
      const created = plan.createdAt.slice(0, 10)
      if (dateStr < created) return false
      if (!plan.weekDays || plan.weekDays.length === 0) return true
      const dayOfWeek = parseDate(dateStr).getDay()
      return plan.weekDays.includes(dayOfWeek)
    }

    default:
      return false
  }
}

/**
 * Compute current streak: consecutive days with check-in going back from fromDate
 */
export function computeStreak(checkIns, planId, plan, fromDate = getTodayStr()) {
  let streak = 0
  let cursor = fromDate

  for (let i = 0; i < 365; i++) {
    const d = subtractDays(fromDate, i)
    if (!isDueOnDate(plan, d)) {
      // skip non-due days for habits
      if (plan.type === 'habit') continue
      else break
    }
    const hasCheckIn = checkIns.some(c => c.planId === planId && c.date === d)
    if (hasCheckIn) {
      streak++
    } else {
      break
    }
  }

  return streak
}

/**
 * Compute best streak historically
 */
export function computeBestStreak(checkIns, planId, plan) {
  const dates = checkIns
    .filter(c => c.planId === planId)
    .map(c => c.date)
    .sort()

  if (dates.length === 0) return 0

  let best = 1
  let current = 1

  for (let i = 1; i < dates.length; i++) {
    const prev = dates[i - 1]
    const curr = dates[i]

    // Check if consecutive (accounting for non-due days for habits)
    if (plan.type === 'habit' && plan.weekDays && plan.weekDays.length > 0) {
      // For selective weekday habits, just check it's a valid next occurrence
      best = Math.max(best, ++current)
    } else {
      // For daily habits / longterm: check actual day difference
      const diff = (parseDate(curr) - parseDate(prev)) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        current++
        best = Math.max(best, current)
      } else {
        current = 1
      }
    }
  }

  return best
}

/**
 * Compute completion rate for a plan over last N days
 */
export function computeCompletionRate(plan, checkIns, days = 30) {
  const today = getTodayStr()
  let due = 0
  let done = 0

  for (let i = 0; i < days; i++) {
    const d = subtractDays(today, i)
    if (isDueOnDate(plan, d)) {
      due++
      if (checkIns.some(c => c.planId === plan.id && c.date === d)) done++
    }
  }

  return due === 0 ? 0 : Math.round((done / due) * 100)
}

/**
 * Get summary for a specific date
 */
export function getDailySummary(plans, checkIns, dateStr) {
  const activePlans = plans.filter(p => !p.archived)
  const duePlans = activePlans.filter(p => isDueOnDate(p, dateStr))
  const completedPlans = duePlans.filter(p =>
    checkIns.some(c => c.planId === p.id && c.date === dateStr)
  )
  const pendingPlans = duePlans.filter(p =>
    !checkIns.some(c => c.planId === p.id && c.date === dateStr)
  )
  const completionRate = duePlans.length === 0 ? 0 :
    Math.round((completedPlans.length / duePlans.length) * 100)

  return { duePlans, completedPlans, pendingPlans, completionRate }
}

/**
 * Get total completed days for a plan
 */
export function getTotalCompletedDays(checkIns, planId) {
  return checkIns.filter(c => c.planId === planId).length
}

/**
 * Check if a longterm plan is overdue
 */
export function isOverdue(plan) {
  if (plan.type !== 'longterm') return false
  return plan.deadline < getTodayStr()
}

/**
 * Get days remaining until deadline
 */
export function getDaysRemaining(plan) {
  if (!plan.deadline) return null
  const today = getTodayStr()
  if (plan.deadline <= today) return 0
  const diff = (parseDate(plan.deadline) - parseDate(today)) / (1000 * 60 * 60 * 24)
  return Math.ceil(diff)
}

/**
 * Get progress percentage for longterm plan (days elapsed / total days)
 */
export function getLongtermProgress(plan) {
  const created = plan.createdAt.slice(0, 10)
  const today = getTodayStr()
  const totalDays = (parseDate(plan.deadline) - parseDate(created)) / (1000 * 60 * 60 * 24)
  if (totalDays <= 0) return 100
  const elapsed = (parseDate(today < plan.deadline ? today : plan.deadline) - parseDate(created)) / (1000 * 60 * 60 * 24)
  return Math.min(100, Math.round((elapsed / totalDays) * 100))
}
