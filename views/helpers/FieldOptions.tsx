import React from 'react'
import { Directions, GadgetType } from '../../levels/level'
import { SelectedOptions } from '../game/GadgetEdit'
import { DragonInformation } from '../../engine/dragon'
import { BASE_URL } from '../../helpers/fetchProxy'

interface FieldProp {
  typeOfField: GadgetType,
  attributes?: SelectedOptions
  isField: boolean
}

export default function FieldOptions (props: FieldProp) : React.ReactElement {
  switch (props.typeOfField) {
    case 'START':
      if (!props.isField) {
        return <img style={{ backgroundImage: `url(${BASE_URL}/images/DRAGON.png)`, transform: `rotate(${DragonInformation.mapDirectionToDeg(props.attributes.direction as Directions)[0]}deg)` }} src={`${BASE_URL}/images/EMPTY.png`} alt="" />
      } else {
        return <img src={`${BASE_URL}/images/EMPTY.png`} />
      }
    case 'FINISH':
      if (props.isField && props.attributes.opened === 1) {
        return <img src={`${BASE_URL}/images/FINISH_OPEN.png`} alt="O" />
      } else {
        return <img src={`${BASE_URL}/images/FINISH.png`} alt="#" />
      }
    case 'ARROWRIGHT':
      return <img src={`${BASE_URL}/images/ARROW.png`} alt="AR" />
    case 'ARROWLEFT':
      return <img style={{ transform: 'scaleX(-1)' }} src={`${BASE_URL}/images/ARROW.png`} alt="AL" />
    case 'ARROWUP':
      return <img style={{ transform: 'rotate(-90deg)' }} src={`${BASE_URL}/images/ARROW.png`} alt="AU" />
    case 'ARROWDOWN':
      return <img style={{ transform: 'rotate(90deg)' }} src={`${BASE_URL}/images/ARROW.png`} alt="AD" />
    case 'WALL':
      return <img src={`${BASE_URL}/images/WALL.png`} alt="W" />
    case 'SCALE':
      return (
      <>
        <img className="image-detail image-left image-top" src={`${BASE_URL}/images/${props.attributes.gemColor}.png`} alt={String(props.attributes.gemColor)}/>
        <img src={`${BASE_URL}/images/${props.typeOfField}.png`} alt={props.typeOfField} />
      </>
      )
    case 'ENTRANCE':
      return (
        <>
          <img className="image-detail image-right image-top" src={`${BASE_URL}/images/${props.attributes.label}.png`} alt={String(props.attributes.label)}/>
          <img src={`${BASE_URL}/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    case 'EXIT':
      return (
        <>
          <img className="image-detail image-left image-top" src={`${BASE_URL}/images/${props.attributes.label}.png`} alt={String(props.attributes.label)}/>
          <img src={`${BASE_URL}/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    case 'ADD':
    case 'SUBSTRACT':
    case 'MULTIPLY':
    case 'DIVIDE':
    case 'SET':
      return (
        <>
          <img className="image-detail image-left image-top" src={`${BASE_URL}/images/${props.attributes.targetGemColor}.png`} alt={String(props.attributes.targetGemColor)}/>
          <img className="image-detail image-right image-bottom" src={`${BASE_URL}/images/${String(props.attributes.numberOfGems)}.png`} alt={String(props.attributes.numberOfGems)}/>
          <img src={`${BASE_URL}/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    case 'SWAP':
      return (
        <>
          <img className="image-detail image-left image-top" src={`${BASE_URL}/images/${props.attributes.firstGemColor}.png`} alt={String(props.attributes.firstGemColor)}/>
          <img className="image-detail image-right image-top" src={`${BASE_URL}/images/${props.attributes.secondGemColor}.png`} alt={String(props.attributes.secondGemColor)}/>
          <img src={`${BASE_URL}/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    case 'IF':
      return (
        <>
          <img className="image-sign image-sign-left" src={`${BASE_URL}/images/${props.attributes.leftGemColor}.png`} alt={String(props.attributes.leftGemColor)} />
          <img className="image-sign image-sign-middle" src={`${BASE_URL}/images/${props.attributes.sign}.png`} alt={String(props.attributes.sign)} />
          <img className="image-sign image-sign-right" src={`${BASE_URL}/images/${String(props.attributes.rightNumberOfGems)}.png`} alt={String(props.attributes.rightNumberOfGems)} />
          <img src={`${BASE_URL}/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    case 'STORE':
    case 'TAKE':
      return (
        <>
          <img className="image-detail image-left image-top" src={`${BASE_URL}/images/${props.attributes.targetGemColor}.png`} alt={String(props.attributes.targetGemColor)} />
          <img className="image-detail image-right image-bottom" src={`${BASE_URL}/images/${String(props.attributes.registerNumber)}.png`} alt={String(props.attributes.registerNumber)} />
          <img src={`${BASE_URL}/images/${props.typeOfField}.png`} alt={props.typeOfField}/>
        </>
      )
    case 'PAUSE':
      return <img src={`${BASE_URL}/images/${props.typeOfField}.png`} alt={props.typeOfField} />
    default:
      return <img src={`${BASE_URL}/images/EMPTY.png`} />
  }
}
