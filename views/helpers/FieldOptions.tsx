import React from 'react'
// import { FinishAttributes, Scale, Exit, Entrance, ArithmeticOperation, Swap, If, RegisterOperation } from '../../levels/fields'
import { FinishAttributes, ScaleAttributes, ArithmeticOperationAttributes, SwapOperationAttributes, RegisterOperationAttributes, IfAttributes, EntranceAttributes, ExitAttributes } from '../../levels/fields'
import { GadgetType } from '../../levels/level'
import { SelectedOptions } from '../game/GadgetEdit'

interface FieldProp {
  typeOfField: GadgetType,
  attributes?: SelectedOptions
}

export default function renderFieldWithOptions (props: FieldProp) : React.ReactElement {
  switch (props.typeOfField) {
    case 'FINISH': {
      const finishAttr = props.attributes as FinishAttributes
      if (finishAttr.opened === 1) return <img src="/images/finish.png" alt="O" />
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
      return <img src="/images/wall.png" alt="W" />
    case 'SCALE': {
      const scaleAttr = props.attributes as ScaleAttributes
      return (
      <>
        <img className="image-detail image-right image-top" src={`/images/${scaleAttr.gemColor.toLowerCase()}.png`} alt={scaleAttr.gemColor}/>
        <img src={`/images/${props.typeOfField.toLowerCase()}.png`} alt={props.typeOfField} />
      </>
      )
    }
    case 'ENTRANCE': {
      const entranceAttr = props.attributes as EntranceAttributes
      return (
        <>
          <img className="image-detail image-left image-top" src={`/images/${entranceAttr.label}.png`} alt={entranceAttr.label}/>
          <img src={`/images/${props.typeOfField.toLowerCase()}.png`} alt={props.typeOfField} />
        </>
      )
    }
    case 'EXIT': {
      const exitAttr = props.attributes as ExitAttributes
      return (
        <>
          <img className="image-detail image-right-corner" src={`/images/${exitAttr.label}.png`} alt={exitAttr.label}/>
          <img src={`/images/${props.typeOfField.toLowerCase()}.png`} alt={props.typeOfField} />
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
          <img className="image-detail image-left image-top" src={`/images/${arithmeticOperationAttr.targetGemColor.toLowerCase()}.png`} alt={arithmeticOperationAttr.targetGemColor}/>
          <img className="image-detail image-right image-bottom" src={`/images/${String(arithmeticOperationAttr.numberOfGems).toLowerCase()}.png`} alt={String(arithmeticOperationAttr.numberOfGems)}/>
          <img src={`/images/${props.typeOfField.toLowerCase()}.png`} alt={props.typeOfField} />
        </>
      )
    }
    case 'SWAP': {
      const swapOperationAttr = props.attributes as SwapOperationAttributes
      return (
        <>
          <img className="image-detail image-left image-top" src={`/images/${swapOperationAttr.firstGemColor.toLowerCase()}.png`} alt={swapOperationAttr.firstGemColor}/>
          <img className="image-detail image-right image-top" src={`/images/${swapOperationAttr.secondGemColor.toLowerCase()}.png`} alt={swapOperationAttr.secondGemColor}/>
          <img src={`/images/${props.typeOfField.toLowerCase()}.png`} alt={props.typeOfField} />
        </>
      )
    }
    case 'IF': {
      const ifAttr = props.attributes as IfAttributes
      return (
        <>
          <img className="image-sign image-sign-left" src={`/images/${ifAttr.leftGemColor.toLowerCase()}.png`} alt={ifAttr.leftGemColor} />
          <img className="image-sign image-sign-middle" src={`/images/${ifAttr.sign}.png`} alt={ifAttr.sign} />
          <img className="image-sign image-sign-right" src={`/images/${String(ifAttr.rightNumberOfGems).toLowerCase()}.png`} alt={String(ifAttr.rightNumberOfGems).toLowerCase()} />
          <img src={`/images/${props.typeOfField.toLowerCase()}.png`} alt={props.typeOfField} />
        </>
      )
    }
    case 'STORE':
    case 'TAKE': {
      const RegisterOperationAttr = props.attributes as RegisterOperationAttributes
      return (
        <>
          <img className="image-detail image-left image-top" src={`/images/${RegisterOperationAttr.targetGemColor.toLowerCase()}.png`} alt={RegisterOperationAttr.targetGemColor} />
          <img className="image-detail image-right image-bottom" src={`/images/${String(RegisterOperationAttr.registerNumber).toLowerCase()}.png`} alt={String(RegisterOperationAttr.registerNumber).toLowerCase()} />
          <img src={`/images/${props.typeOfField.toLowerCase()}.png`} alt={props.typeOfField}/>
        </>
      )
    }
    default:
      return <img src="/images/empty.png" alt="AR" />
  }
}
