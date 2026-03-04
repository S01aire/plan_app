import { useAppStore } from '../../store/useAppStore'
import { getTodayStr } from '../../utils/dateUtils'

function triggerConfetti(buttonEl) {
  const colors = ['#FF8C42', '#FFD4B2', '#A8D8B9', '#C9B8E8', '#FF6B6B', '#64B5F6']
  const rect = buttonEl.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div')
    el.className = 'confetti-particle'
    const angle = (i / 12) * Math.PI * 2
    const dist = 50 + Math.random() * 60
    const tx = Math.cos(angle) * dist
    const ty = Math.sin(angle) * dist - 30
    el.style.left = `${cx}px`
    el.style.top = `${cy}px`
    el.style.background = colors[i % colors.length]
    el.style.setProperty('--tx', `${tx}px`)
    el.style.setProperty('--ty', `${ty}px`)
    el.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`)
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 900)
  }
}

export function CheckInButton({ planId, date = getTodayStr(), size = 'md' }) {
  const { checkIn, uncheckIn, isCheckedIn } = useAppStore()
  const checked = isCheckedIn(planId, date)
  const isToday = date === getTodayStr()

  const sizeClass = size === 'sm'
    ? 'px-3 py-1.5 text-xs min-h-[36px] min-w-[64px]'
    : 'px-5 py-2.5 text-sm min-h-[44px] min-w-[80px]'

  if (checked) {
    return (
      <button
        onClick={() => isToday && uncheckIn(planId, date)}
        title={isToday ? '点击撤销打卡' : ''}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium border-none outline-none
          ${sizeClass}
          ${isToday ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
          transition-all`}
        style={{ backgroundColor: '#A8D8B9', color: 'white' }}
      >
        <span className="animate-scale-check inline-block">✓</span>
        <span>已打卡</span>
      </button>
    )
  }

  return (
    <button
      onClick={(e) => {
        triggerConfetti(e.currentTarget)
        checkIn(planId, date)
      }}
      className={`checkin-btn ${sizeClass} animate-none`}
    >
      打卡
    </button>
  )
}
