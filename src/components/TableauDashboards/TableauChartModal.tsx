import { Modal, Button } from 'antd'
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
      title="Dashboards by Helgitas 👵"
      width="1040px"
      centered
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>
      ]}
    >
      <Tableau />
    </Modal>
  )
}

export default TableauChartModal
