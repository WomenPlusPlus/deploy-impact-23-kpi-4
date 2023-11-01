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
import SubmitButton from '../Button/SubmitButton'

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
  frequency_id: number,
  units: string;
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
  // Local states
  const [circlesOptions, setCirclesOptions] = useState<ICircleSelectOptions[]>([])
  const [frequencyOptions , setFrequencyOptions] = useState<IFrequencySelectOptions[]>([])
  const [localInitialData, setLocalInitialData] = useState(initialData)

  // Loading state
  const [submitLoading, setSubmitLoading] = useState(false)

  // Hooks
  const { openNotificationWithIcon, contextHolder } = useNotifications()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  // Selectors
  const frequencies = useSelector((state: RootState) => state.kpis.frequencies)
  const circles = useSelector((state: RootState) => state.kpis.circles)

  const getCircleOptions = async () => {
    const { circlesData, error } = await fetchCircles()

    if (error) {
      openNotificationWithIcon(
        'error',
        'Circles Error',
        `Error while fetching circles. ${error.message}.`
      )
      return
    }

    const circlesSelectOptions: ICircleSelectOptions[] = []

    if (circlesData) {
      dispatch(setCircles(circlesData))

      for (let i = 0; i < circlesData.length; i++) {
        circlesSelectOptions.push({
          label: circlesData[i].name,
          value: circlesData[i].id,
        })
      }

      setCirclesOptions(circlesSelectOptions)
    }
  }

  const getFrequencyOptions = async () => {
    const { frequencyData, error } = await fetchFrequency()

    if (error) {
      openNotificationWithIcon(
        'error',
        'Circles Error',
        `Error while fetching circles. ${error.message}.`
      )
      return
    }

    const frequenciesSelectOptions: IFrequencySelectOptions[] = []
    if (frequencyData) {
      dispatch(setFrequencies(frequencyData))

      for (let i = 0; i < frequencyData.length; i++) {
        frequenciesSelectOptions.push({
          label: frequencyData[i].type,
          value: frequencyData[i].id,
        })
      }

      setFrequencyOptions(frequenciesSelectOptions)
    }
  }


  useEffect(() => {
    getCircleOptions()
    getFrequencyOptions()
  }, [])

  useEffect(() => {
    setLocalInitialData(initialData)
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
      units: kpi[0].unit_of_measurement,
      period: undefined,
      newValue: undefined,
    }

    if (existingKpi) dispatch(updateStateKpi(stateKpi))
    else dispatch(addStateKpi(stateKpi))
  }

  const handleSubmit = async (values: FieldType) => {
    setSubmitLoading(true)
    const isEditMode = !!values.kpi_id

    if (isEditMode) {
      const { kpiData, error } = await updateKpi(values)

      if (error) {
        openNotificationWithIcon(
          'error',
          'KPI Update',
          `Error while updating a the KPI. ${error.message}`
        )
        setSubmitLoading(false)
        return
      }

      if (kpiData) {
        await updateKpiState([kpiData], values, true)
      }
    } else {
      const { newKpi, error } = await addKpi(values)

      if (error) {
        openNotificationWithIcon(
          'error',
          'KPI Insertion',
          `Error while adding a new KPI. ${error.message}`
        )
        setSubmitLoading(false)
        return
      }

      if (newKpi) {
        await updateKpiState([newKpi], values)
      }

    }

    resetForm()
    setSubmitLoading(false)
    setIsModalOpen(false)
    openNotificationWithIcon(
      'success',
      isEditMode ? 'KPI Update' : 'KPI Insertion',
      isEditMode
        ? 'You successfully updated KPI !'
        : 'You successfully added a new KPI!'
    )
  }

  const resetForm = () => {
    setLocalInitialData({} as FieldType)
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
      units: undefined
    })
    form.resetFields()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const validateSampleValue = async (_: any, value: string) => {
    const minVal = form.getFieldValue('min_value')
    const maxVal = form.getFieldValue('max_value')

    if (!(minVal || minVal === 0) || !(maxVal || maxVal === 0) || !value || Number(value) < minVal || Number(value) > maxVal) {
      return Promise.reject(`Number must be between ${minVal} and ${maxVal}`)
    }

    return Promise.resolve()
  }

  const handleSampleValueChange = (value: string) => {
    form.setFieldValue('sample_value', value )
    const minVal = form.getFieldValue('min_value')
    const maxVal = form.getFieldValue('max_value')

    if (!(minVal || minVal === 0) || !(maxVal || maxVal === 0) || !value || Number(value) < minVal || Number(value) > maxVal) {
      form.validateFields(['sample_value'])
    }
  }

  return (
    <div>
      {contextHolder}
      <Modal
        forceRender
        title={
          localInitialData?.kpi_id
            ? 'Edit KPI'
            : 'New KPI Form'
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <SubmitButton
            key='submit'
            formId='AddKPI'
            form={form}
            loading={submitLoading}
            text={localInitialData?.kpi_id ? 'Save KPI' : 'Submit KPI'}
          />
        ]}
      >
        <Form
          form={form}
          id="AddKPI"
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={localInitialData}
        >
          <Form.Item<FieldType> name="kpi_id" hidden><Input hidden /></Form.Item>
          <Form.Item<FieldType> name="kpi_circle_id" hidden><Input hidden /></Form.Item>
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
              label="Sample Value"
              name="sample_value"
              rules={[
                {
                  required: true,
                  message: 'Please input a number!',
                },
                {
                  validator: validateSampleValue,
                }
              ]}
            >
              <Input
                type='number'
                onChange={(event) => handleSampleValueChange(event.target.value)}
              />
            </Form.Item>
          </Space>
          <Form.Item<FieldType>
            label="Units"
            name="units"
            rules={[{ required: true, message: 'Please input units!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddKPIModalAndForm
