import { ConfigProvider, Spin, Table } from 'antd'
import './Dashboard.css'
import Button from '../../components/Button/Button'
import { useEffect, useState } from 'react'
import { fetchKpis } from '../../utils/apiRequests'
import { ColumnsType } from 'antd/es/table'
import AddKPIModalAndForm from '../../components/AddKPIModalAndForm/AddKPIModalAndForm'
import { useNotifications } from '../../hooks/useNotifications'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { setKpis } from '../../store/kpiSlice'
import { Kpi, KpiSupabase } from '../../types/types'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { openNotificationWithIcon, contextHolder }  = useNotifications()

  const kpis = useSelector((state: RootState) => state.kpis.kpis)
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const kpisRequest = async () => {
        const kpisFromRequest = await fetchKpis()

        if (kpisFromRequest) {
          const kpisWithKeyValue = kpisFromRequest.map((value) => {
            return {
              key: value.id,
              id: value.id,
              name: value.name,
              sampleValue: value.sample_value,
              frequency: value?.frequency?.type || undefined,
              range: value?.range?.display_value || undefined,
              circle: value?.circle_kpi[0]?.circle?.name || undefined
            }
          })

          dispatch(setKpis(kpisWithKeyValue))
        }
      }
      kpisRequest()
    } catch (e) {
      openNotificationWithIcon(
        'error',
        'Fetch KPIs Error',
        'Error while fetching the KPIs. Please try again later.'
      )
    }

  }, [])

  const showModal = () => {
    setIsModalOpen(true)
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
      { contextHolder }
      <div className='title-button'>
        <p className='title'>All KPIs</p>
        <Button text='Add New KPI' props={{ type: 'primary' }} onClick={showModal}/>
      </div>
      <AddKPIModalAndForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
      {
        kpis && kpis.length > 0 ?
          <Table dataSource={kpis} columns={columns} /> : <Spin style={{ display: 'flex', justifyContent: 'center' }} />
      }
    </ConfigProvider>
  )
}

export default Dashboard