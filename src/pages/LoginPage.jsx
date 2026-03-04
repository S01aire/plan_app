import { useState } from 'react'
import { useAuth } from '../store/AuthContext'

export function LoginPage() {
  const { login, register, authLoading, authError, clearAuthError } = useAuth()
  const [mode,     setMode]     = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (mode === 'login') await login(username, password)
      else                  await register(username, password)
      // On success token is set → App re-renders to authenticated view
    } catch {
      // Error displayed via authError
    }
  }

  function switchMode() {
    setMode(m => m === 'login' ? 'register' : 'login')
    clearAuthError()
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-warm p-8 animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📋</div>
          <h1 className="text-xl font-bold text-text-primary">打卡计划</h1>
          <p className="text-xs text-text-light mt-1">坚持每一天，记录你的成长</p>
        </div>

        {/* Tab */}
        <div className="flex bg-warm-50 rounded-2xl p-1 mb-6">
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); clearAuthError() }}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer border-none ${
                mode === m ? 'bg-white text-text-primary shadow-warm-sm' : 'bg-transparent text-text-light'
              }`}
            >
              {m === 'login' ? '登录' : '注册'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="section-title block">用户名</label>
            <input
              className="input-field"
              placeholder="请输入用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
              minLength={3}
            />
          </div>
          <div>
            <label className="section-title block">密码</label>
            <input
              type="password"
              className="input-field"
              placeholder={mode === 'register' ? '至少6位' : '请输入密码'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
            />
          </div>

          {authError && (
            <div className="text-xs text-coral bg-red-50 px-3 py-2 rounded-xl">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading || !username || !password}
            className="btn-primary w-full text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {authLoading ? '处理中...' : mode === 'login' ? '登 录' : '注 册'}
          </button>
        </form>

        <p className="text-center text-xs text-text-light mt-6">
          数据存储在服务器，跨设备同步 🌐
        </p>
      </div>
    </div>
  )
}
