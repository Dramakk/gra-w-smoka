import React, { ReactElement } from 'react'

interface SpeedControlsProps {
  gameStart: () => void,
  gameStop: () => void,
  gameReset: () => void,
}

export class SpeedControlsComponent extends React.Component< SpeedControlsProps > {
  render () : ReactElement {
    return (
      <div className='SpeedControls'>
        <span>
          <button onClick={this.props.gameStart}>START</button>
        </span>
        <span>
          <button onClick={this.props.gameStop}>STOP</button>
        </span>
        <span>
          <button onClick={this.props.gameReset}>RESET</button>
        </span>
      </div>
    )
  }
}
