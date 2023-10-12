import { User, Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Button } from 'antd'
import { Auth } from '@supabase/auth-ui-react'
import { supabase } from '../lib/api'
import {
  // Import predefined theme for auth-ui
  ThemeSupa,
} from '@supabase/auth-ui-shared'

const KpiUser: React.FC = () => {
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    const { error } = await supabase.auth.signOut()
  }

  return user ? (
    <div>
      <p>Welcome {user?.email}</p>
      <Button type="primary" onClick={signOut}>
        Sign out
      </Button>
    </div>
  ) : (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google']}
      queryParams={{
        access_type: 'offline',
        prompt: 'consent',
      }}
      onlyThirdPartyProviders
    />
  )
}

export default KpiUser
