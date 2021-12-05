import React, { useContext } from 'react'
import { DispatchContext } from './Game'
import { CSSTransition } from 'react-transition-group'
import { Directions } from '../../levels/level'

interface FieldProps {
  id: number;
  image: string;
  dragonDirectionHistory: {
    previous: Directions;
    current: Directions;
  };
}

export default function FieldComponent (props: FieldProps): React.ReactElement {
  const dispatch = useContext(DispatchContext)
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

  return (
    <CSSTransition
      in={props.image === 'S'}
      timeout={1000}
      classNames={animationClass}
    >
      <div onClick={() => dispatch({ type: 'FIELD_CLICK', payload: { index: props.id } })} className='board-field'>
        {props.image}
      </div>
    </CSSTransition>
  )
}
