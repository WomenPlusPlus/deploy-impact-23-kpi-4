import { ConfigProvider, Spin, Table } from 'antd'
import './Dashboard.css'
import Button from '../../components/Button/Button'
import { useEffect, useState } from 'react'
import { fetchKpis } from '../../utils/apiRequests'
import { ColumnsType } from 'antd/es/table'

export type Kpi = {
  id: number,
  name: string;
  sampleValue: number,
  frequency: string | undefined,
  range: string | undefined,
  circle: number | undefined
}

const Dashboard = () => {
  const [kpis, setKpis] = useState<Kpi[] | null>([])

  useEffect(() => {
    const kpisRequest = async () => {
      const kpisFromRequest = await fetchKpis()
      setKpis(kpisFromRequest)
    }
    kpisRequest()
  }, [])


  const columns: ColumnsType<Kpi> = [
    {
      title: 'Circle',
      dataIndex: 'circle',
      key: 'circle',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Sample Value',
      dataIndex: 'sampleValue',
      key: 'sampleValue',
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
    },
    {
      title: 'Range',
      dataIndex: 'range',
      key: 'range',
    },
  ]

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
      {
        kpis && kpis.length > 0 ?
          <Table dataSource={kpis} columns={columns} /> : <Spin style={{ display: 'flex', justifyContent: 'center' }} />
      }
    </ConfigProvider>
  )
}

export default Dashboard