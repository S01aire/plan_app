const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Module-level token ref — avoids circular dep with AuthContext
let _token = null
export function setApiToken(token) { _token = token }
export function clearApiToken()    { _token = null }

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  if (_token) headers['Authorization'] = `Bearer ${_token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => ({ error: res.statusText }))
  if (!res.ok) {
    const err = new Error(data.error || '请求失败')
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  // Auth
  register: (username, password) =>
    request('POST', '/api/auth/register', { username, password }),
  login: (username, password) =>
    request('POST', '/api/auth/login', { username, password }),

  // Plans
  getPlans:   ()     => request('GET',    '/api/plans'),
  createPlan: (data) => request('POST',   '/api/plans', data),
  updatePlan: (data) => request('PUT',    `/api/plans/${data.id}`, data),
  deletePlan: (id)   => request('DELETE', `/api/plans/${id}`),

  // Check-ins
  getCheckIns:    (since) => request('GET',    `/api/checkins${since ? `?since=${since}` : ''}`),
  createCheckIn:  (data)  => request('POST',   '/api/checkins', data),
  deleteCheckIn:  (planId, date) => request('DELETE', `/api/checkins?planId=${planId}&date=${date}`),
}
