import React, { useContext, useState } from 'react'
import { Field, generateGadgetDescription } from '../../levels/fields'
import { ButtonDescription } from '../helpers/Modal'
import GadgetEdit, { SelectedOptions } from './GadgetEdit'
import { DispatchContext } from './Game'
import { CSSTransition } from 'react-transition-group'
import { Directions } from '../../levels/level'
import Dragon from './Dragon'

interface FieldProps {
  field: Field;
  isPlacedByUser: boolean;
  displayDragon: boolean;
  editorMode: boolean;
  dragonDirectionHistory: {
    previous: Directions;
    current: Directions;
  };
}

export default function FieldComponent (props: FieldProps): React.ReactElement {
  const [showModal, updateShowModal] = useState(false)
  const options = generateGadgetDescription(props.field.typeOfField)
  const [selectedOptions, changeSelectedOptions] = useState(getSelectedOptions())
  const dispatch = useContext(DispatchContext)
  const modalButtons: ButtonDescription[] = [
    {
      buttonText: 'Usuń',
      buttonType: 'danger',
      onClick: () => {
        dispatch({ type: 'DELETE_MODE' })
        dispatch({ type: 'FIELD_CLICK', payload: { index: props.field.id } })
        updateShowModal(false)
      }
    },
    {
      buttonText: 'Wróć',
      buttonType: 'primary',
      onClick: () => updateShowModal(false)
    }
  ]

  if (Object.keys(options).length !== 0) {
    modalButtons.push({
      buttonText: 'Edytuj',
      buttonType: 'success',
      onClick: () => {
        dispatch({ type: 'DELETE_MODE' })
        dispatch({ type: 'FIELD_CLICK', payload: { index: props.field.id } })
        dispatch({ type: 'SELECT_FIELD', payload: { fieldType: props.field.typeOfField, option: selectedOptions } })
        dispatch({ type: 'FIELD_CLICK', payload: { index: props.field.id } })
        updateShowModal(false)
      }
    })
  }

  let animationClass: string

  switch (props.dragonDirectionHistory.previous) {
    case 'U':
      animationClass = 'up-1000'
      break
    case 'D':
      animationClass = 'down-1000'
      break
    case 'L':
      animationClass = 'left-1000'
      break
    case 'R':
      animationClass = 'right-1000'
      break
    default:
      animationClass = ''
  }

  function getSelectedOptions () {
    if (props.field.typeOfField === 'EMPTY' || props.field.typeOfField === 'START' || props.field.typeOfField === 'FINISH') {
      return {} as SelectedOptions
    }
    return props.field.attributes as SelectedOptions
  }

  function onClick () {
    if (props.field.typeOfField === 'EMPTY') {
      dispatch({ type: 'FIELD_CLICK', payload: { index: props.field.id } })
    } else if (props.isPlacedByUser || props.editorMode) {
      updateShowModal(true)
    }
  }

  return (
    <>
      <div onClick={onClick} className='board-field'>
        <div className="board-content">{props.field.image}</div>
        <CSSTransition
          in={props.displayDragon}
          timeout={1000}
          classNames={animationClass}
        >
          <Dragon className={animationClass} displayDragon={props.displayDragon}/>
        </CSSTransition>
      </div>
      <GadgetEdit options={options} showModal={showModal} buttons={modalButtons} selectedOptions={selectedOptions} changeSelectedOptions={changeSelectedOptions}></GadgetEdit>
    </>
  )
}
