import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { roles } from '../../types/types'
import { isEconomist, isGatekeeper } from '../../utils/utils'

const PublicLayout = () => {
  const { user } = useAuth()

  if (user) {
    if (isGatekeeper(user.role)) {
      return <Navigate to="/dashboard-gatekeeper" />
    } else if (isEconomist(user.role)) {
      return <Navigate to="/dashboard-economist" />
    }
  }

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default PublicLayout