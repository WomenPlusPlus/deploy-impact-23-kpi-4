import { supabase } from '../lib/api'
import { FieldType } from '../components/AddKPIModalAndForm/AddKPIModalAndForm'

/* File for all Supabase requests */

/* Supabase request for fetching users */
export const fetchUsers = async () => {
  const { data } = await supabase
    .from('users')
    .select('id, email, role')

  return data
}

/* Supabase request for fetching kpis ordered descending by created_at value */
export const fetchKpis = async () => {
  const { data } = await supabase
    .from('kpi')
    .select(`
        id,
        name,
        sample_value,
        frequency (type),
        range (min_value, max_value, display_value),
        circle!circle_kpi (id, name)
      `)
    .order('created_at', { ascending: false })

  return data
}

/* Supabase request for fetching users with specific role */
export const fetchUsersByRole = async (role: string) => {
  const { data } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('role', role)

  return data
}

/* Supabase request for fetching circles */
export const fetchCircles = async () => {
  const { data } = await supabase
    .from('circle')
    .select('id, name')

  return data
}

/* Supabase request for fetching frequencies */
export const fetchFrequency = async () => {
  const { data } = await supabase
    .from('frequency')
    .select('id, type')

  return data
}

/* Check if selected range values already exist in supabase
*  If yes get the range id, otherwise make a supabase upsert with the new range values and get the id */
const getRangeId = async (minValue: number, maxValue: number, displayValue: string) => {
  let rangeId

  const { data: existingRange } = await supabase
    .from('range')
    .select()
    .eq('min_value', Number(minValue))
    .eq('max_value', Number(maxValue))
    .eq('display_value', displayValue)

  if (existingRange && existingRange.length > 0) {
    rangeId = existingRange[0].id
  } else {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { data: newRange } = await supabase
      .from('range')
      .upsert({
        min_value: Number(minValue),
        max_value: Number(maxValue),
        display_value: displayValue,
      },
      {
        onConflict: ['min_value', 'max_value', 'display_value'],
        ignoreDuplicates: true
      })
      .select()

    rangeId = newRange && newRange[0].id
  }

  return rangeId
}


/* Supabase request for adding circle (circle/kpi relationship) */
const addCircleKpi = async (kpiId: number, circleId: number) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await supabase
    .from('circle_kpi')
    .upsert(
      {
        kpi_id: kpiId,
        circle_id: circleId
      },
      {
        onConflict: ['id', 'kpi_id', 'circle_id'],
        ignoreDuplicates: true
      }
    )
}

/* Supabase request for adding new KPI */
export const addKPI = async (values: FieldType) => {
  const rangeId = await getRangeId(values.min_value, values.max_value, values.display_value)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data: newKpi } = await supabase
    .from('kpi')
    .upsert(
      {
        name: values.name,
        description: values.description,
        sample_value: Number(values.sample_value),
        range_id: rangeId,
        frequency_id: values.frequency_id
      },
      {
        onConflict: 'name',
        ignoreDuplicates: true
      }
    )
    .select()


  if (newKpi) {
    await addCircleKpi(newKpi[0].id, values.circle_id)
  }

  return newKpi
}

/** Supabase request to get a specific range by giving the id as parameter*/
export const getRangeById = async (id: number) => {
  const { data: range } = await supabase
    .from('range')
    .select()
    .eq('id', id)

  return range
}
