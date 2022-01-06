
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { EditorCreation } from '../../editor/editor'
import { resetDragon } from '../../engine/engine'

export default function EditorForm (): React.ReactElement {
  const [howManyRows, changeHowManyRows] = useState(10)
  const [howManyPerRow, changeHowManyPerRow] = useState(10)
  const history = useHistory()

  function navigateToEditor () : void {
    const editor = EditorCreation.createEditor(howManyRows, howManyPerRow)
    history.push('/editor', {
      editor,
      game: resetDragon({ level: editor.level, dragon: null, shouldInteract: true })
    })
  }

  return (
    <div className='editor-form'>
      <div className='editor-form-row'>
        <label htmlFor='howManyRows'>Ile rzędów ma posiadać poziom?</label>
        <input name='howManyRows' type='number' value={howManyRows || ''} onChange={(e) => changeHowManyRows(Number(e.target.value))}></input>
      </div>
      <div className='editor-form-row'>
        <label htmlFor='howManyPerRow'>Ile pól ma posiadać jeden rząd?</label>
        <input name='howManyPerRow' type='number' value={howManyPerRow || ''} onChange={(e) => changeHowManyPerRow(Number(e.target.value))}></input>
      </div>
      <button className={!howManyPerRow || !howManyRows ? 'button-disabled' : ''} disabled={!howManyPerRow || !howManyRows} onClick={() => navigateToEditor()}>Rozpocznij edycję</button>
    </div>
  )
}
