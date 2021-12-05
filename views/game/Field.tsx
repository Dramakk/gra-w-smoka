import React, { useContext } from 'react'
import { DispatchContext } from './Game'
import { CSSTransition } from 'react-transition-group'
import { Directions } from '../../levels/level'

interface FieldProps {
  id: number;
  image: string;
  dragonDirections: Directions[];
}

export default function FieldComponent (props: FieldProps): React.ReactElement {
  const dispatch = useContext(DispatchContext)
  let animationClass = 'right-1000'
  const direction = props.dragonDirections.length === 0 ? props.dragonDirections[0] : props.dragonDirections[props.dragonDirections.length - 1]

  switch (direction) {
    case 'U':
      animationClass = 'up-1000'
      break
    case 'D':
      animationClass = 'down-1000'
      break
    case 'L':
      animationClass = 'left-100'
      break
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
