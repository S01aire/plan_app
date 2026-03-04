import { ACTIONS } from './actions'
import { getTodayStr } from '../utils/dateUtils'

export const initialState = {
  version: '1.0',
  plans: [],
  checkIns: [],
  selectedDate: getTodayStr(),
  theme: 'warm',
  loading: false,
  error: null,
}

export function reducer(state, action) {
  switch (action.type) {

    case ACTIONS.ADD_PLAN:
      return { ...state, plans: [...state.plans, action.payload] }

    case ACTIONS.UPDATE_PLAN:
      return {
        ...state,
        plans: state.plans.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      }

    case ACTIONS.DELETE_PLAN:
      return {
        ...state,
        plans: state.plans.map(p =>
          p.id === action.payload ? { ...p, archived: true } : p
        ),
        checkIns: state.checkIns.filter(c => c.planId !== action.payload),
      }

    case ACTIONS.CHECK_IN: {
      const exists = state.checkIns.find(
        c => c.planId === action.payload.planId && c.date === action.payload.date
      )
      if (exists) return state
      return { ...state, checkIns: [...state.checkIns, action.payload] }
    }

    case ACTIONS.UNCHECK_IN:
      return {
        ...state,
        checkIns: state.checkIns.filter(
          c => !(c.planId === action.payload.planId && c.date === action.payload.date)
        ),
      }

    case ACTIONS.SET_DATE:
      return { ...state, selectedDate: action.payload }

    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload }

    case ACTIONS.IMPORT_DATA:
      return { ...action.payload, selectedDate: getTodayStr() }

    case ACTIONS.CLEAR_ALL_DATA:
      return { ...initialState, selectedDate: getTodayStr() }

    case ACTIONS.LOAD_DATA:
      return {
        ...state,
        plans:    action.payload.plans,
        checkIns: action.payload.checkIns,
        loading:  false,
        error:    null,
      }

    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }

    default:
      return state
  }
}
