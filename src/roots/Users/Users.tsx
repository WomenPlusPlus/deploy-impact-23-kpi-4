import { useEffect, useState } from 'react'
import { Spin, Table, Tooltip } from 'antd'
import { fetchUsers } from '../../utils/apiRequests'
import { useNotifications } from '../../hooks/useNotifications'
import { User } from '../../types/types'
import Column from 'antd/es/table/Column'
import Button from '../../components/Button/Button'
import EditUserModalAndForm from '../../components/EditUserModalAndForm/EditUserModalAndForm'
import { EditOutlined } from '@ant-design/icons'

/* Component that displays all the users with their role in a table for the gatekeeper to see */
const Users = () => {
  const [users, setUsers] = useState<User[] | null>([])
  const { openNotificationWithIcon, contextHolder }  = useNotifications()
  const [usersLoading, setUsersLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User>({ email: '', id: '', role: '' })

  useEffect(() => {
    setUsersLoading(true)
    try {
      const usersRequest = async () =>  {
        const usersFromSupabase = await fetchUsers()

        if (usersFromSupabase) {
          const usersWithKeyValue = usersFromSupabase.map((item) => {
            return { ...item, key: item.id }
          })
          setUsers(usersWithKeyValue)
        }
        setUsersLoading(false)
      }
      usersRequest()
    } catch (e) {
      setUsersLoading(false)
      openNotificationWithIcon(
        'error',
        'Fetch Users Error',
        'Error while fetching the users. Please try again later.'
      )
    }
  }, [])

  const showModal = (record: User) => () => {
    setSelectedUser(record)
    setIsModalOpen(true)
  }

  if (usersLoading) {
    return <Spin style={{ display: 'flex', justifyContent: 'center' }} />
  }

  return (
    <div>
      { contextHolder }
      <p className='text-4xl font-semibold mr-6'>All Users</p>
      <EditUserModalAndForm setUsers={setUsers} users={users} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedUser={selectedUser} />
      <Table bordered dataSource={users || []}>
        <Column title='Email' key='email' dataIndex='email' />
        <Column title='Role' key='role' dataIndex='role' render={(text) => text.charAt(0).toUpperCase() + text.slice(1)} />
        <Column title='Actions' key='actions' align='center' dataIndex='actions' render={(_:any, record:User) => (
          <Tooltip title="Edit">
            <Button
              onClick={showModal(record)}
              btnProps={{ shape: 'circle', size: 'small', icon: <EditOutlined /> }}
            />
          </Tooltip>
        )}
        />
      </Table>
    </div>
  )
}

export default Users