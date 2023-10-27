import { ConfigProvider, Spin, Table } from 'antd'
import './Dashboard.css'
import Button from '../../components/Button/Button'
import React, { useEffect, useState } from 'react'
import { fetchSingleKpi, fetchUncompletedKpis } from '../../utils/apiRequests'
import { useNotifications } from '../../hooks/useNotifications'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { setKpis } from '../../store/kpiSlice'
import { Kpi, kpiFromSupabase } from '../../types/types'
import Time from '../../assets/Time.svg'
import Column from 'antd/es/table/Column'
import AddValueModalAndForm from '../../components/AddValueModalAndForm/AddValueModalAndForm'
import CompletedKpisTable from '../../components/CompletedKpisTable/CompletedKpisTable'
import { getDisplayedKpiPeriod } from '../../utils/utils'

const DashboardEconomist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { openNotificationWithIcon, contextHolder }  = useNotifications()
  const [selectedRecord, setSelectedRecord] = useState<kpiFromSupabase | null>(null)
  const [kpisLoading, setKpisLoading] = useState(false)

  const kpis = useSelector((state: RootState) => state.kpis.kpis)
  const dispatch = useDispatch()

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentQuarter = Math.floor(currentMonth / 3) + 1
  const currentYear = currentDate.getFullYear()

  useEffect(() => {
    setKpisLoading(true)
    try {
      const kpisRequest = async () => {
        const kpisFromRequest = await fetchUncompletedKpis()

        // Display the kpis only from the current month
        if (kpisFromRequest) {
          const filteredData = kpisFromRequest.filter(item => {
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
            }
          })
          dispatch(setKpis(kpisWithKeyValue))
        }
        setKpisLoading(false)
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

  const showModal = (record: Kpi) => async () => {
    if (record.id) {
      const fetchedKpi = await fetchSingleKpi(record.id)
      if (fetchedKpi) {
        setSelectedRecord({
          ...fetchedKpi[0]
        })
      }
    }

    setIsModalOpen(true)
  }

  if (kpisLoading) {
    return  <Spin style={{ display: 'flex', justifyContent: 'center' }} />
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
      <p className='text-4xl font-semibold mr-6'>Dashboard</p>
      <p className='text-2xl'>KPIs to update</p>
      <AddValueModalAndForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} record={selectedRecord} />
      <Table bordered dataSource={kpis}>
        <Column title='Circle' align='center' key='circle' dataIndex='circle'/>
        <Column title='Name' align='center' key='name' dataIndex='name'/>
        <Column title='Sample Value' align='center' key='sampleValue' dataIndex='sampleValue'/>
        <Column title='Frequency' align='center' key='frequency' dataIndex='frequency'/>
        <Column title='Period' align='center' key='period' dataIndex='period'/>
        <Column title='Actions' align='center' key='actions' dataIndex='action' render={(_: any, record: Kpi) => (
          <Button text='Add Value' btnProps={{ type: 'primary' }} onClick={showModal(record)} />
        )}/>
      </Table>
      <CompletedKpisTable />
    </ConfigProvider>
  )
}

export default DashboardEconomist
