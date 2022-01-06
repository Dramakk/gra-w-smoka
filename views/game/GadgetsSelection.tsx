import React, { ReactElement } from 'react'
import { Editor } from '../../editor/editor'
import { items } from '../../helpers/counter'
import { GadgetInfo } from '../../levels/level'
import ValueWithControls from '../helpers/ValueWithControls'

export default function GadgetsSelection (props: {editor: Editor}): ReactElement {
  // Build selection component for one type of field.
  function buildForField (gadgetInfo: GadgetInfo, index: number): ReactElement {
    const actionPayloadAdd = {
      gadgetType: gadgetInfo[0],
      changeInQty: 1
    }
    const actionPayloadSubstract = {
      gadgetType: gadgetInfo[0],
      changeInQty: -1
    }

    return (
      <div className='gadget-picture' key={index}>
        <img src={`/images/${gadgetInfo[0]}.png`} alt={gadgetInfo[0]}/>
        <ValueWithControls
          actionType={'CHANGE_GADGET_QTY'}
          actionPayloadSubstract={actionPayloadSubstract}
          actionPayloadAdd={actionPayloadAdd}
          current={gadgetInfo[1]}
          canEdit={true}
        />
      </div>
    )
  }

  return (
    <>
      Tutaj możesz wybrać pola, które przyszły gracz będzie mógł położyć na planszy.
      <div className='gadgets-container'>
        {[...items(props.editor.playerGadgets).entries()].map((gadgetInfo, index) => buildForField(gadgetInfo, index))}
      </div>
    </>
  )
}
