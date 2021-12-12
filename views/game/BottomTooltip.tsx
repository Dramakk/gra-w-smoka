import React, { ReactElement, useContext } from 'react'
import { GadgetInfo } from '../../levels/level'
import { DispatchContext } from './Game'

interface BottomTooltipItemProps {
  gadgetToPlace: GadgetInfo
  isSelected: boolean
}

interface BottomTooltipProps {
  fieldsToPlace: GadgetInfo[]
  selectedField: string
}

function BottomTooltipItem (props: BottomTooltipItemProps): ReactElement {
  const dispatch = useContext(DispatchContext)

  function onClick () {
    dispatch({ type: 'SELECT_GADGET', payload: { fieldType: props.gadgetToPlace[0] } })
  }

  return (
      <span>
        <button className={`bottom-tooltip-item ${props.isSelected ? 'item-selected' : ''}`} onClick={onClick}>
          {props.gadgetToPlace[0]}
          {props.gadgetToPlace[1] !== Infinity && props.gadgetToPlace[1]}
        </button>
      </span>
  )
}

export default function BottomTooltip (props: BottomTooltipProps): ReactElement {
  function buildTooltipItem (gadgetToPlaceInfo: GadgetInfo): ReactElement {
    return <BottomTooltipItem key={gadgetToPlaceInfo[0]} isSelected={gadgetToPlaceInfo[0] === props.selectedField} gadgetToPlace={gadgetToPlaceInfo} />
  }

  return (
    <div className='bottom-tooltip'>
      {props.fieldsToPlace.map(
        gadgetToPlaceInfo => buildTooltipItem(gadgetToPlaceInfo))
      }
    </div>
  )
}
