export type Kpi = {
  id: number,
  name: string;
  sampleValue: number,
  frequency: string | undefined,
  range: string | null | undefined,
  circle: string | undefined,
  description: string | null,
  frequency_id: number | null
}

export type KpiSupabase = {
  id: number,
  name: string,
  description: string | null,
  sample_value: number,
  frequency_id: number,
  range_id: number
}

export type Frequency = {
  id: number,
  type: string
}

export type Circle = {
  id: number,
  name: string
}

export enum roles {
  GATEKEEPER = 'gatekeeper',
  ECONOMIST = 'economist'
}

export type User = {
  id: string,
  email: string;
  role: string
}
