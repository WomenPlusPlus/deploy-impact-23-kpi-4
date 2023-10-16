import { supabase } from '../lib/api'
import { User } from '../types/users.types'

/* File for all Supabase requests */

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role')

  return data && data.map((item: User) => {
    return { ...item, key: item.id }
  })
}
