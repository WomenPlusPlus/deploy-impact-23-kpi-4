import { supabase, supabaseAdmin } from '../lib/api'
import { FieldType } from '../components/AddKPIModalAndForm/AddKPIModalAndForm'
import { roles } from '../types/types'

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
  const { data, error } = await supabase
    .from('kpi')
    .select(`
        id,
        name,
        sample_value,
        frequency (type),
        range (min_value, max_value, display_value),
        circle_kpi (id, circle(name)),
        description,
        frequency_id,
        kpi_period (id, completed,  period( year, month, quarter))
      `)
    .order('created_at', { ascending: false })

  console.log(data)
  return data
}

export const fetchUncompletedKpis = async () => {
  const { data, error } = await supabase
    .from('kpi')
    .select(`
        id,
        name,
        sample_value,
        frequency (type),
        range (min_value, max_value, display_value),
        circle_kpi (id, circle(name)),
        kpi_period (id, completed,  period( year, month, quarter))
      `)
    .eq('kpi_period.completed', false)
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
const getRangeId = async (
  minValue: number | null | undefined,
  maxValue: number | null | undefined,
  displayValue: string | null | undefined
) => {
  let rangeId

  const { data: existingRange } = await supabase
    .from('range')
    .select()
    .eq('min_value', Number(minValue))
    .eq('max_value', Number(maxValue))
    .eq('display_value', displayValue || '')

  if (existingRange && existingRange.length > 0) {
    rangeId = existingRange[0].id
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { data: newRange } = await supabase
      .from('range')
      .upsert(
        {
          min_value: Number(minValue),
          max_value: Number(maxValue),
          display_value: displayValue,
        },
        {
          onConflict: ['min_value', 'max_value', 'display_value'],
          ignoreDuplicates: true,
        }
      )
      .select()

    rangeId = newRange && newRange[0].id
  }

  return rangeId
}

const getFrequencyId = async (
  type: string
) => {
  let frequencyId

  const { data: existingFrequency } = await supabase
    .from('frequency')
    .select('id')
    .eq('type', type)
    .maybeSingle()

  if (existingFrequency) return existingFrequency

  const { data: newFrequency } = await supabase
    .from('frequency')
    .upsert(
      {
        type: type,
      },
      {
        ignoreDuplicates: true,
      }
    )
    .select()

  return frequencyId
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
        onConflict: ['kpi_id', 'circle_id'],
        ignoreDuplicates: true
      }
    )
}

const updateCircleKpi = async(kpiCircleId: number, kpiId: number, circleId: number) => {
  const { data: kpiCircleData } = await supabase
    .from('circle_kpi')
    .update({
      kpi_id: kpiId,
      circle_id: circleId,
    })
    .eq('id', kpiCircleId)
    .select()
    .maybeSingle()

  return kpiCircleData
}

/* Supabase request for adding new KPI */
export const addKpi = async (values: FieldType) => {
  let rangeId
  if (values.min_value && values.max_value && values.display_value) {
    rangeId = await getRangeId(values.min_value, values.max_value, values.display_value)
  }

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
    .maybeSingle()


  if (newKpi) {
    await addCircleKpi(newKpi.id, values.circle_id)
  }

  return newKpi
}

export const updateKpi = async (values: FieldType) => {
  // KPI data available from user selected KPI
  const rangeId = await getRangeId(values.min_value, values.max_value, values.display_value)
  // let frequency_id = await getFrequencyId()

  // update KPI
  const { data: kpiData, error: kpiError } = await supabase
    .from('kpi')
    .update({
      name: values.name,
      sample_value: values.sample_value,
      description: values.description,
      range_id: rangeId || 0,
      frequency_id: values.frequency_id,
    })
    .eq('id', values.kpi_id)
    .select()
    .maybeSingle()

  const kpiCircleData = await updateCircleKpi(
    values.kpi_circle_id,
    values.kpi_id,
    values.circle_id)

  return kpiData
}

/** Supabase request to get a specific range by giving the id as parameter*/
export const getRangeById = async (id: number) => {
  const { data } = await supabase
    .from('range')
    .select()
    .eq('id', id)

  return data
}

/** Supabase request to  delete a KPI */
export const deleteKpi = async (id: number) => {
  await supabase
    .from('kpi')
    .delete()
    .eq('id', id)
}

/** Supabase request to change the role of a user
 * For this functionality we needed a different supabase client with a service_role key*/
export const changeUserRole = async(role: string, id: string) => {
  const adminAuthClient = supabaseAdmin.auth.admin
  const { data: user, error } = await adminAuthClient.updateUserById(
    id,
    { role: role }
  )

  return {
    data: user.user,
    error
  }
}

/** Supabase request for adding new value to a KPI (by economist) */
export const addNewValue = async (userId: string, periodId: number, circleId: number, value: number) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data: auditData, error: auditError } = await supabase
    .from('audit')
    .upsert({
      user_id: userId,    // should be authenticated user
      kpi_period_id: periodId,
      circle_kpi_id: circleId,
      value: value
    })
    .select()
}

/** Supabase request for fetching just a single a KPI by id */
export const fetchSingleKpi = async (id: number) => {
  const { data, error } = await supabase
    .from('kpi')
    .select(
      `
        id,
        name,
        sample_value,
        frequency (type),
        range (min_value, max_value, display_value),
        circle_kpi (id, circle(id, name)),
        kpi_period (id, completed, period( year, month, quarter))
      `
    )
    .eq('id', id)

  return data
}

/** Supabase request for fetching just a single a KPI by id */
export const fetchSingleKpiWithDescFreq = async (id: number) => {
  const { data, error } = await supabase
    .from('kpi')
    .select(
      `
        id,
        name,
        sample_value,
        frequency (type),
        range (min_value, max_value, display_value),
        circle_kpi (id, circle(id, name)),
        kpi_period (id, completed, period( year, month, quarter)),
        description,
        frequency_id
      `
    )
    .eq('id', id)

  return data
}

/** Supabase request for fetching the kpis that have value (economists added value to them) */
export const fetchCompletedKpis = async () => {
  const { data, error: auditError } = await supabase
    .from('audit')
    .select(`
      value,
      circle_kpi (id, circle(id, name), kpi (id, name, sample_value, frequency(type), range(display_value))),
      kpi_period (id, completed, period( year, month, quarter))
    `)

  return data
}
