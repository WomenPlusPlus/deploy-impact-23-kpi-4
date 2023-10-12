import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const PublicLayout = () => {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default PublicLayout