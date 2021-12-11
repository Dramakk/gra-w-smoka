import React, { ReactElement, useContext, useState } from 'react'
import { GadgetInfo, GadgetOptionDescription, GadgetOptionKeys, GemColorsArray, LabelsArray, SignsArray } from '../../levels/level'
import { DispatchContext } from './Game'

type SelectedOptions = Partial<Record<GadgetOptionKeys, string | number>>

// This function generates [firstOptionsArray, secondOptionsArrray, hasOptions, howManyOptions] for given gadget.
// These informations are used to render options to choose from in editor mode.
function generateItemDescription (gadgetToPlace: GadgetInfo): GadgetOptionDescription {
  switch (gadgetToPlace[0]) {
    case 'START':
      return {
        direction: ['D', 'U', 'L', 'R']
      }
    case 'SCALE':
      return {
        gemColor: [...GemColorsArray]
      }
    case 'ADD':
    case 'SUBSTRACT':
    case 'DIVIDE':
    case 'MULTIPLY':
    case 'SET':
      return {
        targetGemColor: [...GemColorsArray],
        numberOfGems: [...GemColorsArray, ...new Array(20).keys()]
      }
    case 'SWAP':
      return {
        firstGemColor: [...GemColorsArray],
        secondGemColor: [...GemColorsArray]
      }
    case 'TAKE':
    case 'STORE':
      return {
        targetGemColor: [...GemColorsArray],
        registerNumber: [...GemColorsArray, ...new Array(20).keys()]
      }
    case 'IF':
      return {
        leftGemColor: [...GemColorsArray],
        sign: [...SignsArray],
        rightNumberOfGems: [...GemColorsArray, ...new Array(20).keys()]
      }
    case 'ENTRANCE':
    case 'EXIT':
      return {
        label: [...LabelsArray]
      }
    default:
      return {}
  }
}

function BottomTooltipItem (props: { gadgetToPlace: GadgetInfo}): ReactElement {
  const dispatch = useContext(DispatchContext)
  // We can choose at most two options for given field
  const options = generateItemDescription(props.gadgetToPlace)
  const [selectedOptions, changeSelectedOptions] = useState(Object
    .keys(options)
    .reduce((prev, optionKey: GadgetOptionKeys) => {
      prev[optionKey] = options[optionKey][0]
      return { ...prev }
    }, {} as SelectedOptions))

  // Update state to currently selected options.
  function updateSelectedOption (optionKey: string): (event: React.ChangeEvent<HTMLSelectElement>) => void {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      const parsedValue = parseInt(event.target.value)
      changeSelectedOptions({ ...selectedOptions, [optionKey]: isNaN(parsedValue) ? event.target.value : parsedValue })
    }
  }

  let dropdown = null

  if (Object.keys(options).length) {
    dropdown = Object.keys(options).reduce((previousDropdown: React.ReactElement, optionKey: GadgetOptionKeys) => {
      return (
        <>
          {previousDropdown}
          <select onChange={updateSelectedOption(optionKey).bind(this)} value={selectedOptions[optionKey]}>
            {options[optionKey].map((value, index) => {
              return <option key={index} value={value}>{value}</option>
            })}
          </select>
        </>
      )
    }, null)
  }
  // If element has options add dropdown.
  return (
      <span>
        <button onClick={() => dispatch({ type: 'SELECT_FIELD', payload: { fieldType: props.gadgetToPlace[0], option: selectedOptions } })}>{props.gadgetToPlace[0]} {props.gadgetToPlace[1]}</button>
        {dropdown}
      </span>
  )
}

export default function BottomTooltip (props: {fieldsToPlace: GadgetInfo[] }): ReactElement {
  const dispatch = useContext(DispatchContext)

  function buildTooltipItem (gadgetToPlaceInfo: GadgetInfo): ReactElement {
    return <BottomTooltipItem key={gadgetToPlaceInfo[0]} gadgetToPlace={gadgetToPlaceInfo} />
  }

  return (
    <div className='bottom-tooltip'>
      {props.fieldsToPlace.map(
        gadgetToPlaceInfo => buildTooltipItem(gadgetToPlaceInfo))
      }
      <button onClick={() => dispatch({ type: 'DELETE_MODE' })}>DELETE PLACED FIELD</button>
    </div>
  )
}
