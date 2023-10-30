import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { roleToDashboard } from '../../utils/utils'

const PublicLayout = () => {
  const { user } = useAuth()

  if (user && user.role) {
    return <Navigate to={roleToDashboard[user.role]} />
  }

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default PublicLayout