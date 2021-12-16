import React, { useContext } from 'react'
import { Field } from '../../levels/fields'
import { DispatchContext } from './Game'
import { CSSTransition } from 'react-transition-group'
import { Directions } from '../../levels/level'
import Dragon from './Dragon'

interface FieldProps {
  field: Field;
  displayDragon: boolean;
  dragonDirectionHistory: {
    previous: Directions;
    current: Directions;
  };
}

export default function FieldComponent (props: FieldProps): React.ReactElement {
  const dispatch = useContext(DispatchContext)

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

  function onClick () {
    dispatch({ type: 'FIELD_CLICK', payload: { index: props.field.id } })
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
    </>
  )
}
