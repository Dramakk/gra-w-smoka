import * as fields from '../levels/fields'
import * as level from '../levels/level'
import * as levelParser from '../levels/levelParser'
import React, { ReactElement } from 'react'

class FieldView extends React.Component<{ id: number, image: string, updateFunction : (index : number) => void}> {
  render () {
    return (
      <div onClick={() => this.props.updateFunction(this.props.id)} className='col-lg'>
        {this.props.image}
      </div>
    )
  }
}

class BottomTooltip extends React.Component<
    {fieldsToPlace : {fieldType: levelParser.FieldToPlaceType, howManyAvailable: number}[],
    onClick : (fieldType: levelParser.FieldToPlaceType) => void}
    > {
  buildTooltipItem (fieldToPlaceInfo: {fieldType: levelParser.FieldToPlaceType, howManyAvailable: number}) : ReactElement {
    return (
      <span>
        <button onClick={() => this.props.onClick(fieldToPlaceInfo.fieldType)}>{fieldToPlaceInfo.fieldType} {fieldToPlaceInfo.howManyAvailable}</button>
      </span>
    )
  }

  render () : ReactElement {
    return (
      <div className='bottom-tooltip'>
         {this.props.fieldsToPlace.map(
           fieldToPlaceInfo => this.buildTooltipItem(fieldToPlaceInfo))
         }
      </div>
    )
  }
}

export class LevelViewBuilder extends React.Component<{level: level.Level}, {fieldToAdd: levelParser.FieldToPlaceType, level: level.Level }> {
  constructor (props : {level: level.Level}) {
    super(props)
    this.state = { fieldToAdd: null, level: props.level }
  }

  getImage (field : fields.Field) : string {
    if (field.id === this.props.level.dragonPositionId) {
      return 'S'
    } else {
      return field.image
    }
  }

  buildRow (from: number, to: number, rowNumber: number, updateFunction : (index : number) => void): ReactElement {
    const iterations: number[] = []

    for (let i = from; i < to; i++) {
      iterations.push(i)
    }

    return (
      <div key={rowNumber} className='row'>
        {iterations.map((fieldIndex : number) => {
          const field = this.props.level.getField(fieldIndex)
          return <FieldView key={field.id} id={field.id} image={this.getImage(field)} updateFunction={updateFunction}/>
        })}
      </div>
    )
  }

  changeFieldToAdd (fieldType: levelParser.FieldToPlaceType) : void {
    this.setState({ fieldToAdd: fieldType })
  }

  placeElement (index : number) : void {
    if (this.state.fieldToAdd && this.props.level.getField(index) instanceof fields.Empty) {
      this.props.level.placeUserField(index, this.state.fieldToAdd)
      this.props.level.changeFieldToPlaceTypeQuantity(this.state.fieldToAdd)
    }
    this.setState({ fieldToAdd: null, level: this.state.level })
  }

  render () : ReactElement {
    const iterations: number[] = []

    for (let i = 0; i < this.props.level.getLevelSize() / this.props.level.getCellsPerRow(); i++) {
      iterations.push(i)
    }

    return (
       <div className='container'>
         <p>{this.state.fieldToAdd}</p>
         <div className='board-container'>
          {iterations.map(rowNumber => this.buildRow(rowNumber * this.props.level.getCellsPerRow(), (rowNumber + 1) * this.props.level.getCellsPerRow(), rowNumber, this.placeElement.bind(this)))}
         </div>
         <BottomTooltip fieldsToPlace={this.props.level.getFieldsToPlace()} onClick={this.changeFieldToAdd.bind(this)} />
       </div>
    )
  }
}
