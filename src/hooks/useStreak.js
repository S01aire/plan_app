import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { computeStreak, computeBestStreak } from '../utils/planUtils'
import { getTodayStr } from '../utils/dateUtils'

export function useStreak(planId) {
  const { state } = useAppStore()
  const plan = state.plans.find(p => p.id === planId)

  return useMemo(() => {
    if (!plan) return { current: 0, best: 0 }
    const current = computeStreak(state.checkIns, planId, plan, getTodayStr())
    const best = computeBestStreak(state.checkIns, planId, plan)
    return { current, best }
  }, [state.checkIns, planId, plan])
}
