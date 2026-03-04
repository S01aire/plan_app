import { useAppStore } from '../store/useAppStore'
import { addDays, subtractDays, getTodayStr, isToday } from '../utils/dateUtils'

export function useDateNavigation() {
  const { state, setDate, goToToday } = useAppStore()
  const { selectedDate } = state

  function goToPrevDay() {
    setDate(subtractDays(selectedDate, 1))
  }

  function goToNextDay() {
    const next = addDays(selectedDate, 1)
    if (next <= getTodayStr()) {
      setDate(next)
    }
  }

  const canGoNext = selectedDate < getTodayStr()
  const isSelectedToday = isToday(selectedDate)

  return { selectedDate, goToPrevDay, goToNextDay, goToToday, canGoNext, isSelectedToday }
}
