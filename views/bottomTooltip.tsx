import React, { ReactElement, useState } from 'react'
import { GadgetOptionType } from '../editor/editor'
import { GadgetInfo } from '../levels/level'
import { ParseFn, parse } from 'spicery/build/parsers'
import { DispatchProps } from '../state_manager/reducer'

function generateItemDescription (gadgetToPlace: GadgetInfo): [string[], string[], boolean, number] {
  switch (gadgetToPlace[0]) {
    case 'START':
      return [['D', 'U', 'L', 'R'], [], true, 1]
    default:
      return [[], [], false, 0]
  }
}

export function BottomTooltipItem (props: DispatchProps & { gadgetToPlace: GadgetInfo}): ReactElement {
  // We can choose at most two options for given field
  const [firstOptionsArray, secondOptionsArray, hasOptions, howManyOptions] = generateItemDescription(props.gadgetToPlace)
  const [firstSelectedOption, changeFirstOption] = useState(firstOptionsArray.length ? firstOptionsArray[0] : '')
  const [secondSelectedOption, changeSecondOption] = useState(secondOptionsArray.length ? secondOptionsArray[0] : '')

  function parseDropdownInput (): GadgetOptionType {
    const fieldOptionParser: ParseFn<GadgetOptionType> = (x: any) => {
      // Parse only one option field
      // TODO: Update after adding more fields
      if (howManyOptions === 1) {
        return { direction: x.firstSelectedOption }
      }
    }

    return parse(fieldOptionParser)({ firstSelectedOption, secondSelectedOption })
  }

  // Update state to currently selected options.
  function updateSelectedOption (whichOption: number): (event: React.ChangeEvent<HTMLSelectElement>) => void {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (whichOption === 1) {
        changeFirstOption(event.target.value)
      } else {
        changeSecondOption(event.target.value)
      }
    }
  }

  let dropdown = null

  if (hasOptions) {
    // Determine how many dropdowns we need
    if (howManyOptions === 1) {
      dropdown = (
          <select onChange={updateSelectedOption(1).bind(this)} value={firstSelectedOption}>
            {firstOptionsArray.map((value, index) => {
              return <option key={index} value={value}>{value}</option>
            })}
          </select>)
    }
    if (howManyOptions === 2) {
      dropdown = (
          <>
            {dropdown}
            <select onChange={updateSelectedOption(2).bind(this)} value={secondSelectedOption}>
              {secondOptionsArray.map((value, index) => {
                return <option key={index} value={value}>{value}</option>
              })}
            </select>
          </>)
    }
  }
  // If element has options add dropdown.
  return (
      <span>
        <button onClick={() => props.dispatch({ type: 'SELECT_FIELD', payload: { fieldType: props.gadgetToPlace[0], option: parseDropdownInput() } })}>{props.gadgetToPlace[0]} {props.gadgetToPlace[1]}</button>
        {dropdown}
      </span>
  )
}

export function BottomTooltip (props: DispatchProps & {fieldsToPlace: GadgetInfo[] }): ReactElement {
  function buildTooltipItem (gadgetToPlaceInfo: GadgetInfo): ReactElement {
    return <BottomTooltipItem key={gadgetToPlaceInfo[0]} gadgetToPlace={gadgetToPlaceInfo} dispatch={props.dispatch} />
  }

  return (
    <div className='bottom-tooltip'>
      {props.fieldsToPlace.map(
        gadgetToPlaceInfo => buildTooltipItem(gadgetToPlaceInfo))
      }
      <button onClick={() => props.dispatch({ type: 'DELETE_MODE' })}>DELETE PLACED FIELD</button>
    </div>
  )
}
