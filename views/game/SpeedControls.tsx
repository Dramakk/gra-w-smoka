import React, { useContext } from 'react'
import { DispatchContext } from './Game'

export default function SpeedControls (): React.ReactElement {
  const dispatch = useContext(DispatchContext)
  // TODO: Dodać obsługę różnych czasów między akcjami
  return (
    <div className='SpeedControls'>
      <span>
        <button onClick={() => dispatch({ type: 'START', payload: { timeout: 1000, dispatch: dispatch } })}>START</button>
      </span>
      <span>
        <button onClick={() => dispatch({ type: 'STOP', payload: { timeout: 1000, dispatch: dispatch } })}>STOP</button>
      </span>
      <span>
        <button onClick={() => dispatch({ type: 'RESET', payload: { timeout: 1000, dispatch: dispatch } })}>RESET</button>
      </span>
    </div>
  )
}
