import React, { ReactElement, useContext } from 'react'
import { GemColors } from '../levels/level'
import { DispatchContext } from './game'
import { GemOwner } from './gemPanel'

export function GemControls (props: {gemColor: GemColors, howMany: Record<GemOwner, number>, canEdit: boolean}): ReactElement {
  const dispatch = useContext(DispatchContext)

  function buildItem (who: GemOwner): ReactElement {
    const addButtons = who === 'SCALE' ? false : props.canEdit
    const gemQty = <span>{props.howMany[who]}</span>

    return addButtons
      ? <div>
          <button onClick={() => dispatch({ type: 'CHANGE_GEM_QTY', payload: { who, color: props.gemColor, changeInQty: -1 } })}>-</button>
          {gemQty}
          <button onClick={() => dispatch({ type: 'CHANGE_GEM_QTY', payload: { who, color: props.gemColor, changeInQty: 1 } })}>+</button>
        </div>
      : gemQty
  }

  return (
    <div className="gem-panel-row">
      <span>{props.gemColor}</span>
      {Object.keys(props.howMany).map((key: GemOwner) => buildItem(key))}
    </div>
  )
}
