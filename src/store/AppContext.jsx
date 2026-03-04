import { createContext, useReducer, useEffect, useContext } from 'react'
import { reducer, initialState } from './reducer'
import { ACTIONS } from './actions'
import { api } from '../lib/api'
import { useAuth } from './AuthContext'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { token } = useAuth()
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load data from API whenever token changes (login / logout)
  useEffect(() => {
    if (!token) {
      dispatch({ type: ACTIONS.CLEAR_ALL_DATA })
      return
    }

    async function loadData() {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      try {
        const [plans, checkIns] = await Promise.all([
          api.getPlans(),
          api.getCheckIns(),
        ])
        dispatch({ type: ACTIONS.LOAD_DATA, payload: { plans, checkIns } })
      } catch (err) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: err.message || '加载数据失败' })
      }
    }

    loadData()
  }, [token])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
