import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Level } from '../../levels/level'
import Modal, { ButtonDescription } from '../helpers/Modal'
import NavigationError from './NavigationError'

interface ExportProps {
  levelToExport: Level
}

export default function Export (): React.ReactElement {
  const history = useHistory()
  const location = useLocation()
  const locationState = location.state as ExportProps

  if (!locationState) {
    return <NavigationError />
  }

  const levelAfterFormat = JSON.stringify(locationState.levelToExport, null, 4)
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
        <button onClick={() => history.push('/')}>Wróć do głównego menu</button>
      </div>
      <Modal show={showModal} buttons={modalButtons} title="Sukces!">
        <div>Skopiowano poziom do schowka.</div>
      </Modal>
    </div>
  )
}
