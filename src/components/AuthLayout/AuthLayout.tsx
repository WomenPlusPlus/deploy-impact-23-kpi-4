import { useLoaderData, Outlet, Await } from 'react-router-dom'
import { AuthProvider } from '../../hooks/useAuth'
import { Suspense } from 'react'
import { Spin, Alert } from 'antd'
const AuthLayout = () => {

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { userPromise } = useLoaderData()

  return (
    <Suspense fallback={<Spin />}>
      <Await
        resolve={userPromise}
        errorElement={<Alert type="error" message="Something went wrong" />}
      >
        {(user) => {
          return  <AuthProvider userData={user}><Outlet/></AuthProvider>
        }}
      </Await>
    </Suspense>
  )
}

export default AuthLayout