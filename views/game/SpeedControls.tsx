import React, { useContext } from 'react'
import { DispatchContext } from './Game'

export default function SpeedControls (): React.ReactElement {
  const dispatch = useContext(DispatchContext)
  // TODO: Dodać obsługę różnych czasów między akcjami
  return (
    <div className='speed-controls'>
      <button onClick={() => dispatch({ type: 'START', payload: { timeout: 1000, dispatch: dispatch } })}>Start</button>
      <button onClick={() => dispatch({ type: 'PAUSE' })}>Pauza</button>
      <button onClick={() => dispatch({ type: 'STOP' })}>Stop</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  )
}
