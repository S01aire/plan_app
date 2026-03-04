export function Badge({ children, color, className = '' }) {
  const colorMap = {
    warm:    'bg-warm-100 text-warm-600',
    mint:    'bg-mint-100 text-mint-300',
    coral:   'bg-red-100 text-coral',
    lavender:'bg-purple-100 text-purple-600',
    default: 'bg-warm-50 text-text-secondary',
  }

  const cls = colorMap[color] || colorMap.default

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls} ${className}`}>
      {children}
    </span>
  )
}
