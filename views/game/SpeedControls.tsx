import React, { useContext } from 'react'
import { DispatchContext } from './Game'

interface SpeedControlsProps {
  timeout: number;
}

export default function SpeedControls (props: SpeedControlsProps): React.ReactElement {
  const dispatch = useContext(DispatchContext)
  return (
    <div className='speed-controls'>
      <button onClick={() => dispatch({ type: 'CHANGE_TIMEOUT', payload: { timeout: props.timeout + 250, dispatch } })}>+</button>
      { props.timeout }
      <button onClick={() => dispatch({ type: 'CHANGE_TIMEOUT', payload: { timeout: props.timeout - 250, dispatch } })}>-</button>
      <button onClick={() => dispatch({ type: 'START', payload: { timeout: 1000, dispatch: dispatch } })}>Start</button>
      <button onClick={() => dispatch({ type: 'PAUSE' })}>Pauza</button>
      <button onClick={() => dispatch({ type: 'STOP' })}>Stop</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  )
}
