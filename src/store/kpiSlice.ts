import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Circle, Frequency, Kpi } from '../types/types'

export interface KpiState {
  kpis: Kpi[],
  frequencies: Frequency[],
  circles: Circle[]
}

const initialState: KpiState = {
  kpis: [],
  frequencies: [],
  circles: []
}

export const kpiSlice = createSlice({
  name: 'kpi',
  initialState,
  reducers: {
    setKpis: (state, action: PayloadAction<Kpi[]>) => {
      state.kpis = action.payload
    },
    addStateKpi: (state, action: PayloadAction<Kpi>) => {
      state.kpis.unshift(action.payload)
    },
    deleteStateKpi: (state, action: PayloadAction<number>) => {
      state.kpis = state.kpis.filter(kpi => kpi.id !== action.payload)
    },
    setFrequencies: (state, action: PayloadAction<Frequency[]>) => {
      state.frequencies = action.payload
    },
    setCircles: (state, action: PayloadAction<Circle[]>) => {
      state.circles = action.payload
    },
  }
})

export const {
  setKpis,
  addStateKpi,
  setFrequencies,
  setCircles,
  deleteStateKpi
} = kpiSlice.actions

export default kpiSlice.reducer