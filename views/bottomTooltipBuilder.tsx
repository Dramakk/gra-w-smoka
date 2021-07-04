import * as levelParser from '../levels/levelParser'
import React, { ReactElement } from 'react'
import { FieldOptionType } from '../levels/level'
import { ParseFn, parse } from '../node_modules/spicery/build/parsers/index'
import { PlacementActions } from './levelBuilder'

// Component for single item from bottom tooltip
export class BottomTooltipItem extends React.Component<{fieldToPlace : {fieldType: levelParser.FieldToPlaceType, howManyAvailable: number},
    chooseFieldToPlace : (fieldType: levelParser.FieldToPlaceType, choosenOption? : FieldOptionType) => void,
    changePlacementMode : (placementMode : PlacementActions) => void},
    {firstSelectedOption : string, secondSelectedOption: string}
    > {
  // We can choose at most two options for given field
  firstOptionsArray : string[] = []
  secondOptionsArray : string[] = []
  hasOptions = false
  howManyOptions = 0

  constructor (props: {
    fieldToPlace: { fieldType: levelParser.FieldToPlaceType, howManyAvailable: number },
    chooseFieldToPlace: (fieldType: levelParser.FieldToPlaceType, choosenOption? : FieldOptionType) => void,
    changePlacementMode: (placementMode: PlacementActions) => void
  }) {
    super(props)
    this.state = {
      firstSelectedOption: null,
      secondSelectedOption: null
    }
    // Check if element has options and assign them
    switch (props.fieldToPlace.fieldType) {
      case 'START':
        this.hasOptions = true
        this.firstOptionsArray = ['D', 'U', 'L', 'R']
        this.howManyOptions = 1
        this.state = { firstSelectedOption: this.firstOptionsArray[0], secondSelectedOption: null }
        break
    }
  }

  parseDropdownInput () : FieldOptionType {
    const fieldOptionParser: ParseFn<FieldOptionType> = (x : any) => {
      // Parse only one option field
      // TODO: Update after adding more fields
      if (this.howManyOptions === 1) {
        return { direction: x.firstSelectedOption }
      }
    }

    return parse(fieldOptionParser)(this.state)
  }

  // Update state to currently selected options.
  updateSelectedOption (whichOption: number): (event: React.ChangeEvent<HTMLSelectElement>) => void {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      console.log(event.target)
      if (whichOption === 1) {
        this.setState({ firstSelectedOption: event.target.value, secondSelectedOption: this.state.secondSelectedOption })
      } else {
        this.setState({ firstSelectedOption: this.state.firstSelectedOption, secondSelectedOption: event.target.value })
      }
    }
  }

  render () : ReactElement {
    let dropdown = null

    if (this.hasOptions) {
      // Determine how many dropdowns we need
      if (this.howManyOptions === 1) {
        dropdown = (
          <select onChange={this.updateSelectedOption(1).bind(this)} value={this.state.firstSelectedOption}>
            {this.firstOptionsArray.map((value, index) => {
              return <option key={index} value={value}>{value}</option>
            })}
          </select>)
      }
      if (this.howManyOptions === 2) {
        dropdown = (
          <>
          {dropdown}
          <select onChange={this.updateSelectedOption(2).bind(this)} value={this.state.firstSelectedOption}>
            {this.secondOptionsArray.map((value, index) => {
              return <option key={index} value={value}>{value}</option>
            })}
          </select>
        </>)
      }
    }
    // If element has options add dropdown.
    return (
      <span>
        <button onClick={() => this.props.chooseFieldToPlace(this.props.fieldToPlace.fieldType, this.parseDropdownInput())}>{this.props.fieldToPlace.fieldType} {this.props.fieldToPlace.howManyAvailable}</button>
        {dropdown}
      </span>
    )
  }
}

export class BottomTooltip extends React.Component<
    {fieldsToPlace : {fieldType: levelParser.FieldToPlaceType, howManyAvailable: number}[],
    chooseFieldToPlace : (fieldType: levelParser.FieldToPlaceType, choosenOption? : FieldOptionType) => void,
    changePlacementMode : (placementMode : PlacementActions) => void}
    > {
  buildTooltipItem (fieldToPlaceInfo: {fieldType: levelParser.FieldToPlaceType, howManyAvailable: number}) : ReactElement {
    return <BottomTooltipItem fieldToPlace={fieldToPlaceInfo} chooseFieldToPlace={this.props.chooseFieldToPlace} changePlacementMode={this.props.changePlacementMode} />
  }

  render () : ReactElement {
    return (
      <div className='bottom-tooltip'>
         {this.props.fieldsToPlace.map(
           fieldToPlaceInfo => this.buildTooltipItem(fieldToPlaceInfo))
         }
         <button onClick={() => this.props.changePlacementMode('DELETE')}>DELETE PLACED FIELD</button>
      </div>
    )
  }
}
