import React, { ReactElement, useContext, useState } from 'react'
import { generateGadgetDescription } from '../../levels/fields'
import { GadgetInfo, GadgetOptionKeys } from '../../levels/level'
import { ButtonDescription } from '../helpers/Modal'
import GadgetEdit, { SelectedOptions } from './GadgetEdit'
import { DispatchContext } from './Game'

function BottomTooltipItem (props: { gadgetToPlace: GadgetInfo}): ReactElement {
  const dispatch = useContext(DispatchContext)
  const [showModal, updateShowModal] = useState(false)
  const options = generateGadgetDescription(props.gadgetToPlace[0])
  // We can choose at most two options for given field
  const [selectedOptions, changeSelectedOptions] = useState(Object
    .keys(options)
    .reduce((prev, optionKey: GadgetOptionKeys) => {
      prev[optionKey] = options[optionKey][0]
      return { ...prev }
    }, {} as SelectedOptions))
  const modalButtons: ButtonDescription[] = [
    {
      buttonText: 'Wróć',
      buttonType: 'primary',
      onClick: () => updateShowModal(false)
    },
    {
      buttonText: 'Wybierz',
      buttonType: 'success',
      onClick: () => {
        dispatch({ type: 'SELECT_FIELD', payload: { fieldType: props.gadgetToPlace[0], option: selectedOptions } })
        updateShowModal(false)
      }
    }
  ]

  function onClick () {
    if (Object.keys(options).length === 0) {
      dispatch({ type: 'SELECT_FIELD', payload: { fieldType: props.gadgetToPlace[0], option: {} } })
    } else if (props.gadgetToPlace[1] > 0) {
      updateShowModal(true)
    }
  }

  return (
      <span>
        <button onClick={onClick}>{props.gadgetToPlace[0]} {props.gadgetToPlace[1]}</button>
        <GadgetEdit buttons={modalButtons} changeSelectedOptions={changeSelectedOptions} selectedOptions={selectedOptions} options={options} showModal={showModal} ></GadgetEdit>
      </span>
  )
}

export default function BottomTooltip (props: {fieldsToPlace: GadgetInfo[] }): ReactElement {
  function buildTooltipItem (gadgetToPlaceInfo: GadgetInfo): ReactElement {
    return <BottomTooltipItem key={gadgetToPlaceInfo[0]} gadgetToPlace={gadgetToPlaceInfo} />
  }

  return (
    <div className='bottom-tooltip'>
      {props.fieldsToPlace.map(
        gadgetToPlaceInfo => buildTooltipItem(gadgetToPlaceInfo))
      }
    </div>
  )
}
