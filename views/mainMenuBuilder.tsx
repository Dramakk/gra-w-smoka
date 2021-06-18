import React, { ReactElement } from 'react'

export class MainMenuView extends React.Component<{onClick: () => void}> {
  render () : ReactElement {
    return (
        <>
            <div className='menu'>
                <div className='menu-item' onClick={() => this.props.onClick()}>Graj!</div>
                <div className='menu-item'>Twórz poziom</div>
            </div>
        </>
    )
  }
}
