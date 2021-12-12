import React, { useContext, useState } from 'react'
import { Field, generateGadgetDescription } from '../../levels/fields'
import { ButtonDescription } from '../helpers/Modal'
import GadgetEdit, { SelectedOptions } from './GadgetEdit'
import { DispatchContext } from './Game'

interface FieldProps {
  field: Field
}

export default function FieldComponent (props: FieldProps): React.ReactElement {
  const [showModal, updateShowModal] = useState(false)
  const options = generateGadgetDescription(props.field.typeOfField)
  // We can choose at most two options for given field
  const [selectedOptions, changeSelectedOptions] = useState(props.field.attributes as SelectedOptions)
  const dispatch = useContext(DispatchContext)
  const modalButtons: ButtonDescription[] = [
    {
      buttonText: 'Usuń',
      buttonType: 'danger',
      onClick: () => {
        updateShowModal(false)
      }
    },
    {
      buttonText: 'Wróć',
      buttonType: 'primary',
      onClick: () => updateShowModal(false)
    },
    {
      buttonText: 'Edytuj',
      buttonType: 'success',
      onClick: () => {
        dispatch({ type: 'SELECT_FIELD', payload: { fieldType: props.field.typeOfField, option: selectedOptions } })
        dispatch({ type: 'FIELD_CLICK', payload: { index: props.field.id } })
        updateShowModal(false)
      }
    }
  ]

  function onClick () {
    console.log(options)
    if (Object.keys(options).length === 0) {
      dispatch({ type: 'FIELD_CLICK', payload: { index: props.field.id } })
    } else if (props.field.typeOfField !== 'EMPTY') {
      updateShowModal(true)
    }
  }
  return (
    <>
      <div onClick={onClick} className='board-field'>
        {props.field.image}
      </div>
      <GadgetEdit options={options} showModal={showModal} buttons={modalButtons} selectedOptions={selectedOptions} changeSelectedOptions={changeSelectedOptions}></GadgetEdit>
    </>
  )
}
