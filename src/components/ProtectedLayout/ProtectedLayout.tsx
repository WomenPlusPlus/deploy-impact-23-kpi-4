import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Layout, Menu, Button, ConfigProvider, Tag, Select, Space } from 'antd'
const { Header, Sider, Content } = Layout
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  DashboardOutlined,
  UserOutlined,
} from '@ant-design/icons'
import logo from '../../assets/logo.png'
import { getMenuItems } from '../../utils/utils'
import type { MenuProps } from 'antd'
import './ProtectedLayout.css'
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

  const items: MenuItem[] = [
    getMenuItems('Dashboard', '1', <DashboardOutlined style={{ fontSize: 20 }}/>, navigateToPage('dashboard')),
    getMenuItems('Users', '2', <UserOutlined style={{ fontSize: 20 }}/>, navigateToPage('users')),
    getMenuItems('Logout', '3', <LogoutOutlined style={{ fontSize: 20 }} />, logout),
  ]

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
            <div className="logo-container">
              <img className='sider-logo' src={logo} alt="Pro Juventute Logo" />
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ marginTop: '50px' }}
              items={items}
            />
          </Sider>
          <Layout>
            <Header className='header'>
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
              <Space style={{ marginRight: '40px' }} align={'center'}>
                <Space.Compact direction="vertical" size={'small'} block>
                  <h3 className='welcome'>Welcome,</h3>
                  <p className='welcome'>{user?.email}</p>
                  <Tag color='#FECC33' style={{ width: 'fit-content' }}>{user?.role}</Tag>
                </Space.Compact>
                <Select
                  bordered={false}
                  defaultValue="EN"
                  options={lgOptions}
                />
              </Space>

            </Header>
            <Content className='content'>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  )
}

export default ProtectedLayout
