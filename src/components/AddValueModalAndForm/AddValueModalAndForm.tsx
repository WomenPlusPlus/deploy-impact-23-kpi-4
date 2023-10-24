import React, { useState } from 'react'
import { Form, Input, Modal, Button } from 'antd'
import { useNotifications } from '../../hooks/useNotifications'
import { Kpi } from '../../types/types'
import Info from '../../assets/Info.svg'
import { addNewValue } from '../../utils/apiRequests'
import { useAuth } from '../../hooks/useAuth'

export type FieldType = {
  name: string;
};

interface AddValueModalAndForm {
  isModalOpen: boolean,
  setIsModalOpen: (b: boolean) => void,
  record: Kpi
}

const AddValueModalAndForm: React.FC<AddValueModalAndForm> = ({ isModalOpen, setIsModalOpen, record }) => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const { openNotificationWithIcon, contextHolder }  = useNotifications()
  const  { user } = useAuth()

  const handleSubmit = async (values: FieldType) => {
    console.log(values)
    setSubmitLoading(true)
    try {
      setIsModalOpen(false)

      // addNewValue(user?.id)
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
        title={`${record.name} - period`}
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
          <p><strong>KPI name</strong>: {record.name}</p>
          <p><strong>Circle</strong>: {record.circle}</p>
          <p><strong>Frequency</strong>: {record.frequency}</p>
          <p><strong>Range</strong>: {record.range}</p>
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
            <Input placeholder={`Example: ${String(record.sampleValue)}`} />
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
