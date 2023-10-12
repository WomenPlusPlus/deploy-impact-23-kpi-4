import { ConfigProvider } from 'antd'
import './Dashboard.css'
import Button from '../../components/Button/Button'

const Dashboard = () => {
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
      <div className='title-button'>
        <p className='title'>All KPIs</p>
        <Button text='Add New KPI' props={{ type: 'primary' }} />
      </div>
    </ConfigProvider>
  )
}

export default Dashboard