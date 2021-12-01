import React, { ReactElement, useContext } from 'react'
import { Editor } from '../../editor/editor'
import { items } from '../../helpers/counter'
import { GadgetInfo } from '../../levels/level'
import { DispatchContext } from './Game'

export default function GadgetsSelection (props: {editor: Editor}): ReactElement {
  const dispatch = useContext(DispatchContext)

  // Build selection component for one type of field.
  function buildForField (gadgetInfo: GadgetInfo, index: number): ReactElement {
    return (
      <li key={index}>
        <p>{gadgetInfo[0]} {gadgetInfo[1]}</p>
        <button onClick={() => dispatch({ type: 'CHANGE_GADGET_QTY', payload: { gadgetType: gadgetInfo[0], changeInQty: 1 } })}>+</button>
        <button onClick={() => dispatch({ type: 'CHANGE_GADGET_QTY', payload: { gadgetType: gadgetInfo[0], changeInQty: -1 } })}>-</button>
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
