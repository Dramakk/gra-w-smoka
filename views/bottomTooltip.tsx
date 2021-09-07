import React, { ReactElement } from 'react'
import { GadgetOptionType } from '../editor/editor'
import { GadgetInfo, GadgetType } from '../levels/level'
import { ParseFn, parse } from 'spicery/build/parsers'
import { PlacementActions } from './game'

// Component for single item from bottom tooltip
export class BottomTooltipItemComponent extends React.Component<{
  gadgetToPlace: GadgetInfo,
  chooseGadgetToPlace: (fieldType: GadgetType, choosenOption?: GadgetOptionType) => void,
  changePlacementMode: (placementMode: PlacementActions) => void;
},
  { firstSelectedOption: string, secondSelectedOption: string; }
> {
  // We can choose at most two options for given field
  firstOptionsArray: string[] = [];
  secondOptionsArray: string[] = [];
  hasOptions = false;
  howManyOptions = 0;

  constructor (props: {
    gadgetToPlace: GadgetInfo,
    chooseGadgetToPlace: (fieldType: GadgetType, choosenOption?: GadgetOptionType) => void,
    changePlacementMode: (placementMode: PlacementActions) => void
  }) {
    super(props)
    this.state = {
      firstSelectedOption: null,
      secondSelectedOption: null
    }
    // Check if element has options and assign them
    switch (props.gadgetToPlace[0]) {
      case 'START':
        this.hasOptions = true
        this.firstOptionsArray = ['D', 'U', 'L', 'R']
        this.howManyOptions = 1
        this.state = { firstSelectedOption: this.firstOptionsArray[0], secondSelectedOption: null }
        break
    }
  }

  parseDropdownInput (): GadgetOptionType {
    const fieldOptionParser: ParseFn<GadgetOptionType> = (x: any) => {
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
      if (whichOption === 1) {
        this.setState({ firstSelectedOption: event.target.value, secondSelectedOption: this.state.secondSelectedOption })
      } else {
        this.setState({ firstSelectedOption: this.state.firstSelectedOption, secondSelectedOption: event.target.value })
      }
    }
  }

  render (): ReactElement {
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
        <button onClick={() => this.props.chooseGadgetToPlace(this.props.gadgetToPlace[0], this.parseDropdownInput())}>{this.props.gadgetToPlace[0]} {this.props.gadgetToPlace[1]}</button>
        {dropdown}
      </span>
    )
  }
}

export class BottomTooltipComponent extends React.Component<
  {
    fieldsToPlace: GadgetInfo[],
    chooseGadgetToPlace: (fieldType: GadgetType, choosenOption?: GadgetOptionType) => void,
    changePlacementMode: (placementMode: PlacementActions) => void;
  }
> {
  buildTooltipItem (gadgetToPlaceInfo: GadgetInfo): ReactElement {
    return <BottomTooltipItemComponent key={gadgetToPlaceInfo[0]} gadgetToPlace={gadgetToPlaceInfo} chooseGadgetToPlace={this.props.chooseGadgetToPlace} changePlacementMode={this.props.changePlacementMode} />
  }

  render (): ReactElement {
    return (
      <div className='bottom-tooltip'>
        {this.props.fieldsToPlace.map(
          gadgetToPlaceInfo => this.buildTooltipItem(gadgetToPlaceInfo))
        }
        <button onClick={() => this.props.changePlacementMode('DELETE')}>DELETE PLACED FIELD</button>
      </div>
    )
  }
}
