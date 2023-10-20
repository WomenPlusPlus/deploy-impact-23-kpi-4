import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route } from 'react-router-dom'
import { store, persistor } from './store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

// Pages
import DashboardGatekeeper from './roots/Dashboard/DashboardGatekeeper'
import Login from './roots/Login/Login'
import ProtectedLayout from './components/ProtectedLayout/ProtectedLayout'
import PublicLayout from './components/PublicLayout/PublicLayout'
import AuthLayout from './components/AuthLayout/AuthLayout'
import Users from './roots/Users/Users'
import DashboardEconomist from './roots/Dashboard/DashboardEconomist'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/" element={<ProtectedLayout />}>
        <Route path="/dashboard-gatekeeper" element={<DashboardGatekeeper />} />
        <Route path="/dashboard-economist" element={<DashboardEconomist />} />
        <Route path="/users" element={<Users />} />
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)