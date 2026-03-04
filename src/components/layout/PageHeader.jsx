import { formatChineseDate, getGreeting } from '../../utils/dateUtils'

export function PageHeader({ date, title, subtitle, extra }) {
  return (
    <div className="px-4 pt-6 pb-4">
      {date ? (
        <>
          <p className="text-xs text-text-light mb-0.5">{formatChineseDate(date)}</p>
          <h1 className="text-xl font-bold text-text-primary">{title || getGreeting()}</h1>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold text-text-primary">{title}</h1>
          {subtitle && <p className="text-sm text-text-light mt-1">{subtitle}</p>}
        </>
      )}
      {extra && <div className="mt-2">{extra}</div>}
    </div>
  )
}
