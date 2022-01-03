import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { resetDragon } from '../../engine/engine'
import { parseLevel } from '../../levels/levelParser'
import Modal, { ButtonDescription } from '../helpers/Modal'

export default function LevelImport (): React.ReactElement {
  const history = useHistory()
  const [showModal, updateShowModal] = useState(false)
  const [importedLevel, updateImportedLevel] = useState('')
  const modalButtons: ButtonDescription[] = [
    {
      buttonText: 'Zamknij',
      buttonType: 'primary',
      onClick: () => onModalClose(false)
    }
  ]

  function onSubmit () : void {
    try {
      const level = parseLevel(JSON.parse(importedLevel))
      const game = resetDragon({ level, dragon: null, shouldInteract: true })
      history.push('/game', {
        editor: null,
        game
      })
    } catch (e) {
      updateShowModal(true)
    }
  }

  function onBlur (event: React.FocusEvent<HTMLTextAreaElement>): void {
    if (!importedLevel) return

    try {
      const parsedJSON = JSON.parse(event.target.value)
      updateImportedLevel(JSON.stringify(parsedJSON, null, 4))
    } catch (e) {
      updateImportedLevel(event.target.value)
      updateShowModal(true)
    }
  }

  function onModalClose (event: boolean): void {
    updateShowModal(event)
  }

  return (
    <div className="import-level-container">
      <div className="import-level-wrapper">
        <label htmlFor="level-input">Wpisz poziom</label>
        <textarea name='level-input' onChange={(event) => updateImportedLevel(event.target.value)} onBlur={onBlur} value={importedLevel}>
        </textarea>
      </div>
      <div className="import-level-buttons">
        <button onClick={onSubmit}>Graj</button>
      </div>
      <Modal show={showModal} buttons={modalButtons}>
        <div>Definicja poziomu zawiera błędy. Popraw je i spróbuj ponownie.</div>
      </Modal>
    </div>
  )
}
