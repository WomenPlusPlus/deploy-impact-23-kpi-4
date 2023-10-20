import { useEffect, useState } from 'react'
import { Table, Tag, Spin } from 'antd'
import { fetchUsers } from '../../utils/apiRequests'
import { useNotifications } from '../../hooks/useNotifications'
import { User } from '../../types/types'
import Column from 'antd/es/table/Column'


/* Component that displays all the users with their role in a table for the gatekeeper to see */
const Users = () => {
  const [users, setUsers] = useState<User[] | null>([])
  const { openNotificationWithIcon, contextHolder }  = useNotifications()
  const [usersLoading, setUsersLoading] = useState(false)

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

  if (usersLoading) {
    return <Spin style={{ display: 'flex', justifyContent: 'center' }} />
  }

  return (
    <div>
      { contextHolder }
      <p className='title'>All Users</p>
      <Table bordered dataSource={users || []}>
        <Column title='Email' key='email' dataIndex='email' />
        <Column title='Role' key='role' dataIndex='role' render={(text) =>
          <Tag color='#FECC33'>
            {text}
          </Tag>}
        />
      </Table>
    </div>
  )
}

export default Users