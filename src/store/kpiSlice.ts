import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Circle, Frequency, Kpi } from '../types/types'

export interface KpiState {
  kpis: Kpi[],
  frequencies: Frequency[],
  circles: Circle[],
  completedKpis: Kpi[]
}

const initialState: KpiState = {
  kpis: [],
  completedKpis: [],
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
    updateStateKpi: (state, action: PayloadAction<Kpi>) => {
      state.kpis = state.kpis.map((kpi) => {
        if (kpi.id === action.payload.id) {
          return {
            ...kpi,
            ...action.payload,
          }
        }
        return kpi
      })
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
    setCompletedKpis: (state, action: PayloadAction<Kpi[]>) => {
      state.completedKpis = action.payload
    },
    addStateCompletedKpi: (state, action: PayloadAction<Kpi>) => {
      state.completedKpis.unshift(action.payload)
    },
  }
})

export const {
  setKpis,
  addStateKpi,
  updateStateKpi,
  setFrequencies,
  setCircles,
  deleteStateKpi,
  setCompletedKpis,
  addStateCompletedKpi
} = kpiSlice.actions

export default kpiSlice.reducer
