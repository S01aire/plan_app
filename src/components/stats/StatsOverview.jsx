import { AnimatedNumber } from '../ui/AnimatedNumber'

export function StatsOverview({ items }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(({ label, value, suffix = '', color = '#FF8C42', icon }) => (
        <div key={label} className="bg-white rounded-3xl shadow-warm-sm p-4 text-center">
          {icon && <div className="text-xl mb-1">{icon}</div>}
          <div className="text-2xl font-bold" style={{ color }}>
            <AnimatedNumber value={value} suffix={suffix} />
          </div>
          <div className="text-xs text-text-light mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
