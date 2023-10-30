import { ConfigProvider, Spin, Table, Space, Tooltip, Popconfirm } from 'antd'
import {
  deleteKpi,
  fetchKpis,
  fetchSingleKpiWithDescFreq,
} from '../../utils/apiRequests'
import React, { useEffect, useState } from 'react'

import AddKPIModalAndForm from '../../components/AddKPIModalAndForm/AddKPIModalAndForm'
import { useNotifications } from '../../hooks/useNotifications'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { deleteStateKpi, setKpis } from '../../store/kpiSlice'
import { Kpi } from '../../types/types'
import Button from '../../components/Button/Button'
import { DeleteOutlined, EditOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/es/table/Column'
import { FieldType } from '../../components/AddKPIModalAndForm/AddKPIModalAndForm'

const DashboardGatekeeper = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { openNotificationWithIcon, contextHolder }  = useNotifications()
  const [kpisLoading, setKpisLoading] = useState(true)
  const kpis = useSelector((state: RootState) => state.kpis.kpis)
  const dispatch = useDispatch()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const [kpiData, setKpiData] = useState<FieldType | undefined>(undefined)

  const kpisRequest = async () => {
    const { data, error } = await fetchKpis()

    if (error) {
      openNotificationWithIcon(
        'error',
        'Fetch KPIs Error',
        `Error while fetching the KPIs. ${error.message}.`
      )
      return
    }

    if (data) {
      const kpisWithKeyValue = data.map((value) => {
        return {
          key: value.id,
          id: value.id,
          name: value.name,
          sampleValue: value.sample_value,
          frequency: value?.frequency?.type || undefined,
          range: value?.range?.display_value || undefined,
          circle: value?.circle_kpi[0]?.circle?.name || undefined,
          description: value?.description,
          frequency_id: value.frequency_id,
          minValue: value?.range?.min_value,
          maxValue: value?.range?.max_value,
          units: value?.unit_of_measurement,
          period: undefined,
          newValue: undefined
        }
      })

      dispatch(setKpis(kpisWithKeyValue))
      setKpisLoading(false)
    }
  }

  useEffect(() => {
    kpisRequest().then(() => setKpisLoading(false))
  }, [])

  /** Perform Supabase deletion of selected record and then remove the record from state too */
  const deleteRecord =  (record: Kpi) => async () => {
    if (record.id) {
      const { error } = await deleteKpi(record.id)

      if (error) {
        openNotificationWithIcon(
          'error',
          'Delete KPI Error',
          'Error while deleting the KPIs. Please try again later.'
        )

        return
      }

      dispatch(deleteStateKpi(record.id))
      openNotificationWithIcon(
        'success',
        'Success!',
        `You successfully deleted KPI - ${record.name}`
      )
    }

  }

  const editKpi = (record: Kpi) => async () => {
    if (!record.id) return

    setIsModalOpen(true)

    const { kpiData, error } = await fetchSingleKpiWithDescFreq(record.id)

    if (error) {
      openNotificationWithIcon(
        'error',
        'KPI Fetching Error',
        `Error while fetching the KPI ${record.name}. ${error.message}.`
      )

      return
    }

    if (kpiData) {
      setKpiData({
        kpi_id: kpiData[0].id,
        kpi_circle_id: kpiData[0].circle_kpi[0].id,
        circle_id: kpiData[0].circle_kpi[0].circle?.id || 0,
        name: kpiData[0].name,
        sample_value: kpiData[0].sample_value,
        min_value: kpiData[0]?.range?.min_value,
        max_value: kpiData[0].range?.max_value,
        description: kpiData[0].description,
        display_value: kpiData[0].range?.display_value,
        frequency_id: kpiData[0].frequency_id,
        units: kpiData[0].unit_of_measurement
      })
    }
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  if (kpisLoading) {
    return <Spin className='flex justify-center' />
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1FA5A6',
          borderRadius: 2,
          controlHeight: 40
        },
      }}
    >
      { contextHolder }
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <p className='text-4xl font-semibold mr-6'>All KPIs</p>
          <Button text='Add New KPI' btnProps={{ type: 'primary', size: 'small', icon: <PlusOutlined /> }} onClick={showModal}/>
        </div>
        <Button onClick={() => console.log('download')} btnProps={{ size: 'small', icon: <DownloadOutlined /> }} text='Download' />
      </div>

      <AddKPIModalAndForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} initialData={kpiData}/>
      <Table rowSelection={rowSelection} bordered dataSource={kpis}>
        <Column title='Circle' align='center' key='circle' dataIndex='circle'/>
        <Column title='Name' align='center' key='name' dataIndex='name'/>
        <Column title='Sample Value' align='center' key='sampleValue' dataIndex='sampleValue'/>
        <Column title='Frequency' align='center' key='frequency' dataIndex='frequency'/>
        <Column title='Units' align='center' key='units' dataIndex='units'/>
        <Column title='Min Value' align='center' key='minValue' dataIndex='minValue'/>
        <Column title='Max Value' align='center' key='maxValue' dataIndex='maxValue' />
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
                <Button btnProps={{ shape: 'circle', size: 'small', icon: <DeleteOutlined /> }} />
              </Popconfirm>
            </Tooltip>
            <Tooltip title="edit">
              <Button onClick={editKpi(record)} btnProps={{  shape: 'circle', size: 'small', icon: <EditOutlined /> }} />
            </Tooltip>
          </Space>
        )} />
      </Table>
    </ConfigProvider>
  )
}

export default DashboardGatekeeper
