import React, { ChangeEvent, FocusEvent, useState } from 'react'
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

  function handleChange (event: ChangeEvent<HTMLInputElement>, setFunction: React.Dispatch<React.SetStateAction<number>>) {
    if (!event.target.value) return setFunction(null)
    const newValue = Number(event.target.value)
    setFunction(newValue)
  }

  function handleBlur (event: FocusEvent<HTMLInputElement>, setFunction: React.Dispatch<React.SetStateAction<number>>) {
    const newValue = Number(event.target.value)
    if (newValue < 5) return setFunction(5)
    if (newValue > 30) return setFunction(30)
    setFunction(newValue)
  }

  return (
    <div className='editor-form'>
      <div className='editor-form-row'>
        <label htmlFor='howManyRows'>Ile rzędów ma posiadać poziom?</label>
        <input name='howManyRows' type='number' value={howManyRows || ''} onBlur={(e) => handleBlur(e, changeHowManyRows)} onChange={(e) => handleChange(e, changeHowManyRows)}></input>
      </div>
      <div className='editor-form-row'>
        <label htmlFor='howManyPerRow'>Ile pól ma posiadać jeden rząd?</label>
        <input name='howManyPerRow' type='number' value={howManyPerRow || ''} onBlur={(e) => handleBlur(e, changeHowManyPerRow)} onChange={(e) => handleChange(e, changeHowManyPerRow)}></input>
      </div>
      <button className={!howManyPerRow || !howManyRows ? 'button-disabled' : ''} disabled={!howManyPerRow || !howManyRows} onClick={() => navigateToEditor()}>Rozpocznij edycję</button>
    </div>
  )
}
