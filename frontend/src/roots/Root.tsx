import { ConfigProvider } from 'antd'

const Root = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FECC33',
          borderRadius: 2,
          controlHeight: 40
        },
      }}
    >
      <p>Dashboard</p>
    </ConfigProvider>
  )
}

export default Root