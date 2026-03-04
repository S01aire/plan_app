import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/today',    icon: '☀️', label: '今日' },
  { to: '/plans',    icon: '📋', label: '计划' },
  { to: '/stats',    icon: '📊', label: '统计' },
  { to: '/settings', icon: '⚙️', label: '设置' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-warm-100 safe-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1 rounded-2xl transition-all ${
                isActive
                  ? 'text-warm-400 scale-105'
                  : 'text-text-light hover:text-text-secondary'
              }`
            }
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
