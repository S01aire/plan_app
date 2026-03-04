import { PLAN_TYPE_CONFIG } from '../../constants/planTypes'

export function TypeIcon({ type, size = 'md' }) {
  const config = PLAN_TYPE_CONFIG[type] || {}
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${sizes[size]}`}
      style={{ backgroundColor: config.bgColor, width: size === 'lg' ? 36 : size === 'md' ? 28 : 22, height: size === 'lg' ? 36 : size === 'md' ? 28 : 22 }}
    >
      {config.icon}
    </span>
  )
}
