import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import EditorForm from './EditorForm'

export default function MainMenu (): React.ReactElement {
  const [editorFormDisplay, changeEditorFormDisplay] = useState(false)
  const history = useHistory()

  return (
    <>
      <div className='menu'>
        <div className='menu-item' onClick={() => history.push('/levels') }>Graj!</div>
        <div className='menu-item' onClick={() => changeEditorFormDisplay(!editorFormDisplay)}>Twórz poziom</div>
        <CSSTransition
            in={editorFormDisplay}
            classNames="slide-down"
            timeout={500}
            unmountOnExit={true}
            mountOnEnter={true}
        >
          <EditorForm />
        </CSSTransition>
      </div>
    </>
  )
}
