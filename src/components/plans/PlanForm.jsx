import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { PLAN_TYPE, PLAN_TYPE_CONFIG, WEEKDAY_LABELS, COLOR_TAGS, EMOJI_PRESETS } from '../../constants/planTypes'
import { getTodayStr } from '../../utils/dateUtils'
import { useAppStore } from '../../store/useAppStore'

const DEFAULT_FORM = {
  type: 'habit',
  title: '',
  note: '',
  icon: '🌟',
  colorTag: '#FF8C42',
  targetDate: getTodayStr(),
  deadline: '',
  weekDays: [],
}

export function PlanForm({ isOpen, onClose, editPlan = null }) {
  const { addPlan, updatePlan } = useAppStore()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editPlan) {
      setForm({ ...DEFAULT_FORM, ...editPlan })
    } else {
      setForm({ ...DEFAULT_FORM, targetDate: getTodayStr() })
    }
    setErrors({})
  }, [editPlan, isOpen])

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  function toggleWeekday(d) {
    set('weekDays', form.weekDays.includes(d)
      ? form.weekDays.filter(x => x !== d)
      : [...form.weekDays, d]
    )
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = '请输入计划名称'
    if (form.type === 'longterm' && !form.deadline) e.deadline = '请设置截止日期'
    if (form.type === 'single' && !form.targetDate) e.targetDate = '请设置目标日期'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const data = {
      type: form.type,
      title: form.title.trim(),
      note: form.note.trim(),
      icon: form.icon,
      colorTag: form.colorTag,
      ...(form.type === 'single'   && { targetDate: form.targetDate }),
      ...(form.type === 'longterm' && { deadline: form.deadline }),
      ...(form.type === 'habit'    && { weekDays: form.weekDays }),
    }
    if (editPlan) {
      updatePlan({ ...editPlan, ...data })
    } else {
      addPlan(data)
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editPlan ? '编辑计划' : '新建计划'}>
      <div className="px-6 py-4 space-y-5">

        {/* Type selector */}
        <div>
          <label className="section-title block">计划类型</label>
          <div className="flex gap-2">
            {Object.entries(PLAN_TYPE_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => set('type', key)}
                className={`flex-1 py-2 px-1 rounded-2xl text-xs font-medium transition-all cursor-pointer border-2 ${
                  form.type === key
                    ? 'text-white border-transparent'
                    : 'bg-warm-50 text-text-secondary border-warm-100'
                }`}
                style={form.type === key ? { backgroundColor: cfg.color, borderColor: cfg.color } : {}}
              >
                {cfg.icon} {cfg.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Emoji + Title */}
        <div>
          <label className="section-title block">图标</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {EMOJI_PRESETS.map(e => (
              <button
                key={e}
                onClick={() => set('icon', e)}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer border-2 ${
                  form.icon === e ? 'border-warm-400 bg-warm-50 scale-110' : 'border-transparent bg-warm-50 hover:border-warm-200'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="section-title block">计划名称</label>
          <input
            className={`input-field ${errors.title ? 'border-coral' : ''}`}
            placeholder="给计划起个名字..."
            value={form.title}
            onChange={e => set('title', e.target.value.slice(0, 40))}
            maxLength={40}
          />
          {errors.title && <p className="text-xs text-coral mt-1">{errors.title}</p>}
          <p className="text-xs text-text-light mt-1 text-right">{form.title.length}/40</p>
        </div>

        <div>
          <label className="section-title block">备注（选填）</label>
          <textarea
            className="input-field resize-none"
            placeholder="添加一些说明..."
            rows={2}
            value={form.note}
            onChange={e => set('note', e.target.value)}
          />
        </div>

        {/* Conditional fields */}
        {form.type === 'single' && (
          <div>
            <label className="section-title block">目标日期</label>
            <input
              type="date"
              className={`input-field ${errors.targetDate ? 'border-coral' : ''}`}
              value={form.targetDate}
              onChange={e => set('targetDate', e.target.value)}
            />
            {errors.targetDate && <p className="text-xs text-coral mt-1">{errors.targetDate}</p>}
          </div>
        )}

        {form.type === 'longterm' && (
          <div>
            <label className="section-title block">截止日期</label>
            <input
              type="date"
              className={`input-field ${errors.deadline ? 'border-coral' : ''}`}
              value={form.deadline}
              min={getTodayStr()}
              onChange={e => set('deadline', e.target.value)}
            />
            {errors.deadline && <p className="text-xs text-coral mt-1">{errors.deadline}</p>}
          </div>
        )}

        {form.type === 'habit' && (
          <div>
            <label className="section-title block">打卡日期（不选则每天）</label>
            <div className="flex gap-1.5">
              {WEEKDAY_LABELS.map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleWeekday(idx)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border-2 ${
                    form.weekDays.includes(idx)
                      ? 'bg-mint-200 text-white border-mint-200'
                      : 'bg-warm-50 text-text-secondary border-warm-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        <div>
          <label className="section-title block">颜色标签</label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_TAGS.map(c => (
              <button
                key={c}
                onClick={() => set('colorTag', c)}
                className={`w-7 h-7 rounded-full transition-all cursor-pointer border-2 ${
                  form.colorTag === c ? 'scale-125 border-white shadow-warm' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">取消</Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            {editPlan ? '保存修改' : '创建计划'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
