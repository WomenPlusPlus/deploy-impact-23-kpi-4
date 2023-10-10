import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

// Pages
import Root from './roots/Root'
import Login from './roots/Login/Login'

// Todo : layout + authentication flow

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <Root />,
  },
  {
    path: '/login',
    element: <Login />
  }
])


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)