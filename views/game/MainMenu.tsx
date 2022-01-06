import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import SlideDown from '../helpers/SlideDown'
import EditorForm from './EditorForm'

export default function MainMenu (): React.ReactElement {
  const [editorFormDisplay, changeEditorFormDisplay] = useState(false)
  const history = useHistory()

  return (
    <div className='menu'>
      <button className='menu-item' onClick={() => history.push('/levels') }>Wybierz poziom</button>
      <button className='menu-item' onClick={() => changeEditorFormDisplay(!editorFormDisplay)}>Twórz poziom</button>
      <SlideDown opened={editorFormDisplay}>
        <EditorForm />
      </SlideDown>
    </div>
  )
}
