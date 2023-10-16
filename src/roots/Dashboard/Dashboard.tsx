import { ConfigProvider, Spin, Table, Modal } from 'antd'
import './Dashboard.css'
import Button from '../../components/Button/Button'
import { useEffect, useState } from 'react'
import { fetchKpis } from '../../utils/apiRequests'
import { ColumnsType } from 'antd/es/table'
import KPIForm from '../../components/KPIForm/KPIForm'

export type Kpi = {
  id: number,
  name: string;
  sampleValue: number,
  frequency: string | undefined,
  range: string | undefined,
  circle: string | undefined
}

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


const Dashboard = () => {
  const [kpis, setKpis] = useState<Kpi[] | null>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const kpisRequest = async () => {
      const kpisFromRequest = await fetchKpis()
      setKpis(kpisFromRequest)
    }
    kpisRequest()
  }, [])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }


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
        <Button text='Add New KPI' props={{ type: 'primary' }} onClick={showModal}/>
      </div>
      <Modal title="New KPI Form" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <KPIForm />
      </Modal>
      {
        kpis && kpis.length > 0 ?
          <Table dataSource={kpis} columns={columns} /> : <Spin style={{ display: 'flex', justifyContent: 'center' }} />
      }
    </ConfigProvider>
  )
}

export default Dashboard