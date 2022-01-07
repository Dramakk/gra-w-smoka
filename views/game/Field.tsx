import React, { useContext, useEffect } from 'react'
import { Field } from '../../levels/fields'
import { DispatchContext } from './Game'
import { CSSTransition } from 'react-transition-group'
import Dragon from './Dragon'
import FieldOptions from '../helpers/FieldOptions'
import { DragonDirectionHistory } from '../../engine/dragon'

interface FieldProps {
  field: Field;
  displayDragon: boolean;
  isMoving: boolean;
  dragonDirectionHistory: DragonDirectionHistory;
  timeout: number;
}

export default function FieldComponent (props: FieldProps): React.ReactElement {
  const dispatch = useContext(DispatchContext)

  let animationClass: string

  if (props.displayDragon) {
    switch (props.dragonDirectionHistory.previous) {
      case 'U':
        animationClass = `up-${props.timeout}`
        break
      case 'D':
        animationClass = `down-${props.timeout}`
        break
      case 'L':
        animationClass = `left-${props.timeout}`
        break
      case 'R':
        animationClass = `right-${props.timeout}`
        break
      default:
        animationClass = ''
    }

    // Adding modifier to selected animation class
    if (props.field.typeOfField === 'ENTRANCE') {
      animationClass += '-enter'
    }

    if (props.field.typeOfField === 'EXIT' && props.dragonDirectionHistory.fromHole) {
      animationClass = ''
    }
  }

  useEffect(() => {
    if (props.displayDragon) {
      if (props.field.typeOfField === 'ENTRANCE' && !props.dragonDirectionHistory.fromHole) {
        dispatch({ type: 'CHANGE_FROM_HOLE' })
      }

      if (props.field.typeOfField === 'EXIT' && props.dragonDirectionHistory.fromHole) {
        return dispatch({ type: 'CHANGE_FROM_HOLE' })
      }
    }
  }, [props.displayDragon])

  function onClick () {
    dispatch({ type: 'FIELD_CLICK', payload: { index: props.field.id } })
  }

  return (
    <>
      <div onClick={onClick} className='board-field'>
        <div className="board-content">
          <FieldOptions
            typeOfField={props.field.typeOfField}
            attributes={props.field.attributes}
            isField={true}
          />
        </div>
        <CSSTransition
          in={props.displayDragon}
          timeout={props.timeout}
          classNames={animationClass}
        >
          <Dragon className={animationClass} timeout={props.timeout} dragonDirectionHistory={props.dragonDirectionHistory} isMoving={props.isMoving} displayDragon={props.displayDragon}/>
        </CSSTransition>
      </div>
    </>
  )
}
