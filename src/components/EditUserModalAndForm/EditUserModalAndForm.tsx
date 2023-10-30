import { Button, Form, Modal, Select } from 'antd'
import { roles, User } from '../../types/types'
import React, { useState } from 'react'
import { changeUserRole } from '../../utils/apiRequests'
import { useNotifications } from '../../hooks/useNotifications'

interface IModal {
  isModalOpen: boolean,
  setIsModalOpen: (b: boolean) => void,
  selectedUser: User,
  users: User[] | null,
  setUsers: (users: User[]) => void
}

const EditUserModalAndForm: React.FC<IModal> = ({ isModalOpen, setIsModalOpen, selectedUser, users, setUsers }) => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const { openNotificationWithIcon, contextHolder }  = useNotifications()

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const updateUserState = (role: string) => {
    if (users) {
      const usersCopy = [...users]
      usersCopy.map(user => {
        if (user.id === selectedUser.id) {
          user.role = role
        }
      })

      setUsers(usersCopy)
    }
  }

  const handleSubmit = async (values: { role: roles }) => {
    setSubmitLoading(true)

    const { user, error } = await changeUserRole(values.role, selectedUser.id)

    if (error) {
      openNotificationWithIcon(
        'error',
        'Edit user error',
        error.message
      )

      setSubmitLoading(false)
      return
    }

    updateUserState(values.role)
    openNotificationWithIcon(
      'success',
      'Edit user',
      'You successfully changed user`s role'
    )

    setSubmitLoading(false)
    setIsModalOpen(false)
  }

  return (
    <div>
      {contextHolder}
      <Modal
        open={isModalOpen}
        title='Change role'
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button loading={submitLoading} type="primary" form="ChangeRole" key="submit" htmlType="submit">
            Submit
          </Button>
        ]}
      >
        <div className='mb-5'>Selected User: {selectedUser.email}</div>
        <Form id='ChangeRole' layout="vertical" onFinish={handleSubmit}>
          <Form.Item label='Select role for the user' name='role'>
            <Select
              className='w-full'
              options={[{ label: roles.ECONOMIST, value: roles.ECONOMIST }, { value: roles.GATEKEEPER, label: roles.GATEKEEPER }]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>

  )
}

export default EditUserModalAndForm