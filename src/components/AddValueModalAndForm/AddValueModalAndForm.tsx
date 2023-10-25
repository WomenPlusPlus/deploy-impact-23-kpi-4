import React, { useState } from 'react'
import { Form, Input, Modal, Button } from 'antd'
import { useNotifications } from '../../hooks/useNotifications'
import { frequency, kpiFromSupabase } from '../../types/types'
import Info from '../../assets/Info.svg'
import { addNewValue } from '../../utils/apiRequests'
import { useAuth } from '../../hooks/useAuth'
import { getDisplayedKpiPeriod } from '../../utils/utils'
import { addStateCompletedKpi, deleteStateKpi } from '../../store/kpiSlice'
import { useDispatch } from 'react-redux'

export type FieldType = {
  name: string;
};

interface AddValueModalAndForm {
  isModalOpen: boolean,
  setIsModalOpen: (b: boolean) => void,
  record: kpiFromSupabase | null
}

const AddValueModalAndForm: React.FC<AddValueModalAndForm> = ({ isModalOpen, setIsModalOpen, record }) => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const { openNotificationWithIcon, contextHolder }  = useNotifications()
  const  { user } = useAuth()
  const dispatch = useDispatch()

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentQuarter = Math.floor(currentMonth / 3) + 1

  const getPeriodKpiId = () => {
    let periodKpiId
    switch (record?.frequency?.type) {
    case frequency.QUARTERLY:
      periodKpiId = record?.kpi_period.filter(item => item?.period?.quarter === currentQuarter)[0].id
      break
    case frequency.MONTHLY:
      periodKpiId = record?.kpi_period.filter(item => item?.period?.month === currentMonth)[0].id
      break
    case frequency.YEARLY:
      periodKpiId = record?.kpi_period[0].id
    }

    return periodKpiId
  }

  const handleSubmit = async (values: FieldType) => {
    setSubmitLoading(true)
    try {
      setIsModalOpen(false)

      const periodKpiId = getPeriodKpiId()

      if (user && periodKpiId && record) {
        await addNewValue(user.id, periodKpiId, record?.circle_kpi[0].id, Number(values.name))

        // Update the state of completed KPIs with the record which has the new value
        const updatedState = {
          id: record.id,
          name: record.name,
          sampleValue: record.sample_value,
          frequency: record.frequency?.type,
          range: record.range?.display_value,
          circle: record.circle_kpi[0].circle?.name,
          period: getDisplayedKpiPeriod(record.frequency?.type, record.kpi_period[0].period?.year),
          newValue: Number(values.name),
          description: null,
          frequency_id: null
        }
        dispatch(addStateCompletedKpi(updatedState))

        // After adding the record in "history record" table we need to remove it from "KPI to update" table
        dispatch(deleteStateKpi(record.id))
      }

      openNotificationWithIcon(
        'success',
        'KPI Insertion',
        'You successfully added a new KPI!'
      )

      setSubmitLoading(false)
    } catch (e) {
      openNotificationWithIcon(
        'error',
        'KPI Insertion',
        'Error while adding a new KPI. Please try again.'
      )
      setSubmitLoading(false)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div>
      {contextHolder}
      <Modal
        title={`${record?.name} - period`}
        okText='Submit KPI'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button loading={submitLoading} type="primary" form="AddValue" key="submit" htmlType="submit">
            Add Value
          </Button>
        ]}
      >
        <div style={{ marginBottom: '40px' }}>
          <p><strong>KPI name</strong>: {record?.name}</p>
          <p><strong>Circle</strong>: {record?.circle_kpi[0]?.circle?.name}</p>
          <p><strong>Frequency</strong>: {record?.frequency?.type}</p>
          <p><strong>Range</strong>: {record?.range?.display_value}</p>
          <p><strong>Last KPI Value</strong>: ? we don`t have this in db</p>
        </div>
        <Form
          id='AddValue'
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item<FieldType>
            label="New KPI Value"
            name="name"
            rules={[{ required: true, message: 'Please input the new KPI value!' }]}
          >
            <Input type='number' placeholder={`Example: ${String(record?.sample_value)}`} />
          </Form.Item>
        </Form>
        <div className='flex flex-row'>
          <img src={Info} />
          <p className={'ml-2'}>You can see the new added value on the history record table.</p>
        </div>
      </Modal>
    </div>
  )
}

export default AddValueModalAndForm
