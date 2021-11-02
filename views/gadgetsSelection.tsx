import React, { ReactElement } from 'react'
import { Editor } from '../editor/editor'
import { items } from '../helpers/counter'
import { GadgetInfo } from '../levels/level'
import { DispatchProps } from '../state_manager/reducer'

export function GadgetsSelection (props: DispatchProps & {editor: Editor}): ReactElement {
  // Build selection component for one type of field.
  function buildForField (gadgetInfo: GadgetInfo, index: number): ReactElement {
    return (
      <li key={index}>
        <p>{gadgetInfo[0]} {gadgetInfo[1]}</p>
        <button onClick={() => props.dispatch({ type: 'CHANGE_GADGET_QTY', payload: { gadgetType: gadgetInfo[0], changeInQty: 1 } })}>+</button>
        <button onClick={() => props.dispatch({ type: 'CHANGE_GADGET_QTY', payload: { gadgetType: gadgetInfo[0], changeInQty: -1 } })}>-</button>
      </li>
    )
  }

  return (
    <div>
      Choose how many of given field you want to give to player.
      <ul>
        {[...items(props.editor.playerGadgets).entries()].map((gadgetInfo, index) => buildForField(gadgetInfo, index))}
      </ul>
    </div>
  )
}
