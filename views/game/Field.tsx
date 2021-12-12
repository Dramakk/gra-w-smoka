import React, { useContext, useState } from 'react'
import { Field, generateGadgetDescription } from '../../levels/fields'
import { ButtonDescription } from '../helpers/Modal'
import GadgetEdit, { SelectedOptions } from './GadgetEdit'
import { DispatchContext } from './Game'
import { CSSTransition } from 'react-transition-group'
import { Directions } from '../../levels/level'
import Dragon from './Dragon'

interface FieldProps {
  field: Field
  displayDragon: boolean;
  dragonDirectionHistory: {
    previous: Directions;
    current: Directions;
  };
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
  let animationClass

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

  function onClick () {
    console.log(options)
    if (Object.keys(options).length === 0) {
      dispatch({ type: 'FIELD_CLICK', payload: { index: props.field.id } })
    } else if (props.field.typeOfField !== 'EMPTY') {
      updateShowModal(true)
    }
  }
  return (
    <div onClick={onClick} className='board-field'>
      <div className="board-content">{props.field.image}</div>
      <CSSTransition
        in={props.displayDragon}
        timeout={1000}
        classNames={animationClass}
      >
        <Dragon className={animationClass} displayDragon={props.displayDragon}/>
      </CSSTransition>
      <GadgetEdit options={options} showModal={showModal} buttons={modalButtons} selectedOptions={selectedOptions} changeSelectedOptions={changeSelectedOptions}></GadgetEdit>
    </div>
  )
}
