export function ProgressBar({ value = 0, max = 100, color = '#FF8C42', label, showPercent = true, className = '' }) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100))

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-text-secondary">{label}</span>}
          {showPercent && <span className="text-xs font-medium text-text-secondary">{pct}%</span>}
        </div>
      )}
      <div className="w-full bg-warm-50 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
