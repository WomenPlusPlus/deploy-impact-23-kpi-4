import React, { useState } from 'react'
import { Form, Input, Modal, Select, Button } from 'antd'
import { fetchEconomists } from '../../utils/apiRequests'
import { useNotifications } from '../../hooks/useNotifications'

type FieldType = {
  circle?: string;
  name?: string;
  description?: string;
  frequency?: string;
  units?: string;
  range?: string;
  economist?: string
};

interface AddKPIModalAndFormI {
  isModalOpen: boolean,
  setIsModalOpen: (b: boolean) => void
}

interface EconomistOption {
  label: string;
  value: string;
}

/** TODO:
 * FieldType correct types
 * form values submission
 * POST supabase request with form values
 * form validation
 */
const AddKPIModalAndForm: React.FC<AddKPIModalAndFormI> = ({ isModalOpen, setIsModalOpen }) => {
  const [economists, setEconomists] = useState<EconomistOption[]>([])
  const [economistsLoading, setEconomistsLoading] = useState(false)
  const { openNotificationWithIcon, contextHolder }  = useNotifications()

  /** Function used to fetch the economists when the user focuses on the economists select input*/
  const handleEconomistsSelectFocus = async () => {
    setEconomistsLoading(true)

    try {
      const economistsFromSupabase = await fetchEconomists()
      const economistsSelectOptions: EconomistOption[] = []

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

  const handleSubmit = (values: any) => {
    console.log(values)
    try {
      // insertion query supabase
      setIsModalOpen(false)
      openNotificationWithIcon(
        'success',
        'KPI Insertion',
        'You successfully added a new KPI!'
      )
    } catch (e) {
      openNotificationWithIcon(
        'error',
        'KPI Insertion',
        'Error while adding a new KPI. Please try again.'
      )
      setIsModalOpen(false)
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
          <Button type="primary" form="AddKPI" key="submit" htmlType="submit">
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
            name="circle"
            // rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="KPI Name"
            name="name"
            // rules={[{ required: true, message: 'Please input your password!' }]}
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
            name="frequency"
            // rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Units"
            name="units"
            // rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Range"
            name="range"
            // rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input />
          </Form.Item>
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