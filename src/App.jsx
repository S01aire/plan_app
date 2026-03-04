import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './store/AuthContext'
import { AppProvider } from './store/AppContext'
import { AppShell } from './components/layout/AppShell'
import { ApiStatusBanner } from './components/ui/ApiStatusBanner'
import { TodayPage }    from './pages/TodayPage'
import { PlansPage }    from './pages/PlansPage'
import { StatsPage }    from './pages/StatsPage'
import { SettingsPage } from './pages/SettingsPage'
import { LoginPage }    from './pages/LoginPage'

// Guard: redirect to /login when not authenticated
function RequireAuth({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

// App routes rendered only when authenticated
// AppProvider is nested inside RequireAuth so it unmounts on logout, clearing state
function AuthenticatedApp() {
  return (
    <AppProvider>
      <AppShell>
        <ApiStatusBanner />
        <Routes>
          <Route path="/"         element={<Navigate to="/today" replace />} />
          <Route path="/today"    element={<TodayPage />} />
          <Route path="/plans"    element={<PlansPage />} />
          <Route path="/stats"    element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppShell>
    </AppProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <RequireAuth>
              <AuthenticatedApp />
            </RequireAuth>
          } />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

export default App
