import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route } from 'react-router-dom'

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  defer
} from 'react-router-dom'

// Pages
import Dashboard from './roots/Dashboard/Dashboard'
import Login from './roots/Login/Login'
import ProtectedLayout from './components/ProtectedLayout/ProtectedLayout'
import PublicLayout from './components/PublicLayout/PublicLayout'
import AuthLayout from './components/AuthLayout/AuthLayout'
import Users from './roots/Users/Users'

// this is a fake api to simulate authentication
const getUserData = ()  =>
  new Promise((resolve) =>
    setTimeout(() => {
      const user = window.localStorage.getItem('user')
      resolve(user)
    }, 250)
  )

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthLayout />} loader={() => defer({ userPromise: getUserData() })}
    >
      <Route path="/" element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/" element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
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
    <RouterProvider router={router} />
  </React.StrictMode>
)