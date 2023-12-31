import { ConfigProvider, Spin, Table } from 'antd'
import Button from '../../components/Button/Button'
import { useEffect, useState } from 'react'
import { fetchSingleKpi, fetchUncompletedKpis } from '../../utils/apiRequests'
import { useNotifications } from '../../hooks/useNotifications'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { setKpis } from '../../store/kpiSlice'
import { Kpi, kpiFromSupabase } from '../../types/types'
import Column from 'antd/es/table/Column'
import AddValueModalAndForm from '../../components/AddValueModalAndForm/AddValueModalAndForm'
import CompletedKpisTable from '../../components/CompletedKpisTable/CompletedKpisTable'
import { getDisplayedKpiPeriod } from '../../utils/utils'
import { primaryGreen } from '../../utils/theme'

const DashboardEconomist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<kpiFromSupabase | null>(null)
  const [kpisLoading, setKpisLoading] = useState(true)

  const { openNotificationWithIcon, contextHolder }  = useNotifications()

  const kpis = useSelector((state: RootState) => state.kpis.kpis)
  const dispatch = useDispatch()

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentQuarter = Math.floor(currentMonth / 3) + 1
  const currentYear = currentDate.getFullYear()

  const kpisRequest = async () => {
    const { data, error } = await fetchUncompletedKpis()

    if (error) {
      openNotificationWithIcon(
        'error',
        'Fetch KPIs Error',
        `Error while fetching the KPIs. ${error.message}.`
      )
      return
    }

    // Display the kpis only from the current month
    if (data) {
      const filteredData = data.filter(item => {
        // Check if at least one KPI period matches the current month
        return item.kpi_period.some(period => {
          const month = period?.period?.month
          const quarter = period?.period?.quarter
          const year = period?.period?.year
          const frequency = item?.frequency?.type

          if (frequency === 'Monthly') {
            return month === currentMonth
          } else if (frequency === 'Quarterly') {
            return quarter === currentQuarter
          } else if (frequency === 'Yearly') {
            return year === currentYear
          }

          return false
        })
      })

      const kpisWithKeyValue = filteredData.map((value) => {
        return {
          key: value.id,
          id: value.id,
          name: value.name,
          sampleValue: value.sample_value,
          frequency: value?.frequency?.type || undefined,
          range: value?.range?.display_value || undefined,
          minValue: value?.range?.min_value || undefined,
          maxValue: value?.range?.max_value || undefined,
          circle: value?.circle_kpi[0]?.circle?.name || undefined,
          period: getDisplayedKpiPeriod(
            value?.frequency?.type,
            value?.kpi_period[0]?.period?.year
          ),
          newValue: undefined,
          description: null,
          frequency_id: null,
          units: value.unit_of_measurement,
        }
      })

      dispatch(setKpis(kpisWithKeyValue))
    }
  }

  useEffect(() => {
    kpisRequest().then(() => setKpisLoading(false))
  }, [])

  const showModal = (record: Kpi) => async () => {
    setIsModalOpen(true)

    if (record.id) {
      const { kpiData, error } = await fetchSingleKpi(record.id)

      if (error) {
        openNotificationWithIcon(
          'error',
          `Error Fetching KPI ${record}`,
          `${error.message}`
        )
        return
      }

      if (kpiData) {
        setSelectedRecord({
          ...kpiData[0]
        })
      }
    }

  }

  if (kpisLoading) {
    return  <Spin className='flex justify-center' />
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryGreen,
          borderRadius: 2,
          controlHeight: 40
        },
      }}
    >
      { contextHolder }
      <p className='text-4xl font-semibold mr-6'>Dashboard</p>
      <p className='text-2xl'>KPIs to update</p>
      <AddValueModalAndForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        record={selectedRecord}
      />
      <Table bordered dataSource={kpis}>
        <Column title='Circle' key='circle' dataIndex='circle'/>
        <Column title='KPI Name' key='name' dataIndex='name'/>
        <Column title='Frequency'  key='frequency' dataIndex='frequency'/>
        <Column title='Period' key='period' dataIndex='period'/>
        <Column title='Units' key='units' dataIndex='units'/>
        <Column title='Actions' align='center' key='actions' dataIndex='action' render={(_: any, record: Kpi) => (
          <Button text='Add Value' btnProps={{ type: 'primary', size: 'small' }} onClick={showModal(record)} />
        )}/>
      </Table>
      <CompletedKpisTable />
    </ConfigProvider>
  )
}

export default DashboardEconomist