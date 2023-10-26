import React from 'react'
import Modal from 'react-modal'
import TableauReact from './Tableau'

Modal.setAppElement('#root')

const TableauChartModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Tableau Chart Modal"
    >
      <h2>KPI Dashboard by Helgitas</h2>
      <TableauReact />
    </Modal>
  )
}

export default TableauChartModal
