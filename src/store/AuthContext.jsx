import { createContext, useContext, useState, useEffect } from 'react'
import { api, setApiToken, clearApiToken } from '../lib/api'

const TOKEN_KEY = 'planapp_token'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token,       setToken]       = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user,        setUser]        = useState(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError,   setAuthError]   = useState(null)

  // Sync token into api module on every change
  useEffect(() => {
    if (token) setApiToken(token)
    else       clearApiToken()
  }, [token])

  function persist(tkn, usr) {
    localStorage.setItem(TOKEN_KEY, tkn)
    setToken(tkn)
    setUser(usr)
  }

  async function login(username, password) {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const data = await api.login(username, password)
      persist(data.token, data.user)
    } catch (err) {
      setAuthError(err.message)
      throw err
    } finally {
      setAuthLoading(false)
    }
  }

  async function register(username, password) {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const data = await api.register(username, password)
      persist(data.token, data.user)
    } catch (err) {
      setAuthError(err.message)
      throw err
    } finally {
      setAuthLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    clearApiToken()
    setToken(null)
    setUser(null)
  }

  function clearAuthError() {
    setAuthError(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, authLoading, authError, clearAuthError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
