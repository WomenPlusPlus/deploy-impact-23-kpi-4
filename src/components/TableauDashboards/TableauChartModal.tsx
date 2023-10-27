import { Modal, Divider } from 'antd'
import Tableau from './Tableau'
import React from 'react'

interface ITableauChartModal {
  isModalOpen: boolean,
  setIsModalOpen: (b: boolean) => void
}

const TableauChartModal: React.FC<ITableauChartModal> = ({ isModalOpen, setIsModalOpen }) => {

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <Modal
      title={
        <div>
          Dashboards by Helgitas 👵
          <Divider />
        </div>
      }
      width="1035px"
      centered
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Tableau />
    </Modal>
  )
}

export default TableauChartModal
