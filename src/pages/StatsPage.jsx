import { useState, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useAggregateStats, usePlanStats } from '../hooks/useStats'
import { StatsOverview } from '../components/stats/StatsOverview'
import { CalendarHeatmap } from '../components/stats/CalendarHeatmap'
import { WeeklyBarChart } from '../components/stats/WeeklyBarChart'
import { StreakCounter } from '../components/stats/StreakCounter'
import { CircularProgress } from '../components/ui/CircularProgress'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

function PlanSelector({ plans, selectedId, onChange }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2 w-max">
        <button
          onClick={() => onChange(null)}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border-2 whitespace-nowrap ${
            !selectedId
              ? 'bg-warm-400 text-white border-warm-400'
              : 'bg-white text-text-secondary border-warm-100 hover:border-warm-300'
          }`}
        >
          全部综合
        </button>
        {plans.map(p => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border-2 whitespace-nowrap flex items-center gap-1 ${
              selectedId === p.id
                ? 'text-white border-transparent'
                : 'bg-white text-text-secondary border-warm-100 hover:border-warm-300'
            }`}
            style={selectedId === p.id ? { backgroundColor: p.colorTag || '#FF8C42', borderColor: p.colorTag || '#FF8C42' } : {}}
          >
            {p.icon} {p.title}
          </button>
        ))}
      </div>
    </div>
  )
}

function AggregateStats() {
  const { todayRate, overallRate, maxStreak, totalCheckIns, totalPlans } = useAggregateStats()

  const items = [
    { label: '今日完成率', value: todayRate, suffix: '%', color: '#FF8C42', icon: '☀️' },
    { label: '30天完成率', value: overallRate, suffix: '%', color: '#A8D8B9', icon: '📈' },
    { label: '最长连续', value: maxStreak, suffix: '天', color: '#C9B8E8', icon: '🔥' },
  ]

  return (
    <>
      <StatsOverview items={items} />

      <Card className="mt-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">近7天完成情况</h3>
        <WeeklyBarChart />
      </Card>

      <Card className="mt-3">
        <h3 className="text-sm font-semibold text-text-primary mb-3">打卡热力图</h3>
        <CalendarHeatmap />
      </Card>
    </>
  )
}

function PlanDetailStats({ planId }) {
  const stats = usePlanStats(planId)
  const { state } = useAppStore()
  const plan = state.plans.find(p => p.id === planId)

  if (!stats || !plan) return null

  const items = [
    { label: '30天完成率', value: stats.completionRate, suffix: '%', color: plan.colorTag || '#FF8C42', icon: '📊' },
    { label: '总打卡天数', value: stats.totalCompleted, suffix: '天', color: '#A8D8B9', icon: '✅' },
    { label: '历史最长连续', value: stats.bestStreak, suffix: '天', color: '#C9B8E8', icon: '🏆' },
  ]

  return (
    <>
      {/* Ring + streak */}
      <div className="flex items-center gap-4 bg-white rounded-3xl shadow-warm p-5 mb-4">
        <CircularProgress
          value={stats.completionRate}
          size={80}
          strokeWidth={8}
          color={plan.colorTag || '#FF8C42'}
          trackColor="#FFD4B2"
        >
          <span className="text-sm font-bold text-text-primary">{stats.completionRate}%</span>
        </CircularProgress>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{plan.icon}</span>
            <span className="font-semibold text-text-primary">{plan.title}</span>
          </div>
          <div className="text-sm text-text-secondary mt-1">
            30天完成率 · 共 {stats.totalCompleted} 次打卡
          </div>
          {stats.currentStreak > 0 && (
            <div className="text-sm text-warm-400 font-medium mt-0.5">
              🔥 当前连续 {stats.currentStreak} 天
            </div>
          )}
        </div>
      </div>

      <StatsOverview items={items} />

      <div className="mt-4">
        <StreakCounter planId={planId} />
      </div>

      <Card className="mt-3">
        <h3 className="text-sm font-semibold text-text-primary mb-3">近7天完成情况</h3>
        <WeeklyBarChart planId={planId} />
      </Card>

      <Card className="mt-3">
        <h3 className="text-sm font-semibold text-text-primary mb-3">打卡热力图</h3>
        <CalendarHeatmap planId={planId} />
      </Card>
    </>
  )
}

export function StatsPage() {
  const { state } = useAppStore()
  const [selectedPlanId, setSelectedPlanId] = useState(null)

  const activePlans = useMemo(
    () => state.plans.filter(p => !p.archived),
    [state.plans]
  )

  return (
    <div className="animate-fade-up">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-text-primary">数据统计</h1>
        <p className="text-xs text-text-light mt-0.5">记录你的每一步进步</p>
      </div>

      {activePlans.length === 0 ? (
        <EmptyState
          emoji="📊"
          title="还没有数据"
          subtitle="先去创建计划并开始打卡吧"
        />
      ) : (
        <div className="px-4 pb-4">
          {/* Plan selector */}
          {activePlans.length > 1 && (
            <div className="mb-4">
              <PlanSelector
                plans={activePlans}
                selectedId={selectedPlanId}
                onChange={setSelectedPlanId}
              />
            </div>
          )}

          {selectedPlanId
            ? <PlanDetailStats planId={selectedPlanId} />
            : <AggregateStats />
          }
        </div>
      )}
    </div>
  )
}
