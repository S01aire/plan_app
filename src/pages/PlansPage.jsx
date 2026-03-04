import { useState, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { PLAN_TYPE_CONFIG } from '../constants/planTypes'
import { PlanCard } from '../components/plans/PlanCard'
import { PlanForm } from '../components/plans/PlanForm'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { getTodayStr } from '../utils/dateUtils'

const FILTER_TABS = [
  { key: 'all',      label: '全部' },
  { key: 'habit',    label: '习惯' },
  { key: 'longterm', label: '长期' },
  { key: 'single',   label: '单次' },
]

export function PlansPage() {
  const { state, deletePlan } = useAppStore()
  const [filter, setFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editPlan, setEditPlan] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const activePlans = useMemo(
    () => state.plans.filter(p => !p.archived),
    [state.plans]
  )

  const filtered = useMemo(
    () => filter === 'all' ? activePlans : activePlans.filter(p => p.type === filter),
    [activePlans, filter]
  )

  function handleEdit(plan) {
    setEditPlan(plan)
    setFormOpen(true)
  }

  function handleFormClose() {
    setFormOpen(false)
    setEditPlan(null)
  }

  function handleDelete(id) {
    setDeleteId(id)
  }

  const today = getTodayStr()

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">我的计划</h1>
          <p className="text-xs text-text-light mt-0.5">{activePlans.length} 个计划进行中</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
          + 新建
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 bg-white rounded-2xl p-1 shadow-warm-sm">
          {FILTER_TABS.map(tab => {
            const count = tab.key === 'all'
              ? activePlans.length
              : activePlans.filter(p => p.type === tab.key).length
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border-none ${
                  filter === tab.key
                    ? 'bg-warm-400 text-white shadow-warm-sm'
                    : 'bg-transparent text-text-secondary hover:bg-warm-50'
                }`}
              >
                {tab.label}
                {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Plan list */}
      <div className="px-4">
        {filtered.length === 0 ? (
          <EmptyState
            emoji={filter === 'all' ? '📋' : PLAN_TYPE_CONFIG[filter]?.icon || '📋'}
            title={filter === 'all' ? '还没有计划' : `还没有${PLAN_TYPE_CONFIG[filter]?.label}`}
            subtitle="点击右上角新建一个"
            action={() => setFormOpen(true)}
            actionLabel="+ 新建计划"
          />
        ) : (
          filtered.map((plan, i) => (
            <div key={plan.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-up">
              <PlanCard
                plan={plan}
                date={today}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))
        )}
      </div>

      <PlanForm
        isOpen={formOpen}
        onClose={handleFormClose}
        editPlan={editPlan}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deletePlan(deleteId)}
        title="删除计划"
        message="删除后打卡记录也会清空，确定要删除吗？"
      />
    </div>
  )
}
