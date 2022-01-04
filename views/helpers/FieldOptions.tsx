import React from 'react'
import { FinishAttributes, ScaleAttributes, ArithmeticOperationAttributes, SwapOperationAttributes, RegisterOperationAttributes, IfAttributes, EntranceAttributes, ExitAttributes } from '../../levels/fields'
import { GadgetType } from '../../levels/level'
import { SelectedOptions } from '../game/GadgetEdit'

interface FieldProp {
  typeOfField: GadgetType,
  attributes?: SelectedOptions
}

export default function FieldOptions (props: FieldProp) : React.ReactElement {
  switch (props.typeOfField) {
    case 'FINISH': {
      try {
        const finishAttr = props.attributes as FinishAttributes
        if (finishAttr.opened === 1) return <img src="/images/FINISH_OPEN.png" alt="O" />
        else return <img src="/images/FINISH.png" alt="#" />
      } catch {
        return <img src="/images/FINISH.png" alt="#" />
      }
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
    case 'SCALE': {
      const scaleAttr = props.attributes as ScaleAttributes
      return (
      <>
        <img className="image-detail image-right image-top" src={`/images/${scaleAttr.gemColor}.png`} alt={scaleAttr.gemColor}/>
        <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
      </>
      )
    }
    case 'ENTRANCE': {
      const entranceAttr = props.attributes as EntranceAttributes
      return (
        <>
          <img className="image-detail image-right image-top" src={`/images/${entranceAttr.label}.png`} alt={entranceAttr.label}/>
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    }
    case 'EXIT': {
      const exitAttr = props.attributes as ExitAttributes
      return (
        <>
          <img className="image-detail image-left image-top" src={`/images/${exitAttr.label}.png`} alt={exitAttr.label}/>
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    }
    case 'ADD':
    case 'SUBSTRACT':
    case 'MULTIPLY':
    case 'DIVIDE':
    case 'SET': {
      const arithmeticOperationAttr = props.attributes as ArithmeticOperationAttributes
      return (
        <>
          <img className="image-detail image-left image-top" src={`/images/${arithmeticOperationAttr.targetGemColor}.png`} alt={arithmeticOperationAttr.targetGemColor}/>
          <img className="image-detail image-right image-bottom" src={`/images/${String(arithmeticOperationAttr.numberOfGems)}.png`} alt={String(arithmeticOperationAttr.numberOfGems)}/>
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    }
    case 'SWAP': {
      const swapOperationAttr = props.attributes as SwapOperationAttributes
      return (
        <>
          <img className="image-detail image-left image-top" src={`/images/${swapOperationAttr.firstGemColor}.png`} alt={swapOperationAttr.firstGemColor}/>
          <img className="image-detail image-right image-top" src={`/images/${swapOperationAttr.secondGemColor}.png`} alt={swapOperationAttr.secondGemColor}/>
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    }
    case 'IF': {
      const ifAttr = props.attributes as IfAttributes
      return (
        <>
          <img className="image-sign image-sign-left" src={`/images/${ifAttr.leftGemColor}.png`} alt={ifAttr.leftGemColor} />
          <img className="image-sign image-sign-middle" src={`/images/${ifAttr.sign}.png`} alt={ifAttr.sign} />
          <img className="image-sign image-sign-right" src={`/images/${String(ifAttr.rightNumberOfGems)}.png`} alt={String(ifAttr.rightNumberOfGems).toLowerCase()} />
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField} />
        </>
      )
    }
    case 'STORE':
    case 'TAKE': {
      const RegisterOperationAttr = props.attributes as RegisterOperationAttributes
      return (
        <>
          <img className="image-detail image-left image-top" src={`/images/${RegisterOperationAttr.targetGemColor}.png`} alt={RegisterOperationAttr.targetGemColor} />
          <img className="image-detail image-right image-bottom" src={`/images/${String(RegisterOperationAttr.registerNumber)}.png`} alt={String(RegisterOperationAttr.registerNumber).toLowerCase()} />
          <img src={`/images/${props.typeOfField}.png`} alt={props.typeOfField}/>
        </>
      )
    }
    default:
      return <img src="/images/EMPTY.png" alt="AR" />
  }
}
