import { useEffect, useState } from 'react'
import { Table, Tag, Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { fetchUsers } from '../../utils/apiRequests'

export type User = {
  id: string,
  email: string;
  role: string
}

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
      <Tag color='geekblue'>
        {text}
      </Tag>,
  }
]


/* Component that displays all the users with their role in a table for the gatekeeper to see */
const Users = () => {
  const [users, setUsers] = useState<User[] | null>([])

  useEffect(() => {
    const usersRequest = async () =>  {
      const usersFromSupabase = await fetchUsers()
      setUsers(usersFromSupabase)
    }

    usersRequest()
  }, [])

  return (
    <div>
      <p className='title'>All Users</p>
      {
        users && users.length > 0 ?
          <Table dataSource={users} columns={columns} /> : <Spin style={{ display: 'flex', justifyContent: 'center' }} />
      }
    </div>
  )
}

export default Users