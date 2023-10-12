import Button from '../../components/Button/Button'
import { Input, Form, ConfigProvider } from 'antd'
import logo from '../../assets/logo.png'
import './Login.css'
import { useAuth } from '../../hooks/useAuth'
import KpiUser from '../../components/KpiUser'

const Login = () => {
  const { login } = useAuth()

  const loginHandle = (values: { email: string}) => {
    if (login) {
      login(values)
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FECC33',
          borderRadius: 2,
          controlHeight: 40,
          colorText: '#333333',
        },
      }}
    >
      <img className="logo" src={logo} alt="React Logo" />
      <div className="container">
        <div className="info-text">
          <p className="title">How to start</p>
          <p>
            {' '}
            Borem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus
            nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum
            tellus elit sed risus. Maecenas eget condimentum velit, sit amet
            feugiat lectus.
          </p>
          <p>
            {' '}
            diam sit amet lacinia. Aliquam in elementum tellus. Curabitur tempor
            quis eros tempus lacinia. Nam bibendum pellentesque quam a
            convallis. Sed ut vulputate nisi. Integer in felis sed leo
            vestibulum venenatis.{' '}
          </p>
          <p>
            Mauris sit amet magna non ligula vestibulum eleifend. Nulla varius
            volutpat turpis sed lacinia. Nam eget mi in purus lobortis eleifend.
            Sed nec ante dictum sem condimentum ullamcorper quis venenatis nisi.
            Proin vitae facilisis nisi, ac posuere leo.{' '}
          </p>
        </div>
        <div className="login-box">
          <p className="title">Login with SSO</p>
          <KpiUser />
          <p className="description">Please enter your work email</p>

          <Form onFinish={loginHandle}>
            <Form.Item name='email' rules={[{ type: 'email' }]}>
              <Input style={{ width: '360px' }} placeholder="user@email.com" />
            </Form.Item>
            <Form.Item>
              <Button
                text="Login"
                props={{
                  htmlType: 'submit',
                  type: 'primary',
                  style: { width: '100%' },
                }}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Login