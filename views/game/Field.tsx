import React, { useContext } from 'react'
import { Field, Finish, Scale, Exit, Entrance, ArithmeticOperation } from '../../levels/fields'
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
        if (field.attributes.opened) return <img src="/images/hole.png" alt="O" />
        else return <img src="/images/closed.png" alt="#" />
      }
      case 'ARROWRIGHT':
        return <img src="/images/arrow.png" alt="AR" />
      case 'ARROWLEFT':
        return <img style={{ transform: 'scaleX(-1)' }} src="/images/arrow.png" alt="AL" />
      case 'ARROWUP':
        return <img style={{ transform: 'rotate(-90deg)' }} src="/images/arrow.png" alt="AU" />
      case 'ARROWDOWN':
        return <img style={{ transform: 'rotate(90deg)' }} src="/images/arrow.png" alt="AD" />
      case 'WALL':
        return <img src="/images/rock.png" alt="W" />
      case 'SCALE': {
        const field = props.field as Scale
        return (
        <>
          <img className="image-detail image-right-corner" src={`/images/${field.attributes.gemColor.toLowerCase()}.png`} alt={field.attributes.gemColor}/>
          <img src="/images/scale.png" alt="S" />
        </>
        )
      }
      case 'ENTRANCE': {
        const field = props.field as Entrance
        return (
          <>
            <img className="image-detail image-right-corner" src={`/images/${field.attributes.label}.png`} alt={field.attributes.label}/>
            <img src="/images/hole.png" alt="O" />
          </>
        )
      }
      case 'EXIT': {
        const field = props.field as Exit
        return (
          <>
            <img className="image-detail image-right-corner" src={`/images/${field.attributes.label}.png`} alt={field.attributes.label}/>
            <img src="/images/hole_exit.png" alt="O" />
          </>
        )
      }
      case 'ADD': {
        const field = props.field as ArithmeticOperation
        return (
          <>
          <img className="image-detail image-left-corner" src={`/images/${String(field.attributes.numberOfGems).toLowerCase()}.png`} alt={String(field.attributes.numberOfGems)}/>
            <img className="image-detail image-right-corner" src={`/images/${field.attributes.targetGemColor.toLowerCase()}.png`} alt={field.attributes.targetGemColor}/>
            <img src="/images/chest.png" alt="O" />
          </>
        )
      }
      default:
        return <img src="/images/empty.png" alt="AR" />
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
