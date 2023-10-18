import { supabase } from '../lib/api'
import { FieldType } from '../components/AddKPIModalAndForm/AddKPIModalAndForm'

/* File for all Supabase requests */

/* Supabase request for fetching users */
export const fetchUsers = async () => {
  const { data } = await supabase
    .from('users')
    .select('id, email, role')

  return data && data.map((item) => {
    return { ...item, key: item.id }
  })
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
        circle (id, name)
      `)
    .order('created_at', { ascending: false })

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

/* Supabase request for fetching economists */
export const fetchEconomists = async () => {
  const { data } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('role', 'gatekeeper') // change this in economists - for now we don't have economists and I didn't wanted to have an empty list

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

/* Check if selected range values already exists in supabase
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
        created_at: undefined,
        id: undefined
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

}

