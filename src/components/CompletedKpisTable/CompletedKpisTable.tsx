import Column from 'antd/es/table/Column'
import { Table } from 'antd'
import { useEffect } from 'react'
import { fetchCompletedKpis } from '../../utils/apiRequests'
import { getDisplayedKpiPeriod } from '../../utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { setCompletedKpis } from '../../store/kpiSlice'

const CompletedKpisTable = () => {
  const completedKpis = useSelector((state: RootState) => state.kpis.completedKpis)
  const dispatch = useDispatch()

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

  return (
    <Table dataSource={completedKpis}>
      <Column title='Circle' align='center' key='circle' dataIndex='circle'/>
      <Column title='New Value' align='center' key='newValue' dataIndex='newValue'/>
      <Column title='Name' align='center' key='name' dataIndex='name'/>
      <Column title='Sample Value' align='center' key='sampleValue' dataIndex='sampleValue'/>
      <Column title='Frequency' align='center' key='frequency' dataIndex='frequency'/>
      <Column title='Range' align='center' key='range' dataIndex='range'/>
      <Column title='Period' align='center' key='period' dataIndex='period'/>
    </Table>
  )
}

export default CompletedKpisTable
