import { useAppContext } from './AppContext'
import { ACTIONS } from './actions'
import { getTodayStr } from '../utils/dateUtils'
import { v4 as uuid } from 'uuid'
import { api } from '../lib/api'

export function useAppStore() {
  const { state, dispatch } = useAppContext()

  // ── Plan actions (optimistic update + rollback on error) ──────
  async function addPlan(planData) {
    const payload = {
      ...planData,
      id: uuid(),
      createdAt: new Date().toISOString(),
      archived: false,
    }
    dispatch({ type: ACTIONS.ADD_PLAN, payload })
    try {
      await api.createPlan(payload)
    } catch (err) {
      dispatch({ type: ACTIONS.DELETE_PLAN, payload: payload.id })
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message })
    }
  }

  async function updatePlan(planData) {
    const original = state.plans.find(p => p.id === planData.id)
    dispatch({ type: ACTIONS.UPDATE_PLAN, payload: planData })
    try {
      await api.updatePlan(planData)
    } catch (err) {
      if (original) dispatch({ type: ACTIONS.UPDATE_PLAN, payload: original })
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message })
    }
  }

  async function deletePlan(planId) {
    const original = state.plans.find(p => p.id === planId)
    const removedCheckIns = state.checkIns.filter(c => c.planId === planId)
    dispatch({ type: ACTIONS.DELETE_PLAN, payload: planId })
    try {
      await api.deletePlan(planId)
    } catch (err) {
      if (original) dispatch({ type: ACTIONS.ADD_PLAN, payload: original })
      removedCheckIns.forEach(c => dispatch({ type: ACTIONS.CHECK_IN, payload: c }))
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message })
    }
  }

  // ── Check-in actions ──────────────────────────────────────────
  async function checkIn(planId, date = state.selectedDate) {
    const payload = { id: uuid(), planId, date, checkedAt: new Date().toISOString() }
    dispatch({ type: ACTIONS.CHECK_IN, payload })
    try {
      await api.createCheckIn(payload)
    } catch (err) {
      dispatch({ type: ACTIONS.UNCHECK_IN, payload: { planId, date } })
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message })
    }
  }

  async function uncheckIn(planId, date = state.selectedDate) {
    dispatch({ type: ACTIONS.UNCHECK_IN, payload: { planId, date } })
    try {
      await api.deleteCheckIn(planId, date)
    } catch (err) {
      dispatch({ type: ACTIONS.CHECK_IN, payload: {
        id: uuid(), planId, date, checkedAt: new Date().toISOString()
      }})
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message })
    }
  }

  // ── Synchronous reads (unchanged) ─────────────────────────────
  function isCheckedIn(planId, date = state.selectedDate) {
    return state.checkIns.some(c => c.planId === planId && c.date === date)
  }

  function setDate(dateStr) {
    dispatch({ type: ACTIONS.SET_DATE, payload: dateStr })
  }

  function goToToday() {
    dispatch({ type: ACTIONS.SET_DATE, payload: getTodayStr() })
  }

  // ── Data management ────────────────────────────────────────────
  function importData(data) {
    // Keeps local import working for migration, won't persist to server
    dispatch({ type: ACTIONS.IMPORT_DATA, payload: data })
  }

  async function clearAllData() {
    const planIds = state.plans.filter(p => !p.archived).map(p => p.id)
    dispatch({ type: ACTIONS.CLEAR_ALL_DATA })
    try {
      await Promise.all(planIds.map(id => api.deletePlan(id)))
    } catch (err) {
      // Reload from server to restore consistent state
      try {
        const [plans, checkIns] = await Promise.all([api.getPlans(), api.getCheckIns()])
        dispatch({ type: ACTIONS.LOAD_DATA, payload: { plans, checkIns } })
      } catch {}
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message })
    }
  }

  return {
    state,
    addPlan,
    updatePlan,
    deletePlan,
    checkIn,
    uncheckIn,
    isCheckedIn,
    setDate,
    goToToday,
    importData,
    clearAllData,
  }
}
