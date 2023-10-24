export type Kpi = {
  id: number | undefined,
  name: string | undefined
  sampleValue: number | undefined
  frequency: string | undefined
  range: string | null | undefined
  circle: string | undefined
  period: string | undefined,
  newValue: number | undefined
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
export enum frequency {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  YEARLY = 'Yearly'
}
export type kpiFromSupabase = {
  id: number,
  name: string,
  sample_value: number,
  frequency: { type: string } | null,
  range: {
    min_value: number | null,
    max_value: number | null,
    display_value: string | null
  } | null,
  circle_kpi: {
    id: number,
    circle: {
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
