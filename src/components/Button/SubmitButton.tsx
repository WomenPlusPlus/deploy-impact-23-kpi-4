import { useEffect, useState } from 'react'
import { Form, } from 'antd'
import Button from './Button'
import type { FormInstance } from 'antd'

const SubmitButton = ({ form, formId, loading, text }: { form: FormInstance, formId: string, loading: boolean, text: string }) => {
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
    <Button btnProps={{ type: 'primary', htmlType: 'submit', disabled: !submittable, form: formId, loading: loading }} text={text} />
  )
}

export default SubmitButton