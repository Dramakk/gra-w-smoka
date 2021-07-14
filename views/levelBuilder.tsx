import * as fields from '../levels/fields'
import React, { ReactElement } from 'react'
import { Engine } from '../engine/engine'
import { GadgetType, Level } from '../levels/level'
import { BottomTooltip } from './bottomTooltipBuilder'
import { SpeedControls } from './speedControlBuilder'
import { FieldView } from './fieldViewBuilder'
import { GadgetOptionType } from '../editor/editor'

// Determine which action user tries to perform
export type PlacementActions = 'DELETE' | 'PLACE'
export type LevelViewBuilderState = { fieldToAdd: GadgetType, level: Level, placementAction: PlacementActions, choosenOption: GadgetOptionType }
type LevelViewBuilderProps = { engine: Engine, deleteElement: (index: number, state: LevelViewBuilderState) => void, placeElement: (index: number, state: LevelViewBuilderState) => void }
// This class serves as the builder for basic game/editor view.
export class LevelViewBuilder extends React.Component<LevelViewBuilderProps, LevelViewBuilderState> {
  engine: Engine
  // Used to overload standard level behaviour in editor.
  deleteElementFunction: (index: number) => void
  placeElementFunction: (index: number) => void

  constructor (props : LevelViewBuilderProps) {
    super(props)
    this.engine = props.engine
    // Check whether we recieved overloaded functions. If not, use ours.
    if (props.deleteElement === undefined) {
      this.deleteElementFunction = this.deleteElement.bind(this)
    } else {
      this.deleteElementFunction = (index: number) => {
        props.deleteElement(index, this.state)
      }
    }

    if (props.placeElement === undefined) {
      this.placeElementFunction = this.placeElement.bind(this)
    } else {
      this.placeElementFunction = (index: number) => {
        props.placeElement(index, this.state)
      }
    }

    this.state = { fieldToAdd: null, level: this.engine.level, placementAction: null, choosenOption: null }
  }

  getImage (field : fields.Field) : string {
    if (field.id === this.engine.dragon.fieldId) {
      return 'S'
    } else {
      return field.image
    }
  }

  buildRow (rowNumber: number, fieldUpdate : (index : number) => void): ReactElement {
    const offset = rowNumber * this.engine.level.getFieldsPerRow()

    return (
      <div key={rowNumber} className='row'>
        {[...Array(this.engine.level.getFieldsPerRow()).keys()].map((fieldIndex : number) => {
          const field = this.engine.level.getField(offset + fieldIndex)
          return <FieldView key={field.id} id={field.id} image={this.getImage(field)} fieldUpdate={fieldUpdate}/>
        })}
      </div>
    )
  }

  // Updates state to match currently selected field to place on board.
  changeFieldToPlace (fieldType: GadgetType, choosenOption? : GadgetOptionType) : void {
    this.setState({ fieldToAdd: fieldType, level: this.engine.level, placementAction: 'PLACE', choosenOption: choosenOption })
  }

  // Updates state to match currently selected action (place or delete)
  changePlacementAction (actionMode : PlacementActions) : void {
    this.setState({ fieldToAdd: null, level: this.engine.level, placementAction: actionMode })
  }

  /**
   * State holds information about current placement mode.
   * Clicking element on bottom tooltip, changes mode to 'PLACE' and allows placement of element on the board.
   * Clicking DELETE PLACED FIELD button, changes mode to 'DELETE' and allows deletion of element placed by user.
   */
  fieldPlacementController (index : number) : void {
    if (this.state.placementAction === 'DELETE') {
      this.deleteElementFunction(index)
    } else if (this.state.placementAction === 'PLACE') {
      this.placeElementFunction(index)
    }
  }

  // Deletes element from board and updates view.
  deleteElement (index : number) : void {
    if (this.engine.level.isPlacedByUser(index)) {
      this.engine.level.clearSquare(index)
    }
    this.setState({ fieldToAdd: null, level: this.engine.level, placementAction: null })
  }

  // Places element on board and updates view.
  placeElement (index : number) : void {
    if (this.state.fieldToAdd && this.engine.level.getField(index) instanceof fields.Empty) {
      this.engine.level.fillSquare(index, this.state.fieldToAdd)
    }
    this.setState({ fieldToAdd: null, level: this.engine.level, placementAction: null })
  }

  render () : ReactElement {
    return (
      <div className='container'>
        <p>{this.state.fieldToAdd}</p>
        <div className='board-container'>
          {[...Array(this.engine.level.getRowCount()).keys()].map(rowNumber => this.buildRow(rowNumber, this.fieldPlacementController.bind(this)))}
        </div>
        <BottomTooltip fieldsToPlace={[...this.engine.level.gadgets.items().entries()]} chooseGadgetToPlace={this.changeFieldToPlace.bind(this)} changePlacementMode={this.changePlacementAction.bind(this)} />
        <SpeedControls engine={this.engine}/>
      </div>
    )
  }
}
