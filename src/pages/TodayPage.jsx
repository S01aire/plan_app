import { useState, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useDateNavigation } from '../hooks/useDateNavigation'
import { getDailySummary } from '../utils/planUtils'
import { formatChineseDate, getGreeting, getTodayStr } from '../utils/dateUtils'
import { CircularProgress } from '../components/ui/CircularProgress'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { PlanCard } from '../components/plans/PlanCard'
import { PlanForm } from '../components/plans/PlanForm'

function DateNavigator({ selectedDate, onPrev, onNext, onToday, canGoNext, isToday }) {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <button
        onClick={onPrev}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-warm-sm text-text-secondary hover:bg-warm-100 transition-colors cursor-pointer border-none text-lg"
      >
        ‹
      </button>
      <div className="text-center">
        <div className="text-sm font-semibold text-text-primary">
          {isToday ? '今天' : formatChineseDate(selectedDate)}
        </div>
        {!isToday && (
          <button onClick={onToday} className="text-xs text-warm-400 hover:underline cursor-pointer border-none bg-transparent mt-0.5">
            回到今天
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`w-8 h-8 flex items-center justify-center rounded-full shadow-warm-sm transition-colors cursor-pointer border-none text-lg ${
          canGoNext
            ? 'bg-white text-text-secondary hover:bg-warm-100'
            : 'bg-warm-50 text-text-light cursor-not-allowed'
        }`}
      >
        ›
      </button>
    </div>
  )
}

export function TodayPage() {
  const { state } = useAppStore()
  const { selectedDate, goToPrevDay, goToNextDay, goToToday, canGoNext, isSelectedToday } = useDateNavigation()
  const [formOpen, setFormOpen] = useState(false)

  const { duePlans, completedPlans, pendingPlans, completionRate } = useMemo(
    () => getDailySummary(state.plans, state.checkIns, selectedDate),
    [state.plans, state.checkIns, selectedDate]
  )

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <p className="text-xs text-text-light mb-0.5">{formatChineseDate(selectedDate)}</p>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">
            {isSelectedToday ? getGreeting() : '历史记录'}
          </h1>
          <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
            + 新建
          </Button>
        </div>
      </div>

      {/* Date Navigator */}
      <div className="px-4 pb-2">
        <DateNavigator
          selectedDate={selectedDate}
          onPrev={goToPrevDay}
          onNext={goToNextDay}
          onToday={goToToday}
          canGoNext={canGoNext}
          isToday={isSelectedToday}
        />
      </div>

      {/* Progress ring */}
      {duePlans.length > 0 && (
        <div className="mx-4 bg-white rounded-3xl shadow-warm p-5 mb-4 flex items-center gap-4">
          <CircularProgress value={completionRate} size={80} strokeWidth={8}>
            <span className="text-sm font-bold text-text-primary">{completionRate}%</span>
          </CircularProgress>
          <div>
            <div className="font-semibold text-text-primary text-base">
              今日进度
            </div>
            <div className="text-sm text-text-secondary mt-0.5">
              {completedPlans.length}/{duePlans.length} 项已完成
            </div>
            {completionRate === 100 && (
              <div className="text-xs text-mint-300 font-medium mt-1">🎉 全部完成，太棒了！</div>
            )}
          </div>
        </div>
      )}

      <div className="px-4">
        {/* Pending plans */}
        {pendingPlans.length > 0 && (
          <div className="mb-4">
            <div className="section-title">待完成 · {pendingPlans.length}</div>
            {pendingPlans.map((plan, i) => (
              <div key={plan.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-up">
                <PlanCard plan={plan} date={selectedDate} />
              </div>
            ))}
          </div>
        )}

        {/* Completed plans */}
        {completedPlans.length > 0 && (
          <div className="mb-4">
            <div className="section-title">已完成 · {completedPlans.length}</div>
            {completedPlans.map(plan => (
              <div key={plan.id} className="opacity-70">
                <PlanCard plan={plan} date={selectedDate} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {duePlans.length === 0 && (
          <EmptyState
            emoji="🌱"
            title="今天还没有计划"
            subtitle="去添加一个吧，积累每一天的进步"
            action={() => setFormOpen(true)}
            actionLabel="+ 新建计划"
          />
        )}
      </div>

      <PlanForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
