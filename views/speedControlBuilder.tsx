import React, { ReactElement } from 'react'
import { Engine } from '../engine/engine'

export class SpeedControls extends React.Component< {engine : Engine} > {
  render () : ReactElement {
    return (
      <div className='SpeedControls'>
        <span>
          <button onClick={this.props.engine.gameStart.bind(this.props.engine)}>START</button>
        </span>
        <span>
          <button onClick={this.props.engine.gameStop.bind(this.props.engine)}>STOP</button>
        </span>
        <span>
          <button onClick={this.props.engine.gameReset.bind(this.props.engine)}>RESET</button>
        </span>
      </div>
    )
  }
}
