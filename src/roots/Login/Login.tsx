import { ConfigProvider } from 'antd'
import Welcome from '../../assets/welcome.svg'
import GoogleLogin from '../../components/GoogleLogin/GoogleLogin'
import ProJuventute from '../../assets/ProJuventute.svg'
import { primaryYellow } from '../../utils/theme'
const Login = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryYellow,
          borderRadius: 2,
          controlHeight: 40,
          colorText: '#333333',
        },
      }}
    >
      <div className='w-full h-screen flex overflow-hidden'>
        <div className='basis-1/2 items-center flex'>
          <img className='' src={Welcome} alt='Welcome to Impact Tracker' />
        </div>
        <div className='basis-1/2 flex items-center justify-center'>
          <div className='flex flex-col justify-center items-center w-80'>
            <img className='mb-6' src={ProJuventute} alt='Pro Juventute Logo'/>
            <span className='text-4xl font-semibold mb-5'>Welcome!</span>
            <span className='text-lg text-[#64748B] mb-7'>Login with your email.</span>
            <GoogleLogin />
          </div>

        </div>

      </div>

    </ConfigProvider>
  )
}

export default Login