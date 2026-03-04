import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import {
  computeCompletionRate,
  computeStreak,
  computeBestStreak,
  getTotalCompletedDays,
  isDueOnDate,
} from '../utils/planUtils'
import { getTodayStr, subtractDays } from '../utils/dateUtils'

/**
 * Stats for a specific plan
 */
export function usePlanStats(planId) {
  const { state } = useAppStore()
  const plan = state.plans.find(p => p.id === planId)

  return useMemo(() => {
    if (!plan) return null
    const today = getTodayStr()
    const completionRate = computeCompletionRate(plan, state.checkIns, 30)
    const currentStreak = computeStreak(state.checkIns, planId, plan, today)
    const bestStreak = computeBestStreak(state.checkIns, planId, plan)
    const totalCompleted = getTotalCompletedDays(state.checkIns, planId)

    // Heatmap dates: last 90 days
    const heatmapDates = state.checkIns
      .filter(c => c.planId === planId)
      .map(c => c.date)

    return { completionRate, currentStreak, bestStreak, totalCompleted, heatmapDates }
  }, [state.checkIns, planId, plan])
}

/**
 * Aggregate stats across all active plans
 */
export function useAggregateStats() {
  const { state } = useAppStore()

  return useMemo(() => {
    const today = getTodayStr()
    const activePlans = state.plans.filter(p => !p.archived)

    // Today's completion rate
    let todayDue = 0, todayDone = 0
    activePlans.forEach(plan => {
      if (isDueOnDate(plan, today)) {
        todayDue++
        if (state.checkIns.some(c => c.planId === plan.id && c.date === today)) {
          todayDone++
        }
      }
    })
    const todayRate = todayDue === 0 ? 0 : Math.round((todayDone / todayDue) * 100)

    // Overall 30-day rate
    let totalDue = 0, totalDone = 0
    for (let i = 0; i < 30; i++) {
      const d = subtractDays(today, i)
      activePlans.forEach(plan => {
        if (isDueOnDate(plan, d)) {
          totalDue++
          if (state.checkIns.some(c => c.planId === plan.id && c.date === d)) {
            totalDone++
          }
        }
      })
    }
    const overallRate = totalDue === 0 ? 0 : Math.round((totalDone / totalDue) * 100)

    // Best streak across all plans
    const maxStreak = activePlans.reduce((max, plan) => {
      const s = computeStreak(state.checkIns, plan.id, plan, today)
      return Math.max(max, s)
    }, 0)

    // Total check-ins ever
    const totalCheckIns = state.checkIns.length

    return { todayRate, overallRate, maxStreak, totalCheckIns, totalPlans: activePlans.length }
  }, [state.checkIns, state.plans])
}
