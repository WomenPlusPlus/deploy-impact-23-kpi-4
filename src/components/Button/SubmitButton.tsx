import React, { useEffect, useState } from 'react'
import { Form, } from 'antd'
import Button from './Button'
import type { FormInstance } from 'antd'

interface ISubmitButton {
  form: FormInstance,
  formId: string,
  loading?: boolean,
  text: string,
  onClick?: () => void,
  color: string
}

const SubmitButton:React.FC<ISubmitButton> = ({ form, formId, loading, text, onClick, color  }) => {
  const [submittable, setSubmittable] = useState(false)

  // Watch all values
  const values = Form.useWatch([], form)

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true)
      },
      () => {
        setSubmittable(false)
      },
    )
  }, [values])

  return (
    <Button
      color={color}
      btnProps={{ type: 'primary', htmlType: 'submit', disabled: !submittable, form: formId, loading: loading }}
      text={text}
      onClick={onClick}
    />
  )
}

export default SubmitButton