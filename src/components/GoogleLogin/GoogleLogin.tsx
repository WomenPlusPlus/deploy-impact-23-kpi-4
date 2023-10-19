import React, { useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { supabase } from '../../lib/api'
import {
  // Import predefined theme for auth-ui
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import { useAuth } from '../../hooks/useAuth'

const GoogleLogin: React.FC = () => {
  const { login } = useAuth()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (login && session?.user) {
        login(session.user)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (login && session?.user) {
        login(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google']}
      queryParams={{
        access_type: 'offline',
        prompt: 'consent',
      }}
      redirectTo={window.location.origin}
      onlyThirdPartyProviders
    />
  )
}

export default GoogleLogin
