import React, { useState } from 'react'
import { Form, Input, Modal, Select, Button, Space } from 'antd'
import { fetchCircles, fetchEconomists, fetchFrequency, addKPI } from '../../utils/apiRequests'
import { useNotifications } from '../../hooks/useNotifications'

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

interface AddKPIModalAndFormI {
  isModalOpen: boolean,
  setIsModalOpen: (b: boolean) => void
}

interface EconomistSelectOptionsI {
  label: string;
  value: string;
}

interface CircleSelectOptionsI {
  label: string;
  value: number;
}

interface FrequencySelectOptionsI {
  label: string;
  value: number;
}

const AddKPIModalAndForm: React.FC<AddKPIModalAndFormI> = ({ isModalOpen, setIsModalOpen }) => {
  const [economists, setEconomists] = useState<EconomistSelectOptionsI[]>([])
  const [circles, setCircles] = useState<CircleSelectOptionsI[]>([])
  const [frequencies, setFrequencies] = useState<FrequencySelectOptionsI[]>([])

  const [economistsLoading, setEconomistsLoading] = useState(false)
  const [circlesLoading, setCirclesLoading] = useState(false)
  const [frequencyLoading, setFrequencyLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const { openNotificationWithIcon, contextHolder }  = useNotifications()

  /** Function used to fetch the economists when the user focuses on the economists select input */
  const handleEconomistsSelectFocus = async () => {
    setEconomistsLoading(true)

    try {
      const economistsFromSupabase = await fetchEconomists()
      const economistsSelectOptions: EconomistSelectOptionsI[] = []

      if (economistsFromSupabase) {
        for (let i = 0; i < economistsFromSupabase.length; i++) {
          economistsSelectOptions.push({ label: economistsFromSupabase[i].email, value: economistsFromSupabase[i].email })
        }
      }

      setEconomists(economistsSelectOptions)
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
      const circlesSelectOptions: CircleSelectOptionsI[] = []

      if (circlesFromSupabase) {
        for (let i = 0; i < circlesFromSupabase.length; i++) {
          circlesSelectOptions.push({ label: circlesFromSupabase[i].name, value: circlesFromSupabase[i].id })
        }
      }

      setCircles(circlesSelectOptions)
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
      const frequenciesSelectOptions: FrequencySelectOptionsI[] = []

      if (frequenciesFromSupabase) {
        for (let i = 0; i < frequenciesFromSupabase.length; i++) {
          frequenciesSelectOptions.push({ label: frequenciesFromSupabase[i].type, value: frequenciesFromSupabase[i].id })
        }
      }

      setFrequencies(frequenciesSelectOptions)
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

  const handleSubmit = async (values: FieldType) => {
    setSubmitLoading(true)
    try {
      await addKPI(values)
      setIsModalOpen(false)
      openNotificationWithIcon(
        'success',
        'KPI Insertion',
        'You successfully added a new KPI!'
      )
      setSubmitLoading(false)
    } catch (e) {
      console.log(e, 'error')
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
              options={circles}
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
              options={frequencies}
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
              onFocus={handleEconomistsSelectFocus}
              loading={economistsLoading}
              options={economists}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddKPIModalAndForm