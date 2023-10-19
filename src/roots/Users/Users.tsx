import { useEffect, useState } from 'react'
import { Table, Tag, Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { fetchUsers } from '../../utils/apiRequests'
import { useNotifications } from '../../hooks/useNotifications'
import { User } from '../../types/types'

const columns: ColumnsType<User> = [
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    responsive: ['md']
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    render: (text) =>
      <Tag color='#FECC33'>
        {text}
      </Tag>,
  }
]


/* Component that displays all the users with their role in a table for the gatekeeper to see */
const Users = () => {
  const [users, setUsers] = useState<User[] | null>([])
  const { openNotificationWithIcon, contextHolder }  = useNotifications()

  useEffect(() => {
    try {
      const usersRequest = async () =>  {
        const usersFromSupabase = await fetchUsers()

        if (usersFromSupabase) {
          const usersWithKeyValue = usersFromSupabase.map((item) => {
            return { ...item, key: item.id }
          })
          setUsers(usersWithKeyValue)
        }
      }
      usersRequest()
    } catch (e) {
      openNotificationWithIcon(
        'error',
        'Fetch Users Error',
        'Error while fetching the users. Please try again later.'
      )
    }
  }, [])

  return (
    <div>
      { contextHolder }
      <p className='title'>All Users</p>
      {
        users && users.length > 0 ?
          <Table dataSource={users} columns={columns} /> : <Spin style={{ display: 'flex', justifyContent: 'center' }} />
      }
    </div>
  )
}

export default Users