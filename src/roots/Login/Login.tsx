import { ConfigProvider } from 'antd'
import logo from '../../assets/logo.png'
import './Login.css'
import GoogleLogin from '../../components/GoogleLogin/GoogleLogin'

const Login = () => {
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
          <p className='text-4xl font-semibold mr-6'>How to start</p>
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
          <p className='text-4xl font-semibold mr-6'>Login with SSO</p>
          <GoogleLogin />
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Login