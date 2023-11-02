import React, { useState } from 'react'
import { Form, Input, Modal, Divider, ConfigProvider } from 'antd'
import { useNotifications } from '../../hooks/useNotifications'
import { frequency, kpiFromSupabase } from '../../types/types'
import Info from '../../assets/Info.svg'
import { addNewValue } from '../../utils/apiRequests'
import { useAuth } from '../../hooks/useAuth'
import { getDisplayedKpiPeriod } from '../../utils/utils'
import { addStateCompletedKpi, deleteStateKpi } from '../../store/kpiSlice'
import { useDispatch } from 'react-redux'
import Button from '../Button/Button'
import './styles.css'
import ModalFooterButtons from '../Button/ModalFooterButtons'
import { primaryYellow } from '../../utils/theme'

export type FieldType = {
  name: string;
};

interface AddValueModalAndForm {
  isModalOpen: boolean,
  setIsModalOpen: (b: boolean) => void,
  record: kpiFromSupabase | null,
}

const AddValueModalAndForm: React.FC<AddValueModalAndForm> = ({ isModalOpen, setIsModalOpen, record  }) => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const { openNotificationWithIcon, contextHolder }  = useNotifications()
  const  { user } = useAuth()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentQuarter = Math.floor(currentMonth / 3) + 1

  const getPeriodKpiId = () => {
    let periodKpiId
    switch (record?.frequency?.type) {
    case frequency.QUARTERLY:
      periodKpiId = record?.kpi_period.filter(item => item?.period?.quarter === currentQuarter)[0].id
      break
    case frequency.MONTHLY:
      periodKpiId = record?.kpi_period.filter(item => item?.period?.month === currentMonth)[0].id
      break
    case frequency.YEARLY:
      periodKpiId = record?.kpi_period[0].id
    }

    return periodKpiId
  }

  const handleSubmit = async (values: FieldType) => {
    setSubmitLoading(true)
    const periodKpiId = getPeriodKpiId()

    if (user && periodKpiId && record) {
      const { error } = await addNewValue(user.id, periodKpiId, record?.circle_kpi[0].id, Number(values.name))

      if (error) {
        openNotificationWithIcon(
          'error',
          'Adding Value',
          `Error while adding Value to ${record.name} KPI. ${error.message}.`
        )

        setSubmitLoading(false)
        setIsModalOpen(false)
        return
      }

      // Update the state of completed KPIs with the record which has the new value
      const updatedState = {
        id: record.id,
        name: record.name,
        sampleValue: record.sample_value,
        frequency: record.frequency?.type,
        range: record.range?.display_value,
        minValue: record.range?.min_value,
        maxValue: record.range?.max_value,
        circle: record.circle_kpi[0].circle?.name,
        period: getDisplayedKpiPeriod(record.frequency?.type, record.kpi_period[0].period?.year),
        newValue: Number(values.name),
        description: null,
        frequency_id: null,
        units: record.unit_of_measurement

      }

      dispatch(addStateCompletedKpi(updatedState))
      // After adding the record in "history record" table we need to remove it from "KPI to update" table
      dispatch(deleteStateKpi(record.id))

      handleCancel()
      setSubmitLoading(false)
      openNotificationWithIcon(
        'success',
        'New value added successfully!',
        `Congratulation! The new value of "${record.name}" KPI has been added to the database!`
      )
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
    Modal.destroyAll()
  }

  const recordMin = record?.range?.min_value
  const recordMax = record?.range?.max_value

  const validateNumberInput = async (_: any, value: string) => {
    if (!(recordMin || recordMin === 0) || !(recordMax || recordMax === 0) || !value || Number(value) < recordMin || Number(value) > recordMax) {
      return Promise.reject(`Number must be between ${recordMin} and ${recordMax}`)
    }

    return Promise.resolve()
  }

  const handleInputChange = (value: string) => {
    form.setFieldsValue({ name: value })

    if (!(recordMin || recordMin === 0) || !(recordMax || recordMax === 0) || !value || Number(value) < recordMin || Number(value) > recordMax) {
      form.validateFields(['name'])
    }
  }

  const displayRangeMessage = () => {
    if ((recordMin || recordMin === 0) && (recordMax || recordMax === 0)) {
      return <div className='text-sm mb-2'>{`The new value should be between ${record?.range?.min_value} and ${record?.range?.max_value}.`}</div>
    }
  }

  const displayConfirmModalContent = (value: string) => {
    return (
      <div>
        <div>Are you sure you want to add the following KPI value to the database?</div>
        <div className='mt-5'><strong>KPI Name:</strong> {record?.name}</div>
        <div><strong>Value:</strong> {value}</div>
      </div>
    )
  }

  const showConfirmModal = (values: FieldType) => {
    Modal.confirm({
      title: 'Confirm adding a new KPI value',
      className: 'confirm-modal',
      content: displayConfirmModalContent(values.name),
      footer: (_, { CancelBtn }) => (
        <>
          <ConfigProvider
            theme={{
              token: {
                borderRadius: 2,
                colorPrimary:  primaryYellow, // bg color
              },
              components: {
                Button: {
                  primaryColor: '#fff', // text color
                }
              }
            }
            }
          >
            <CancelBtn />
            <Button text='Add' color={primaryYellow} btnProps={{ type: 'primary', loading: submitLoading }} onClick={() => handleSubmit(values)}/>
          </ConfigProvider>
        </>
      ),
    })
  }

  return (
    <div>
      {contextHolder}
      <Modal
        title={`${record?.name} - ${getDisplayedKpiPeriod(record?.frequency?.type, record?.kpi_period[0].period?.year)}`}
        okText='Submit KPI'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={<ModalFooterButtons text='Add Value' form={form} formId='AddValue' handleCancel={handleCancel} />}
      >
        <Divider />
        <div className='mb-10'>
          <div className='text-sm leading-none mb-2'><strong>KPI name</strong>: {record?.name}</div>
          <div className='text-sm leading-none mb-2'><strong>Circle</strong>: {record?.circle_kpi[0]?.circle?.name}</div>
          <div className='text-sm leading-none mb-2'><strong>Frequency</strong>: {record?.frequency?.type}</div>
          <div className='text-sm leading-none mb-2'><strong>Units</strong>: {record?.unit_of_measurement}</div>
          <div className='text-sm leading-none mb-2 font-bold text-[#536FC8] bg-[rgb(83,111,200)]/30 w-fit rounded-sm px-5 py-1 border border-solid border-[#536FC8]'>sample value: {record?.sample_value}</div>
        </div>
        <Form
          form={form}
          id='AddValue'
          layout="vertical"
          onFinish={showConfirmModal}
          autoComplete='off'
        >
          <div className='flex items-center mb-2'>
            <div className='text-rose-700 mr-1'>*</div>
            <div className='text-base leading-none'>New KPI Value</div>
          </div>
          {displayRangeMessage()}
          <Form.Item<FieldType>
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input a number!',
              },
              {
                validator: validateNumberInput,
              }
            ]}
          >
            <Input type='number' onChange={(value) => handleInputChange(value.target.value)} />
          </Form.Item>
        </Form>
        <div className='flex flex-row'>
          <img src={Info} alt='Info icon' />
          <p className='text-sm ml-2'>You can see the new added value on the history record table.</p>
        </div>
        <Divider />
      </Modal>
    </div>
  )
}

export default AddValueModalAndForm
