import { createClient } from '@supabase/supabase-js'
import {
  REACT_APP_SUPABASE_URL,
  REACT_APP_SUPABASE_ANON_KEY,
  REACT_APP_SUPABASE_ADMIN_KEY
} from './constants'
import { Database } from '../types/database.types'

/** Client with anon key */
export const supabase = createClient<Database>(
  REACT_APP_SUPABASE_URL as string,
  REACT_APP_SUPABASE_ANON_KEY as string
)

/** Client with a service_role key only used for auth requests */
export const supabaseAdmin = createClient(
  REACT_APP_SUPABASE_URL as string,
  REACT_APP_SUPABASE_ADMIN_KEY as string
)