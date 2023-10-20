import React, { useState } from 'react'
import { Form, Input, Modal, Select, Button, Space } from 'antd'
import { fetchCircles, fetchUsersByRole, fetchFrequency, getRangeById, addKpi } from '../../utils/apiRequests'
import { useNotifications } from '../../hooks/useNotifications'
import { useDispatch, useSelector } from 'react-redux'
import { addStateKpi, setCircles, setFrequencies } from '../../store/kpiSlice'
import { RootState } from '../../store/store'
import { KpiSupabase, roles } from '../../types/types'

export type FieldType = {
  circle_id: number;
  name: string;
  description?: string;
  sample_value: number;
  min_value: number;
  max_value: number;
  display_value: string;
  frequency_id: number;
  economist?: string
};

interface IAddKPIModalAndForm {
  isModalOpen: boolean,
  setIsModalOpen: (b: boolean) => void
}

interface IEconomistSelectOptions {
  label: string;
  value: string;
}

interface ICircleSelectOptions {
  label: string;
  value: number;
}

interface IFrequencySelectOptions {
  label: string;
  value: number;
}

const AddKPIModalAndForm: React.FC<IAddKPIModalAndForm> = ({ isModalOpen, setIsModalOpen }) => {
  // Select options state
  const [economistsOptions, setEconomistsOptions] = useState<IEconomistSelectOptions[]>([])
  const [circlesOptions, setCirclesOptions] = useState<ICircleSelectOptions[]>([])
  const [frequencyOptions , setFrequencyOptions] = useState<IFrequencySelectOptions[]>([])

  // Loading state
  const [economistsLoading, setEconomistsLoading] = useState(false)
  const [circlesLoading, setCirclesLoading] = useState(false)
  const [frequencyLoading, setFrequencyLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  // Hooks
  const { openNotificationWithIcon, contextHolder }  = useNotifications()
  const dispatch = useDispatch()

  // Selectors
  const frequencies = useSelector((state: RootState) => state.kpis.frequencies)
  const circles = useSelector((state: RootState) => state.kpis.circles)

  /** Function used to fetch the economists when the user focuses on the economists select input */
  const handleEconomistsFocus = async () => {
    setEconomistsLoading(true)

    try {
      const economistsFromSupabase = await fetchUsersByRole(roles.GATEKEEPER) // change to economists
      const economistsSelectOptions: IEconomistSelectOptions[] = []

      if (economistsFromSupabase) {
        for (let i = 0; i < economistsFromSupabase.length; i++) {
          economistsSelectOptions.push({ label: economistsFromSupabase[i].email, value: economistsFromSupabase[i].email })
        }
      }

      setEconomistsOptions(economistsSelectOptions)
      setEconomistsLoading(false)
    } catch (e) {
      openNotificationWithIcon(
        'error',
        'Fetch Economists Error',
        'Error while fetching the economists. Please try again.'
      )
      setEconomistsLoading(false)
    }
  }

  /** Function used to fetch the circles when the user focuses on the circles select input */
  const handleCirclesFocus = async () => {
    setCirclesLoading(true)

    try {
      const circlesFromSupabase = await fetchCircles()
      const circlesSelectOptions: ICircleSelectOptions[] = []

      if (circlesFromSupabase) {
        dispatch(setCircles(circlesFromSupabase))
        for (let i = 0; i < circlesFromSupabase.length; i++) {
          circlesSelectOptions.push({ label: circlesFromSupabase[i].name, value: circlesFromSupabase[i].id })
        }

        setCirclesOptions(circlesSelectOptions)
      }
      setCirclesLoading(false)
    } catch (e) {
      openNotificationWithIcon(
        'error',
        'Fetch Economists Error',
        'Error while fetching the economists. Please try again.'
      )
      setCirclesLoading(false)
    }
  }

  /** Function used to fetch the frequencies when the user focuses on the frequencies select input */
  const handleFrequency = async () => {
    setFrequencyLoading(true)

    try {
      const frequenciesFromSupabase = await fetchFrequency()
      const frequenciesSelectOptions: IFrequencySelectOptions[] = []

      if (frequenciesFromSupabase) {
        dispatch(setFrequencies(frequenciesFromSupabase))

        for (let i = 0; i < frequenciesFromSupabase.length; i++) {
          frequenciesSelectOptions.push({ label: frequenciesFromSupabase[i].type, value: frequenciesFromSupabase[i].id })
        }

        setFrequencyOptions(frequenciesSelectOptions)
      }
      setFrequencyLoading(false)
    } catch (e) {
      openNotificationWithIcon(
        'error',
        'Fetch Economists Error',
        'Error while fetching the economists. Please try again.'
      )
      setCirclesLoading(false)
    }
  }

  /** Function that updates the state of Kpis in order to populate the table with newly added kpi */
  const updateKpiState = async (newKpi: KpiSupabase[], values: FieldType) => {
    const range = await getRangeById(newKpi[0].range_id)
    const frequency = frequencies.filter(frequency => frequency.id === values.frequency_id)
    const circle = circles.filter(circle => circle.id === values.circle_id)

    const stateKpi = {
      id: newKpi[0].id,
      key: newKpi[0].id,
      name: newKpi[0].name,
      sampleValue: newKpi[0].sample_value,
      range: range && range[0].display_value,
      frequency: frequency[0].type,
      circle: circle[0].name
    }

    dispatch(addStateKpi(stateKpi))
  }

  const handleSubmit = async (values: FieldType) => {
    setSubmitLoading(true)
    try {
      const newKpi = await addKpi(values)
      if (newKpi) {
        await updateKpiState(newKpi, values)
      }

      setIsModalOpen(false)

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
        title="New KPI Form"
        okText='Submit KPI'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button loading={submitLoading} type="primary" form="AddKPI" key="submit" htmlType="submit">
            Submit KPI
          </Button>
        ]}
      >
        <Form
          id='AddKPI'
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item<FieldType>
            label="Circle"
            name='circle_id'
            rules={[{ required: true, message: 'Please select the circle!' }]}
          >
            <Select
              onFocus={handleCirclesFocus}
              loading={circlesLoading}
              options={circlesOptions}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="KPI Name"
            name="name"
            rules={[{ required: true, message: 'Please input KPI name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="KPI description"
            name="description"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Frequency"
            name='frequency_id'
            rules={[{ required: true, message: 'Please select the frequency!' }]}
          >
            <Select
              onFocus={handleFrequency}
              loading={frequencyLoading}
              options={frequencyOptions}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Sample Value"
            name="sample_value"
            rules={[{ required: true, message: 'Please input the sample value!' }]}
          >
            <Input type='number' />
          </Form.Item>
          <div style={{ paddingBottom: '12px' }}><strong>Range Inputs:</strong></div>
          <Space direction="horizontal" size="middle">
            <Form.Item<FieldType>
              label="Min Value"
              name="min_value"
              rules={[{ required: true, message: 'Please input the range min val!' }]}
            >
              <Input type='number' />
            </Form.Item>
            <Form.Item<FieldType>
              label="Max Value"
              name="max_value"
              rules={[{ required: true, message: 'Please input the range max val!' }]}
            >
              <Input type='number' />
            </Form.Item>
            <Form.Item<FieldType>
              label="Displayed Value"
              name="display_value"
              rules={[{ required: true, message: 'Please input the displayed value!' }]}
            >
              <Input />
            </Form.Item>
          </Space>
          <Form.Item<FieldType>
            label="Economist"
            name='economist'
            rules={[{ required: true, message: 'Please select the economist!' }]}
          >
            <Select
              onFocus={handleEconomistsFocus}
              loading={economistsLoading}
              options={economistsOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddKPIModalAndForm
