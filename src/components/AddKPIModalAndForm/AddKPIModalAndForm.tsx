import React, { useState, useEffect } from 'react'
import { Form, Input, Modal, Select, Button, Space } from 'antd'
import {
  fetchCircles,
  fetchFrequency,
  getRangeById,
  addKpi,
  updateKpi,
} from '../../utils/apiRequests'
import { useNotifications } from '../../hooks/useNotifications'
import { useDispatch, useSelector } from 'react-redux'
import {
  addStateKpi,
  updateStateKpi,
  setCircles,
  setFrequencies,
} from '../../store/kpiSlice'
import { RootState } from '../../store/store'
import { KpiSupabase } from '../../types/types'

export type FieldType = {
  kpi_id: number
  kpi_circle_id: number
  circle_id: number
  name: string
  description?: string | null | undefined
  sample_value: number
  min_value: number | null | undefined
  max_value: number | null | undefined
  display_value: string | null | undefined
  frequency_id: number
}

interface IAddKPIModalAndForm {
  isModalOpen: boolean
  setIsModalOpen: (b: boolean) => void
  initialData?: FieldType
}

interface ICircleSelectOptions {
  label: string
  value: number
}

interface IFrequencySelectOptions {
  label: string
  value: number
}

const AddKPIModalAndForm: React.FC<IAddKPIModalAndForm> = ({
  isModalOpen,
  setIsModalOpen,
  initialData,
}) => {
  // Select options state
  const [circlesOptions, setCirclesOptions] = useState<ICircleSelectOptions[]>([])
  const [frequencyOptions , setFrequencyOptions] = useState<IFrequencySelectOptions[]>([])

  // Loading state
  const [circlesLoading, setCirclesLoading] = useState(false)
  const [frequencyLoading, setFrequencyLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  // Hooks
  const { openNotificationWithIcon, contextHolder } = useNotifications()
  const dispatch = useDispatch()

  // Selectors
  const frequencies = useSelector((state: RootState) => state.kpis.frequencies)
  const circles = useSelector((state: RootState) => state.kpis.circles)

  const [form] = Form.useForm()

  useEffect(() => {
    const getCircleOptions = async () => {
      const circlesFromSupabase = await fetchCircles()
      const circlesSelectOptions: ICircleSelectOptions[] = []
      if (circlesFromSupabase) {
        dispatch(setCircles(circlesFromSupabase))
        for (let i = 0; i < circlesFromSupabase.length; i++) {
          circlesSelectOptions.push({
            label: circlesFromSupabase[i].name,
            value: circlesFromSupabase[i].id,
          })
        }

        setCirclesOptions(circlesSelectOptions)
      }
    }

    getCircleOptions()
  }, [])

  useEffect(() => {
    const getFrequencyOptions = async () => {
      const frequenciesFromSupabase = await fetchFrequency()
      const frequenciesSelectOptions: IFrequencySelectOptions[] = []
      if (frequenciesFromSupabase) {
        dispatch(setFrequencies(frequenciesFromSupabase))
        for (let i = 0; i < frequenciesFromSupabase.length; i++) {
          frequenciesSelectOptions.push({
            label: frequenciesFromSupabase[i].type,
            value: frequenciesFromSupabase[i].id,
          })
        }

        setFrequencyOptions(frequenciesSelectOptions)
      }
    }

    getFrequencyOptions()
  }, [])

  useEffect(() => {
    form.setFieldsValue(initialData)
  }, [initialData])


  /** Function that updates the state of Kpis in order to populate the table with newly added kpi */
  const updateKpiState = async (
    kpi: KpiSupabase[],
    values: FieldType,
    existingKpi = false
  ) => {
    const range = await getRangeById(kpi[0].range_id)
    const frequency = frequencies.filter(
      (frequency) => frequency.id === values.frequency_id
    )
    const circle = circles.filter((circle) => circle.id === values.circle_id)

    const stateKpi = {
      id: kpi[0].id,
      key: kpi[0].id,
      name: kpi[0].name,
      sampleValue: kpi[0].sample_value,
      range: range && range[0].display_value,
      frequency: frequency[0].type,
      circle: circle[0].name,
      frequency_id: kpi[0].frequency_id,
      description: kpi[0].description,
      minValue: range && range[0].min_value,
      maxValue: range && range[0].max_value,
      period: undefined,
      newValue: undefined,
    }

    if (existingKpi) dispatch(updateStateKpi(stateKpi))
    else dispatch(addStateKpi(stateKpi))
  }

  const handleSubmit = async (values: FieldType) => {
    setSubmitLoading(true)
    const isEditMode = values.kpi_id ? true : false
    try {
      if (isEditMode) {
        const kpiData = await updateKpi(values)
        if (kpiData) {
          await updateKpiState([kpiData], values, true)
        }
      } else {
        const newKpi = await addKpi(values)
        if (newKpi) {
          await updateKpiState([newKpi], values)
        }
      }

      setIsModalOpen(false)

      openNotificationWithIcon(
        'success',
        isEditMode ? 'KPI Update' : 'KPI Insertion',
        isEditMode
          ? 'You successfully saved KPI !' + values.kpi_id
          : 'You successfully added a new KPI!'
      )
    }
    catch (e) {
      openNotificationWithIcon(
        'error',
        isEditMode? 'KPI Update' : 'KPI Insertion',
        'Error while updating/adding a new KPI. Please try again.'
      )
    }
    setSubmitLoading(false)
    resetForm()
  }

  const resetForm = () => {
    form.setFieldsValue({
      kpi_id: undefined,
      circle_id: undefined,
      name: '',
      description: '',
      frequency_id: undefined,
      sample_value: undefined,
      min_value: undefined,
      max_value: undefined,
      display_value: undefined,
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    resetForm()
  }

  return (
    <div>
      {contextHolder}
      <Modal
        title={
          initialData?.kpi_id
            ? 'Editing KPI ' + initialData.kpi_id
            : 'New KPI Form'
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            loading={submitLoading}
            type="primary"
            form="AddKPI"
            key="submit"
            htmlType="submit"
          >
            {initialData?.kpi_id ? 'Save KPI' : 'Submit KPI'}
          </Button>,
        ]}
      >
        <Form
          form={form}
          id="AddKPI"
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialData}
        >
          <Form.Item<FieldType> name="kpi_id" hidden={true}></Form.Item>
          <Form.Item<FieldType> name="kpi_circle_id" hidden={true}></Form.Item>
          <Form.Item<FieldType>
            label="Circle"
            name="circle_id"
            rules={[{ required: true, message: 'Please select the circle!' }]}
          >
            <Select options={circlesOptions} />
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
            name="frequency_id"
            rules={[
              { required: true, message: 'Please select the frequency!' },
            ]}
          >
            <Select options={frequencyOptions} />
          </Form.Item>
          <Space direction="horizontal" size="middle">
            <Form.Item<FieldType>
              label="Min Value"
              name="min_value"
              rules={[
                { required: true, message: 'Please input the range min val!' },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item<FieldType>
              label="Max Value"
              name="max_value"
              rules={[
                { required: true, message: 'Please input the range max val!' },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item<FieldType>
              label="Sample Value"
              name="sample_value"
              rules={[{ required: true, message: 'Please input the sample value!' }]}
            >
              <Input type='number' />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  )
}

export default AddKPIModalAndForm
