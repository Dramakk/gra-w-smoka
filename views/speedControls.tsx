import React from 'react'
import { DispatchProps } from '../state_manager/reducer'

export function SpeedControls (props: DispatchProps): React.ReactElement {
  return (
    <div className='SpeedControls'>
      <span>
        <button onClick={() => props.dispatch({ type: 'START', payload: { timeout: 1000, dispatch: props.dispatch } })}>START</button>
      </span>
      <span>
        <button onClick={() => props.dispatch({ type: 'STOP', payload: { timeout: 1000, dispatch: props.dispatch } })}>STOP</button>
      </span>
      <span>
        <button onClick={() => props.dispatch({ type: 'RESET', payload: { timeout: 1000, dispatch: props.dispatch } })}>RESET</button>
      </span>
    </div>
  )
}
