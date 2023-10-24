import { ConfigProvider, Spin, Table } from 'antd'
import './Dashboard.css'
import Button from '../../components/Button/Button'
import { useEffect, useState } from 'react'
import { fetchKpis } from '../../utils/apiRequests'
import { useNotifications } from '../../hooks/useNotifications'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { setKpis } from '../../store/kpiSlice'
import { frequency, Kpi } from '../../types/types'
import Time from '../../assets/Time.svg'
import Column from 'antd/es/table/Column'
import AddValueModalAndForm from '../../components/AddValueModalAndForm/AddValueModalAndForm'

const DashboardEconomist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { openNotificationWithIcon, contextHolder }  = useNotifications()
  const [selectedRecord, setSelectedRecord] = useState<Kpi>({
    circle: undefined,
    frequency: undefined,
    id: 0,
    name: '',
    period: undefined,
    range: undefined,
    sampleValue: 0
  })
  const [kpisLoading, setKpisLoading] = useState(false)

  const kpis = useSelector((state: RootState) => state.kpis.kpis)
  const dispatch = useDispatch()

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentQuarter = Math.floor(currentMonth / 3) + 1
  const currentYear = currentDate.getFullYear()

  const getDisplayedKpiPeriod = (value: any) => {
    let displayedPeriod = ''
    switch (value.frequency.type) {
    case frequency.MONTHLY:
      displayedPeriod = `${currentMonth.toString().padStart(2, '0')} / ${value.kpi_period[0].period.year}`
      break
    case frequency.QUARTERLY:
      displayedPeriod = `Q${currentQuarter} / ${value.kpi_period[0].period.year}`
      break
    case frequency.YEARLY:
      displayedPeriod = value.kpi_period[0].period.year.toString()
    }

    return displayedPeriod
  }

  useEffect(() => {
    setKpisLoading(true)
    try {
      const kpisRequest = async () => {
        const kpisFromRequest = await fetchKpis()

        if (kpisFromRequest) {
          // const filteredKpis = filterCurrentKpis(kpisFromRequest)
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
              circle: value?.circle_kpi[0]?.circle?.name || undefined,
              period: getDisplayedKpiPeriod(value)
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

  const showModal = (record: Kpi) => () => {
    setSelectedRecord(record)
    setIsModalOpen(true)
  }

  if (kpisLoading) {
    return  <Spin style={{ display: 'flex', justifyContent: 'center' }} />
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
      <p className='title'>Dashboard</p>
      <p className='subtitle'>Your list of KPIs to which you need to add values</p>
      <div className='info-cards'>
        <div className='card' style={{ backgroundColor: 'rgba(83,111,200, 0.3)', width: 'fit-content', padding: '8px 15px 8px 15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', }}>
            <p><strong>3</strong></p>
            <img src={Time} />
          </div>
          <p>KPI values to update</p>
        </div>
      </div>
      <AddValueModalAndForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} record={selectedRecord} />
      <Table dataSource={kpis}>
        <Column title='Circle' align='center' key='circle' dataIndex='circle'/>
        <Column title='Name' align='center' key='name' dataIndex='name'/>
        <Column title='Sample Value' align='center' key='sampleValue' dataIndex='sampleValue'/>
        <Column title='Frequency' align='center' key='frequency' dataIndex='frequency'/>
        <Column title='Range' align='center' key='range' dataIndex='range'/>
        <Column title='Period' align='center' key='period' dataIndex='period'/>
        <Column title='Actions' align='center' key='actions' dataIndex='action' render={(_: any, record: Kpi) => (
          <Button text='Add Value' btnProps={{ type: 'primary' }} onClick={showModal(record)} />
        )}/>
      </Table>
    </ConfigProvider>
  )
}

export default DashboardEconomist