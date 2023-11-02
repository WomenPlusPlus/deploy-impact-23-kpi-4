import Button from './Button'
import SubmitButton from './SubmitButton'
import React from 'react'
import { FormInstance } from 'antd'
import { primaryYellow } from '../../utils/theme'

interface IModalFooterButtons {
  handleCancel: () => void,
  form: FormInstance,
  formId: string,
  text: string,
  loading?: boolean

}
const ModalFooterButtons: React.FC<IModalFooterButtons> = ({ handleCancel, form, formId, text, loading }) => {
  return (
    <div>
      <Button color={primaryYellow} key="cancel" onClick={handleCancel} text='Cancel' />
      <SubmitButton
        loading={loading}
        key='submit'
        formId={formId}
        form={form}
        text={text}
        color={primaryYellow}
      />
    </div>

  )
}

export default ModalFooterButtons