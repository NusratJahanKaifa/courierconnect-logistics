
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation()
  const token = localStorage.getItem('access_token')
  let user = null
  let tokenExpired = false

  try {
    user = JSON.parse(localStorage.getItem('user') || 'null')

    if (token) {
      const parts = token.split('.')
      if (parts.length !== 3) throw new Error('Invalid token')

      const payloadPart = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(atob(payloadPart))

      tokenExpired = !payload.exp || payload.exp * 1000 <= Date.now()
    }
  } catch {
    user = null
    tokenExpired = true
  }

  if (!token || !user || tokenExpired || !user.role) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')

    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'user') return <Navigate to="/dashboard" replace />
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
