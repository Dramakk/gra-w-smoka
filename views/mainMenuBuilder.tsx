import React, { ReactElement } from 'react'

export class MainMenuView extends React.Component<{createGameView: () => void, createEditorView: () => void}> {
  render () : ReactElement {
    return (
        <>
            <div className='menu'>
                <div className='menu-item' onClick={() => this.props.createGameView()}>Graj!</div>
                <div className='menu-item' onClick={() => this.props.createEditorView()}>Twórz poziom</div>
            </div>
        </>
    )
  }
}
