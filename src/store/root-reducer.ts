import { combineReducers } from 'redux'
import kpiReducer from './kpiSlice'
export const rootReducer = combineReducers({
  kpis: kpiReducer
})