import { useStreak } from '../../hooks/useStreak'
import { AnimatedNumber } from '../ui/AnimatedNumber'

export function StreakCounter({ planId }) {
  const { current, best } = useStreak(planId)

  return (
    <div className="flex gap-4">
      <div className="flex-1 bg-white rounded-3xl shadow-warm-sm p-4 text-center">
        <div className={`text-3xl mb-1 ${current > 0 ? 'animate-wiggle' : ''}`}>🔥</div>
        <div className="text-2xl font-bold text-warm-400">
          <AnimatedNumber value={current} />
        </div>
        <div className="text-xs text-text-light mt-1">当前连续</div>
      </div>
      <div className="flex-1 bg-white rounded-3xl shadow-warm-sm p-4 text-center">
        <div className="text-3xl mb-1">🏆</div>
        <div className="text-2xl font-bold text-lavender">
          <AnimatedNumber value={best} />
        </div>
        <div className="text-xs text-text-light mt-1">历史最长</div>
      </div>
    </div>
  )
}
