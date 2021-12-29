import React, { ReactElement } from 'react'
import { GemColors } from '../../levels/level'
import ValueWithControls from '../helpers/ValueWithControls'
import { GemOwner } from './GemPanel'

import blue from '../../assets/images/blue.png'
import yellow from '../../assets/images/yellow.png'
import red from '../../assets/images/red.png'
import green from '../../assets/images/green.png'
import black from '../../assets/images/black.png'

export const crystalArray: Record<GemColors, any> = {
  BLUE: blue,
  YELLOW: yellow,
  RED: red,
  GREEN: green,
  BLACK: black
}

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
      <img src={crystalArray[props.gemColor]} alt={props.gemColor}/>
      {Object.keys(props.howMany).map((key: GemOwner) => buildItem(key))}
    </div>
  )
}
