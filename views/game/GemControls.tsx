import React, { ReactElement } from 'react'
import { BASE_URL } from '../../helpers/fetchProxy'
import { GemColors } from '../../levels/level'
import ValueWithControls from '../helpers/ValueWithControls'
import { GemOwner } from './GemPanel'

export default function GemControls (props: {gemColor: GemColors, howMany: Record<GemOwner, number>, canEdit: boolean}): ReactElement {
  function buildItem (who: GemOwner): ReactElement {
    const addButtons = who === 'SCALE' ? false : props.canEdit

    return <ValueWithControls
        key={`${props.gemColor}${who}`}
        current={props.howMany[who]}
        canEdit={addButtons}
        actionType='CHANGE_GEM_QTY'
        actionPayloadAdd={{ who: who as 'TREE' | 'DRAGON', color: props.gemColor, changeInQty: 1 }}
        actionPayloadSubstract={{ who: who as 'TREE' | 'DRAGON', color: props.gemColor, changeInQty: -1 }}
      />
  }

  return (
    <div className="gem-panel-row">
      <img src={`${BASE_URL}/images/${props.gemColor}.png`} alt={props.gemColor}/>
      {Object.keys(props.howMany).map((key: GemOwner) => buildItem(key))}
    </div>
  )
}
