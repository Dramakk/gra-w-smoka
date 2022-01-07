import React from 'react'
import { FinishAttributes } from '../../levels/fields'
import { Directions, GadgetType } from '../../levels/level'
import { SelectedOptions } from '../game/GadgetEdit'

interface FieldProp {
  typeOfField: GadgetType,
  attributes?: SelectedOptions
  isField: boolean
}

export default function FieldOptions (props: FieldProp) : React.ReactElement {
  switch (props.typeOfField) {
    case 'START': {
      if (!props.isField) {
        const directionsToDegs: Record<Directions, number> = { D: 0, R: -90, L: 90, U: 180 }
        return <img style={{ backgroundImage: 'url("/images/DRAGON.png")', transform: `rotate(${directionsToDegs[props.attributes.direction as Directions]}deg)` }} src="/images/EMPTY.png" alt="" />
      } else {
        return <img src="/images/EMPTY.png" alt="AR" />
      }
    }
    case 'FINISH': {
      if (props.attributes.opened === 1) return <img src="/images/FINISH_OPEN.png" alt="O" />
      else return <img src="/images/FINISH.png" alt="#" />
      // try {
      //   const finishAttr = props.attributes as FinishAttributes
      // } catch {
      //   return <img src="/images/FINISH.png" alt="#" />
      // }
    }
    case 'ARROWRIGHT':
      return <img src="/images/ARROW.png" alt="AR" />
    case 'ARROWLEFT':
      return <img style={{ transform: 'scaleX(-1)' }} src="/images/ARROW.png" alt="AL" />
    case 'ARROWUP':
      return <img style={{ transform: 'rotate(-90deg)' }} src="/images/ARROW.png" alt="AU" />
    case 'ARROWDOWN':
      return <img style={{ transform: 'rotate(90deg)' }} src="/images/ARROW.png" alt="AD" />
    case 'WALL':
      return <img src="/images/WALL.png" alt="W" />
    case 'SCALE':
      return (
      <>
        <img className="image-detail image-right image-top" src={`/images/${props.attributes.gemColor}.png`} alt={String(props.attributes.gemColor)}/>
        <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
      </>
      )
    case 'ENTRANCE':
      return (
        <>
          <img className="image-detail image-right image-top" src={`/images/${props.attributes.label}.png`} alt={String(props.attributes.label)}/>
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    case 'EXIT':
      return (
        <>
          <img className="image-detail image-left image-top" src={`/images/${props.attributes.label}.png`} alt={String(props.attributes.label)}/>
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    case 'ADD':
    case 'SUBSTRACT':
    case 'MULTIPLY':
    case 'DIVIDE':
    case 'SET':
      return (
        <>
          <img className="image-detail image-left image-top" src={`/images/${props.attributes.targetGemColor}.png`} alt={String(props.attributes.targetGemColor)}/>
          <img className="image-detail image-right image-bottom" src={`/images/${String(props.attributes.numberOfGems)}.png`} alt={String(props.attributes.numberOfGems)}/>
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    case 'SWAP':
      return (
        <>
          <img className="image-detail image-left image-top" src={`/images/${props.attributes.firstGemColor}.png`} alt={String(props.attributes.firstGemColor)}/>
          <img className="image-detail image-right image-top" src={`/images/${props.attributes.secondGemColor}.png`} alt={String(props.attributes.secondGemColor)}/>
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    case 'IF':
      return (
        <>
          <img className="image-sign image-sign-left" src={`/images/${props.attributes.leftGemColor}.png`} alt={String(props.attributes.leftGemColor)} />
          <img className="image-sign image-sign-middle" src={`/images/${props.attributes.sign}.png`} alt={String(props.attributes.sign)} />
          <img className="image-sign image-sign-right" src={`/images/${String(props.attributes.rightNumberOfGems)}.png`} alt={String(props.attributes.rightNumberOfGems)} />
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    case 'STORE':
    case 'TAKE':
      return (
        <>
          <img className="image-detail image-left image-top" src={`/images/${props.attributes.targetGemColor}.png`} alt={String(props.attributes.targetGemColor)} />
          <img className="image-detail image-right image-bottom" src={`/images/${String(props.attributes.registerNumber)}.png`} alt={String(props.attributes.registerNumber)} />
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField}/>
        </>
      )
    default:
      return <img src="/images/EMPTY.png" alt="AR" />
  }
}
