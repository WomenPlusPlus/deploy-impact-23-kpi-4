import { ConfigProvider, Button as Btn } from 'antd'
import React  from 'react'
import { primaryGreen } from '../../utils/theme'

interface Button {
  text?: string,
  onClick?: () => void
  props?: object,
  btnProps?: object,
  color?: string,
}

/**
 * Custom component for Button that sets ConfigProvider with desired properties from our theme (eg: bgColor) in all the app ...
 * ... so we don't need to add ConfigProvider every time we use the Button component from antd
 */
const Button: React.FC<Button> = ({ text, onClick, btnProps, color, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 2,
          colorPrimary: color || primaryGreen, // bg color
        },
        components: {
          Button: {
            primaryColor: '#fff', // text color
          },
        },
      }}
    >
      <Btn {...props} {...btnProps} onClick={onClick}>{text}</Btn>
    </ConfigProvider>
  )
}

export default Button
