import React, { createContext, useContext, useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useLocalStorage } from './useLocalStorage'
import { supabase } from '../lib/api'
import { User } from '@supabase/gotrue-js/src/lib/types'
import { roleToDashboard } from '../utils/utils'

export type ContextType = {
    user?: User | null;
    login?: (data: User) => void;
    logout?: () => void;
}

const AuthContext = createContext<ContextType>({})

type Props = {
    userData: User | null,
    children: React.ReactNode
}

export const AuthProvider: React.FC<Props>  = ({ userData, children }) => {
  const [user, setUser] = useLocalStorage('user', userData)
  const navigate = useNavigate()

  const login = (data: User) => {
    setUser(data)

    if (data.role) {
      return <Navigate to={roleToDashboard[data.role]} />
    }
  }

  const logout = async () => {
    setUser(null)
    await supabase.auth.signOut()
    navigate('/login')
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
