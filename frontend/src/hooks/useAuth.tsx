import React, { createContext, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from './useLocalStorage'

export type ContextType = {
    user?: object | null;
    login?: (data: object) => void;
    logout?: () => void;
}

const AuthContext = createContext<ContextType>({})

type Props = {
    userData: object | null,
    children: React.ReactNode
}

export const AuthProvider: React.FC<Props>  = ({ userData, children }) => {
  const [user, setUser] = useLocalStorage('user', userData)
  const navigate = useNavigate()

  const login = (data: object) => {
    setUser(data)
    navigate('/dashboard')
  }

  const logout = () => {
    setUser(null)
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
