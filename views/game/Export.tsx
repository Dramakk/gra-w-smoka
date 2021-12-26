import React, { useState } from 'react'
import { Level } from '../../levels/level'
import Modal, { ButtonDescription } from '../helpers/Modal'

interface ExportProps {
  levelToExport: Level
}

export default function Export (props: ExportProps): React.ReactElement {
  const levelAfterFormat = JSON.stringify(props.levelToExport, null, 4)
  const [showModal, updateShowModal] = useState(false)
  const modalButtons: ButtonDescription[] = [
    {
      buttonType: 'primary',
      buttonText: 'Ok',
      onClick: () => updateShowModal(false)
    }
  ]

  function copyToClipboard () {
    navigator.clipboard.writeText(levelAfterFormat)
      .then(() => updateShowModal(true))
  }

  return (
    <div className='level-export-container'>
      <div className="level-export-wrapper">
        <textarea name='level-export' value={levelAfterFormat} readOnly={true}></textarea>
      </div>
      <div className="level-export-buttons">
        <button onClick={copyToClipboard}>Skopiuj do schowka</button>
        <button>Powróć do menu głównego</button>
      </div>
      <Modal show={showModal} buttons={modalButtons} title="Sukces!">
        <div>Skopiowano poziom do schowka.</div>
      </Modal>
    </div>
  )
}
