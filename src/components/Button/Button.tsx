import { ConfigProvider, Button as Btn } from 'antd'
import React  from 'react'

interface Button {
    text: string,
    onClick: () => void
    props: object,
}

/**
 * Custom component for Button that sets ConfigProvider with desired properties from our theme (eg: bgColor) in all the app ...
 * ... so we don't need to add ConfigProvider every time we use the Button component from antd
 */
const Button: React.FC<Button> = ({ text, onClick, props }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FECC33', // bg color
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
        <Btn {...props} onClick={onClick}>{text}</Btn>
      </div>
    </ConfigProvider>
  )
}

export default Button