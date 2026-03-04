import { Button } from './Button'

export function EmptyState({ emoji = '🌱', title, subtitle, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4 animate-bounce-in">{emoji}</div>
      <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-text-light mb-6">{subtitle}</p>}
      {action && actionLabel && (
        <Button onClick={action} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
