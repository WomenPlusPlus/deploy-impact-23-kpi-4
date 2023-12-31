import Column from 'antd/es/table/Column'
import { Spin, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { fetchCompletedKpis } from '../../utils/apiRequests'
import { getDisplayedKpiPeriod } from '../../utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { setCompletedKpis } from '../../store/kpiSlice'
import Button from '../Button/Button'
import { DownloadOutlined, AreaChartOutlined } from '@ant-design/icons'
import { useNotifications } from '../../hooks/useNotifications'

import TableauChartModal from '../TableauDashboards/TableauChartModal'

const CompletedKpisTable = () => {
  const completedKpis = useSelector((state: RootState) => state.kpis.completedKpis)
  const dispatch = useDispatch()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { openNotificationWithIcon, contextHolder }  = useNotifications()
  const [completedKpisLoading, setCompletedKpisLoading] = useState(true)

  const completedKpisRequest = async () => {
    const { completedKpis, error } = await fetchCompletedKpis()

    if (error) {
      openNotificationWithIcon(
        'error',
        'Fetch Completed KPIs Error',
        `Error while fetching completed KPIs. ${error.message}.`
      )

      return
    }

    if (completedKpis) {
      const tableValues = completedKpis.map((item) => {
        return {
          newValue: item.value,
          key: item?.circle_kpi?.kpi?.id,
          id: item?.circle_kpi?.kpi?.id,
          name: item?.circle_kpi?.kpi?.name,
          sampleValue: item?.circle_kpi?.kpi?.sample_value,
          frequency: item?.circle_kpi?.kpi?.frequency?.type,
          range: item?.circle_kpi?.kpi?.range?.display_value,
          minValue: item?.circle_kpi?.kpi?.range?.min_value,
          maxValue: item?.circle_kpi?.kpi?.range?.max_value,
          units: item?.circle_kpi?.kpi?.unit_of_measurement,
          circle: item?.circle_kpi?.circle?.name,
          period: getDisplayedKpiPeriod(
            item?.circle_kpi?.kpi?.frequency?.type,
            item?.kpi_period?.period?.year
          ),
          description: null,
          frequency_id: null,
        }
      })

      dispatch(setCompletedKpis(tableValues))
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  useEffect(() => {
    completedKpisRequest().then(() => setCompletedKpisLoading(false))
  }, [])


  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  if (completedKpisLoading) {
    return <Spin className='flex justify-center' />
  }

  return (
    <div>
      {contextHolder}
      <div className='flex items-center justify-between mt-8'>
        <p className='text-2xl '>KPIs history record</p>
        <div className='flex'>
          <Button onClick={openModal} btnProps={{ size: 'small', icon: <AreaChartOutlined /> }} text='Charts' />
          <TableauChartModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
          <Button onClick={() => console.log('download')} btnProps={{ size: 'small', icon: <DownloadOutlined />, className: 'ml-2' }} text='Download' />
        </div>
      </div>

      <Table rowSelection={rowSelection} bordered dataSource={completedKpis}>
        <Column title='Circle' key='circle' dataIndex='circle'/>
        <Column title='KPI Value' align='right' key='newValue' dataIndex='newValue'/>
        <Column title='Units' key='units' dataIndex='units'/>
        <Column title='KPI Name' key='name' dataIndex='name'/>
        <Column title='Frequency' key='frequency' dataIndex='frequency'/>
        <Column title='Period' key='period' dataIndex='period'/>
      </Table>
    </div>

  )
}

export default CompletedKpisTable
