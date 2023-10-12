import { createClient } from '@supabase/supabase-js'
import {
  REACT_APP_SUPABASE_URL,
  REACT_APP_SUPABASE_ANON_KEY,
} from './constants'

export const supabase = createClient(
  REACT_APP_SUPABASE_URL as string,
  REACT_APP_SUPABASE_ANON_KEY as string
)
