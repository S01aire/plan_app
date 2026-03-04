/**
 * Returns today's date as 'YYYY-MM-DD'
 */
export function getTodayStr() {
  const d = new Date()
  return formatDateStr(d)
}

/**
 * Format a Date object to 'YYYY-MM-DD'
 */
export function formatDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Parse 'YYYY-MM-DD' string to a local Date (midnight)
 */
export function parseDate(dateStr) {
  return new Date(dateStr + 'T00:00:00')
}

/**
 * Format date string to Chinese display: "2月26日 星期四"
 */
export function formatChineseDate(dateStr) {
  const d = parseDate(dateStr)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekday = weekdays[d.getDay()]
  return `${month}月${day}日 ${weekday}`
}

/**
 * Format date string to short display: "2月26日"
 */
export function formatShortDate(dateStr) {
  const d = parseDate(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

/**
 * Subtract n days from a date string, returns 'YYYY-MM-DD'
 */
export function subtractDays(dateStr, n) {
  const d = parseDate(dateStr)
  d.setDate(d.getDate() - n)
  return formatDateStr(d)
}

/**
 * Add n days to a date string, returns 'YYYY-MM-DD'
 */
export function addDays(dateStr, n) {
  const d = parseDate(dateStr)
  d.setDate(d.getDate() + n)
  return formatDateStr(d)
}

/**
 * Returns number of days between two date strings (b - a)
 */
export function daysBetween(aStr, bStr) {
  const a = parseDate(aStr)
  const b = parseDate(bStr)
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

/**
 * Returns all 'YYYY-MM-DD' strings for a given month
 */
export function getDaysInMonth(year, month) {
  const days = []
  const daysInMonth = new Date(year, month, 0).getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(`${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`)
  }
  return days
}

/**
 * Returns the day of week (0=Sun) for a date string
 */
export function getWeekday(dateStr) {
  return parseDate(dateStr).getDay()
}

/**
 * Get the first weekday (0=Sun) of the month
 */
export function getFirstWeekdayOfMonth(year, month) {
  return new Date(year, month - 1, 1).getDay()
}

/**
 * Returns greeting based on hour
 */
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了，注意休息 🌙'
  if (hour < 9) return '早上好，美好的一天开始啦 ☀️'
  if (hour < 12) return '上午好，继续加油 💪'
  if (hour < 14) return '中午好，记得休息一下 🍱'
  if (hour < 18) return '下午好，保持专注 ✨'
  if (hour < 21) return '晚上好，今天辛苦了 🌟'
  return '夜晚好，早点休息哦 🌙'
}

/**
 * Check if a date string is today
 */
export function isToday(dateStr) {
  return dateStr === getTodayStr()
}

/**
 * Check if a date string is in the future
 */
export function isFuture(dateStr) {
  return dateStr > getTodayStr()
}

/**
 * Check if a date string is in the past
 */
export function isPast(dateStr) {
  return dateStr < getTodayStr()
}
