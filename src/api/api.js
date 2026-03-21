import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})

// We store the loader functions here after init
let _show = null
let _hide = null

// Call this once from App.jsx to connect the loader
export const initLoader = (show, hide) => {
  _show = show
  _hide = hide
}

// Attach JWT to every request + show loader
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (_show) _show()
  return config
})

// Hide loader on response or error
api.interceptors.response.use(
  res => {
    if (_hide) _hide()
    return res
  },
  err => {
    if (_hide) _hide()
    // Only redirect on 401 if NOT the login endpoint
    if (err.response?.status === 401 && !err.config.url.includes('/auth/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api