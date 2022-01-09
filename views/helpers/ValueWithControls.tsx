import React from 'react'
import { PossibleActions, PossiblePayloads } from '../../state_manager/reducer'
import { DispatchContext } from '../game/Game'

interface ValueWithControlsProps {
  actionType: PossibleActions;
  actionPayloadAdd: PossiblePayloads;
  actionPayloadSubstract: PossiblePayloads;
  current: number | string;
  canEdit: boolean;
}

export default function ValueWithControls (props: ValueWithControlsProps): React.ReactElement {
  const dispatch = React.useContext(DispatchContext)

  return props.canEdit
    ? <div className="value-with-controls">
          <button className="value-with-controls-button material-icons"
            onClick={() => dispatch({
              type: props.actionType,
              payload: props.actionPayloadSubstract
            })}
          >remove</button>
          <span className="value-with-controls-current">{props.current}</span>
          <button className="value-with-controls-button material-icons"
            onClick={() => dispatch({
              type: props.actionType,
              payload: props.actionPayloadAdd
            })}
          >add</button>
        </div>
    : <div className="value-with-controls">{props.current}</div>
}
