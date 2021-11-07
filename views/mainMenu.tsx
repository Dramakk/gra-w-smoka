import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { LevelImport } from './levelImport'

interface MainMenuProps {createGameView: (importedLevelString: string) => void, createEditorView: (howManyRows: number, howManyPerRow: number) => void}

export function MainMenu (props: MainMenuProps): React.ReactElement {
  const [howManyRows, changeHowManyRows] = useState(5)
  const [howManyPerRow, changeHowManyPerRow] = useState(5)
  const [editorFormDisplay, changeEditorFormDisplay] = useState('none')

  function renderImportView () : void {
    ReactDOM.render(<LevelImport createGameView={props.createGameView}/>, document.querySelector('#app-container'))
  }

  return (
    <>
        <div className='menu'>
            <div className='menu-item' onClick={() => renderImportView() }>Graj!</div>
            <div className='menu-item' onClick={() => changeEditorFormDisplay('block')}>Twórz poziom</div>
            <div style={{ display: editorFormDisplay }}>
              <label htmlFor='howManyRows'>Ile rzędów ma posiadać poziom?</label>
              <input name='howManyRows' type='number' value={howManyRows} onChange={(e) => changeHowManyRows(Number(e.target.value))}></input>
              <label htmlFor='howManyPerRow'>Ile pól ma posiadać jeden rząd?</label>
              <input name='howManyPerRow' type='number' value={howManyPerRow} onChange={(e) => changeHowManyPerRow(Number(e.target.value))}></input>
              <button onClick={() => props.createEditorView(howManyRows, howManyPerRow)}>Rozpocznij edycję</button>
            </div>
        </div>
    </>
  )
}
