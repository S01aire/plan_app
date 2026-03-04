import { useEffect } from 'react'
import { useAppContext } from '../../store/AppContext'
import { ACTIONS } from '../../store/actions'

export function ApiStatusBanner() {
  const { state, dispatch } = useAppContext()

  // Auto-clear error after 4 seconds
  useEffect(() => {
    if (!state.error) return
    const timer = setTimeout(() => {
      dispatch({ type: ACTIONS.SET_ERROR, payload: null })
    }, 4000)
    return () => clearTimeout(timer)
  }, [state.error, dispatch])

  if (state.loading) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-warm px-4 py-2 text-xs text-text-secondary flex items-center gap-2 pointer-events-none">
        <span className="inline-block animate-spin">⟳</span>
        同步中...
      </div>
    )
  }

  if (state.error) {
    return (
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 text-coral rounded-2xl shadow-warm px-4 py-2 text-xs max-w-xs text-center cursor-pointer"
        onClick={() => dispatch({ type: ACTIONS.SET_ERROR, payload: null })}
      >
        {state.error}
      </div>
    )
  }

  return null
}
