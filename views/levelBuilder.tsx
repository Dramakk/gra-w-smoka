import * as fields from '../levels/fields'
import * as levelParser from '../levels/levelParser'
import React, { ReactElement } from 'react'
import { Engine } from '../engine/engine'
import { FieldOptionType, Level } from '../levels/level'
import { BottomTooltip } from './bottomTooltipBuilder'
import { SpeedControls } from './speedControlBuilder'
import { FieldView } from './fieldViewBuilder'
export type PlacementActions = 'DELETE' | 'PLACE'

// This class serves as the builder for basic game/editor view.
export class LevelViewBuilder extends React.Component<{engine: Engine}, {fieldToAdd: levelParser.FieldToPlaceType, level: Level, placementAction : PlacementActions, choosenOption : FieldOptionType }> {
  constructor (props : {engine: Engine}) {
    super(props)
    this.state = { fieldToAdd: null, level: props.engine.level, placementAction: null, choosenOption: null }
  }

  getImage (field : fields.Field) : string {
    if (field.id === this.props.engine.dragon.fieldId) {
      return 'S'
    } else {
      return field.image
    }
  }

  public updateComponentStateAfterMove (newLevelState : Level) : void {
    this.setState({ fieldToAdd: this.state.fieldToAdd, level: newLevelState, placementAction: this.state.placementAction })
  }

  buildRow (rowNumber: number, fieldUpdate : (index : number) => void): ReactElement {
    const offset = rowNumber * this.props.engine.level.getCellsPerRow()

    return (
      <div key={rowNumber} className='row'>
        {[...Array(this.props.engine.level.getCellsPerRow()).keys()].map((fieldIndex : number) => {
          const field = this.props.engine.level.getField(offset + fieldIndex)
          return <FieldView key={field.id} id={field.id} image={this.getImage(field)} fieldUpdate={fieldUpdate}/>
        })}
      </div>
    )
  }

  // Updates state to match currently selected field to place on board.
  changeFieldToPlace (fieldType: levelParser.FieldToPlaceType, choosenOption? : FieldOptionType) : void {
    this.setState({ fieldToAdd: fieldType, level: this.state.level, placementAction: 'PLACE', choosenOption: choosenOption })
  }

  // Updates state to match currently selected action (place or delete)
  changePlacementAction (actionMode : PlacementActions) : void {
    this.setState({ fieldToAdd: null, level: this.state.level, placementAction: actionMode })
  }

  /**
   * State holds information about current placement mode.
   * Clicking element on bottom tooltip, changes mode to 'PLACE' and allows placement of element on the board.
   * Clicking DELETE PLACED FIELD button, changes mode to 'DELETE' and allows deletion of element placed by user.
   */
  fieldPlacementController (index : number) : void {
    if (this.state.placementAction === 'DELETE') {
      this.deleteElement(index)
    } else if (this.state.placementAction === 'PLACE') {
      this.placeElement(index)
    }
  }

  // Deletes element from board and updates view.
  deleteElement (index : number) : void {
    if (this.state.level.isPlacedByUser(index)) {
      this.state.level.deleteUserField(index)
    }
    this.setState({ fieldToAdd: null, level: this.state.level, placementAction: null })
  }

  // Places element on board and updates view.
  placeElement (index : number) : void {
    if (this.state.fieldToAdd && this.props.engine.level.getField(index) instanceof fields.Empty) {
      this.props.engine.level.placeUserField(index, this.state.fieldToAdd)
    }
    this.setState({ fieldToAdd: null, level: this.state.level, placementAction: null })
  }

  render () : ReactElement {
    return (
      <div className='container'>
        <p>{this.state.fieldToAdd}</p>
        <div className='board-container'>
          {[...Array(this.props.engine.level.getRowCount()).keys()].map(rowNumber => this.buildRow(rowNumber, this.fieldPlacementController.bind(this)))}
        </div>
        <BottomTooltip fieldsToPlace={this.props.engine.level.getFieldsToPlace()} chooseFieldToPlace={this.changeFieldToPlace.bind(this)} changePlacementMode={this.changePlacementAction.bind(this)} />
        <SpeedControls engine={this.props.engine}/>
      </div>
    )
  }
}
