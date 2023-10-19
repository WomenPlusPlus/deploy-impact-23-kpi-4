import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../../hooks/useAuth'
import { useEffect, useState } from 'react'
import { User } from '@supabase/gotrue-js/src/lib/types'

const AuthLayout = () => {
  const [ user, setUser ] = useState<User | null>(null)

  useEffect(() => {
    const userFromLocalStorage = window.localStorage.getItem('user')
    if (userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage))
    }
  }, [])

  return (
    <AuthProvider userData={user}><Outlet/></AuthProvider>
  )
}

export default AuthLayout