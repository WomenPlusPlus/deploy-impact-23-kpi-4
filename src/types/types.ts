export type Kpi = {
  id: number | undefined
  name: string | undefined
  sampleValue: number | undefined
  frequency: string | undefined
  range: string | null | undefined
  circle: string | undefined
  description: string | null
  frequency_id: number | null
  period: string | undefined
  newValue: number | undefined,
  minValue: number | null | undefined,
  maxValue: number | null | undefined,
  units: string | undefined
}

export type KpiSupabase = {
  id: number,
  name: string,
  description: string | null,
  sample_value: number,
  frequency_id: number,
  range_id: number,
  unit_of_measurement: string
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
  email?: string | undefined;
  role?: string | undefined
}
export enum frequency {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  YEARLY = 'Yearly'
}
export type kpiFromSupabase = {
  id: number,
  name: string,
  sample_value: number,
  unit_of_measurement: string,
  frequency: { type: string } | null,
  range: {
    min_value: number | null,
    max_value: number | null,
    display_value: string | null
  } | null,
  circle_kpi: {
    id: number,
    circle: {
      id: number,
      name: string
    } | null
  }[],
  kpi_period: {
    id: number;
    period: {
      year: number;
      month: number | null;
      quarter: number | null;
    } | null; }[],
}
