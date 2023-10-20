import { ConfigProvider, Spin, Table, Space, Tooltip, Popconfirm } from 'antd'
import './Dashboard.css'
import { useEffect, useState } from 'react'
import { deleteKpi, fetchKpis } from '../../utils/apiRequests'
import AddKPIModalAndForm from '../../components/AddKPIModalAndForm/AddKPIModalAndForm'
import { useNotifications } from '../../hooks/useNotifications'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { deleteStateKpi, setKpis } from '../../store/kpiSlice'
import { Kpi } from '../../types/types'
import Button from '../../components/Button/Button'
import { DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons'
import Column from 'antd/es/table/Column'


const DashboardGatekeeper = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { openNotificationWithIcon, contextHolder }  = useNotifications()
  const [kpisLoading, setKpisLoading] = useState(false)
  const kpis = useSelector((state: RootState) => state.kpis.kpis)
  const dispatch = useDispatch()

  useEffect(() => {
    setKpisLoading(true)
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
          setKpisLoading(false)
        }
      }
      kpisRequest()
    } catch (e) {
      setKpisLoading(false)
      openNotificationWithIcon(
        'error',
        'Fetch KPIs Error',
        'Error while fetching the KPIs. Please try again later.'
      )
    }

  }, [])

  /** Perform Supabase deletion of selected record and then remove the record from state too */
  const deleteRecord =  (record: Kpi) => async () => {
    try {
      await deleteKpi(record.id)
      dispatch(deleteStateKpi(record.id))
    } catch (e) {
      openNotificationWithIcon(
        'error',
        'Delete KPI Error',
        'Error while deleting the KPIs. Please try again later.'
      )
    }
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  if (kpisLoading) {
    return <Spin style={{ display: 'flex', justifyContent: 'center' }} />
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
        <Button text='Add New KPI' btnProps={{ type: 'primary' }} onClick={showModal}/>
      </div>
      <AddKPIModalAndForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
      <Table bordered dataSource={kpis}>
        <Column title='Circle' align='center' key='circle' dataIndex='circle'/>
        <Column title='Name' align='center' key='name' dataIndex='name'/>
        <Column title='Sample Value' align='center' key='sampleValue' dataIndex='sampleValue'/>
        <Column title='Frequency' align='center' key='frequency' dataIndex='frequency'/>
        <Column title='Range' align='center' key='range' dataIndex='range'/>
        <Column title='Actions' align='center' key='action' dataIndex='actions' render={(_: any, record: Kpi) => (
          <Space direction="horizontal">
            <Tooltip title="delete">
              <Popconfirm
                title="Delete the KPI"
                description="Are you sure to delete this KPI?"
                onConfirm={deleteRecord(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button btnProps={{ type: 'primary', shape: 'circle', size: 'small', icon: <DeleteOutlined /> }} />
              </Popconfirm>
            </Tooltip>
            <Tooltip title="edit">
              <Button onClick={() => console.log('edit')} btnProps={{ type: 'primary', shape: 'circle', size: 'small', icon: <EditOutlined /> }} />
            </Tooltip>
            <Tooltip title="download">
              <Button onClick={() => console.log('download')} btnProps={{ type: 'primary', shape: 'circle', size: 'small', icon: <DownloadOutlined /> }} />
            </Tooltip>
          </Space>
        )} />
      </Table>
    </ConfigProvider>
  )
}

export default DashboardGatekeeper