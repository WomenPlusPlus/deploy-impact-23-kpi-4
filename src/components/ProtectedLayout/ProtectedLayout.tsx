import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Layout, Menu, Button, ConfigProvider, Select } from 'antd'
const { Header, Sider, Content } = Layout
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  DashboardOutlined,
  UserOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import logo from '../../assets/logo.png'
import { getMenuItems, isEconomist, isGatekeeper } from '../../utils/utils'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number];

const lgOptions = [
  {
    value: 'en',
    label: 'EN'
  },
  {
    value: 'gn',
    label: 'GN'
  },
  {
    value: 'fr',
    label: 'FR'
  }
]

const ProtectedLayout = () => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()

  if (!user) {
    return <Navigate to="/login" />
  }

  const navigateToPage = (page: string) => () => {
    navigate(`/${page}`)
  }

  const itemsGatekeeper: MenuItem[] = [
    getMenuItems('Dashboard', '1', <DashboardOutlined style={{ fontSize: 20 }}/>, navigateToPage('dashboard-gatekeeper')),
    getMenuItems('Users', '2', <UserOutlined style={{ fontSize: 20 }}/>, navigateToPage('users')),
    getMenuItems('Logout', '3', <LogoutOutlined style={{ fontSize: 20 }} />, logout),
  ]

  const itemsEconomist: MenuItem[] = [
    getMenuItems('Dashboard', '1', <DashboardOutlined style={{ fontSize: 20 }}/>, navigateToPage('dashboard-economist')),
    getMenuItems('Info', '2', <InfoCircleOutlined style={{ fontSize: 20 }}/>, navigateToPage('info')),
    getMenuItems('Logout', '3', <LogoutOutlined style={{ fontSize: 20 }} />, logout),
  ]

  const getMenuItemsByRole = () => {
    if (isEconomist(user.role)) {
      return itemsEconomist
    } else if (isGatekeeper(user.role)) {
      return itemsGatekeeper
    }
  }

  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#FECC33',
            borderRadius: 2,
            controlHeight: 40,
            fontFamily:'Montserrat, sans-serif',
          },
          components: {
            Layout: {
              siderBg: '#FDF7E6',
              headerHeight: 100
            },
            Menu: {
              darkItemBg: '#FDF7E6',
              darkItemColor: '#2D373D',
              darkItemHoverColor: '#2D373D',
              darkItemSelectedColor: '#2D373D'
            }
          }
        }}
      >
        <Layout style={{ minHeight: '100vh' }}>
          <Sider style={{ minHeight: '100vh' }} trigger={null} collapsible collapsed={collapsed}>
            <div className='flex justify-center	m-3'>
              <img className='w-10 h-10 mt-5' src={logo} alt="Pro Juventute Logo" />
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              className='mt-12'
              items={getMenuItemsByRole()}
            />
          </Sider>
          <Layout>
            <Header className='p-0 bg-white flex items-center justify-between'>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: 20 }} /> : <MenuFoldOutlined style={{ fontSize: 20 }} />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              <div className='flex items-start mr-10'>
                <div>
                  <h3 className='leading-normal mt-0 mr-0 mb-2'>Welcome</h3>
                  <p className='leading-normal mt-0 mb-0'>{user?.email}</p>
                </div>
                <Select
                  className='-mt-3 ml-1'
                  bordered={false}
                  defaultValue="EN"
                  options={lgOptions}
                />
              </div>

            </Header>
            <Content className='my-6 mx-4 p-6 bg-white'>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  )
}

export default ProtectedLayout
