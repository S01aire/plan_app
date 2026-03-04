export function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl shadow-warm p-4 ${hover ? 'hover:shadow-warm-lg transition-shadow cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
