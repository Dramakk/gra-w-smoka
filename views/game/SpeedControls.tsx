import React, { useContext } from 'react'
import ValueWithControls from '../helpers/ValueWithControls'
import { DispatchContext } from './Game'

interface SpeedControlsProps {
  timeout: number;
}

export default function SpeedControls (props: SpeedControlsProps): React.ReactElement {
  const dispatch = useContext(DispatchContext)
  const actionType = 'CHANGE_TIMEOUT'
  const actionPayloadAdd = {
    timeout: props.timeout - 250,
    dispatch
  }
  const actionPayloadSubstract = {
    timeout: props.timeout + 250,
    dispatch
  }

  function mapTimeoutToText (timeout: number): string {
    switch (timeout) {
      case 750:
        return 'Standardowo'
      case 500:
        return 'Szybko'
      case 250:
        return 'Bardzo szybko'
    }
  }

  return (
    <div className='speed-controls'>
      <ValueWithControls
        actionType={actionType}
        actionPayloadAdd={actionPayloadAdd}
        actionPayloadSubstract={actionPayloadSubstract}
        current={mapTimeoutToText(props.timeout)}
        canEdit={true}
      />
      <button onClick={() => dispatch({ type: 'START', payload: { timeout: 1000, dispatch: dispatch } })}>Start</button>
      <button onClick={() => dispatch({ type: 'PAUSE' })}>Pauza</button>
      <button onClick={() => dispatch({ type: 'STOP' })}>Stop</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  )
}
