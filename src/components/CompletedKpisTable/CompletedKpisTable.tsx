import Column from 'antd/es/table/Column'
import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { fetchCompletedKpis } from '../../utils/apiRequests'
import { getDisplayedKpiPeriod } from '../../utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { setCompletedKpis } from '../../store/kpiSlice'
import Button from '../Button/Button'
import { DownloadOutlined, AreaChartOutlined } from '@ant-design/icons'

const CompletedKpisTable = () => {
  const completedKpis = useSelector((state: RootState) => state.kpis.completedKpis)
  const dispatch = useDispatch()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  useEffect(() => {
    try {
      const completedKpisRequest = async () => {
        const kpisFromSupabase = await fetchCompletedKpis()

        if (kpisFromSupabase) {
          const tableValues = kpisFromSupabase.map((item) => {
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
      completedKpisRequest()
    } catch (error) {
      console.log(error)
    }
  }, [])


  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <div>
      <div className='flex items-center justify-between mt-8'>
        <p className='text-2xl '>KPIs history record</p>
        <div className='flex'>
          <Button onClick={() => console.log('charts')} btnProps={{ size: 'small', icon: <AreaChartOutlined /> }} text='Charts' />
          <Button onClick={() => console.log('download')} btnProps={{ size: 'small', icon: <DownloadOutlined />, className: 'ml-2' }} text='Download' />
        </div>
      </div>

      <Table rowSelection={rowSelection} bordered dataSource={completedKpis}>
        <Column title='Circle' align='center' key='circle' dataIndex='circle'/>
        <Column title='New Value' align='center' key='newValue' dataIndex='newValue'/>
        <Column title='Name' align='center' key='name' dataIndex='name'/>
        <Column title='Sample Value' align='center' key='sampleValue' dataIndex='sampleValue'/>
        <Column title='Frequency' align='center' key='frequency' dataIndex='frequency'/>
        <Column title='Period' align='center' key='period' dataIndex='period'/>
      </Table>
    </div>

  )
}

export default CompletedKpisTable
