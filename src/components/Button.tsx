import { ConfigProvider, Button as Btn } from 'antd'
import React  from 'react'

interface Button {
    text: string,
    props: object
}

const Button: React.FC<Button> = ({ text, props }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FECC33',
          colorText: '#333333'
        },
        components: {
          Button: {
            primaryColor: '#333333', // text color
          },
        },
      }}
    >
      <div>
        <Btn {...props}>{text}</Btn>
      </div>
    </ConfigProvider>
  )
}

export default Button