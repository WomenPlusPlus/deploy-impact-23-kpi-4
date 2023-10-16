import { supabase } from '../lib/api'

/* File for all Supabase requests */

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role')

  return data && data.map((item) => {
    return { ...item, key: item.id }
  })
}

export const fetchKpis = async () => {
  const { data } = await supabase
    .from('kpi')
    .select(`
        id,
        name,
        sample_value,
        frequency (type),
        range (min_value, max_value, display_value),
        circle (id, name)
      `)

  console.log(data)
  return data && data.map((value) => {
    return {
      key: value.id,
      id: value.id,
      name: value.name,
      sampleValue: value.sample_value,
      frequency: value?.frequency?.type || undefined,
      range: value?.range?.display_value || undefined,
      circle: value?.circle[0]?.name || undefined
    }
  })


}