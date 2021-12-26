import React, { useContext } from 'react'
import { Field, Finish } from '../../levels/fields'
import { DispatchContext } from './Game'
import { CSSTransition } from 'react-transition-group'
import { Directions } from '../../levels/level'
import Dragon from './Dragon'

import empty from '../../assets/images/empty.png'
import hole from '../../assets/images/hole.png'
import arrow from '../../assets/images/arrow.png'
import rock from '../../assets/images/rock.png'
import closed from '../../assets/images/closed.png'
import scale from '../../assets/images/scale.png'

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

  // Adding modifier to selected animation class
  if (props.field.typeOfField === 'ENTRANCE') {
    animationClass += '-enter'
  }

  if (props.field.typeOfField === 'EXIT') {
    animationClass = 'exit-1000'
  }

  function onClick () {
    dispatch({ type: 'FIELD_CLICK', payload: { index: props.field.id } })
  }

  function renderImage () {
    switch (props.field.typeOfField) {
      case 'FINISH': {
        const field = props.field as Finish
        if (field.attributes.opened) return <img src={hole} alt="O" />
        else return <img src={closed} alt="#" />
      }
      case 'ARROWRIGHT':
        return <img src={arrow} alt="AR" />
      case 'ARROWLEFT':
        return <img style={{ transform: 'scaleX(-1)' }} src={arrow} alt="AL" />
      case 'ARROWUP':
        return <img style={{ transform: 'rotate(-90deg)' }} src={arrow} alt="AU" />
      case 'ARROWDOWN':
        return <img style={{ transform: 'rotate(90deg)' }} src={arrow} alt="AD" />
      case 'WALL':
        return <img src={rock} alt="W" />
      case 'SCALE':
        return <img src={scale} alt="AD" />
      default:
        return <img src={empty} alt="AR" />
    }
  }

  return (
    <>
      <div onClick={onClick} className='board-field'>
        <div className="board-content">{renderImage()}</div>
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
