import * as fields from '../levels/fields'
import * as levelParser from '../levels/levelParser'
import React, { ReactElement } from 'react'
import { Engine } from '../engine/engine'
import { Level } from '../levels/level'

type PlacementActions = 'DELETE' | 'PLACE'

class FieldView extends React.Component<{ id: number, image: string, fieldUpdate : (index : number) => void}> {
  render () {
    return (
      <div onClick={() => this.props.fieldUpdate(this.props.id)} className='col-lg'>
        {this.props.image}
      </div>
    )
  }
}

class BottomTooltip extends React.Component<
    {fieldsToPlace : {fieldType: levelParser.FieldToPlaceType, howManyAvailable: number}[],
    chooseFieldToPlace : (fieldType: levelParser.FieldToPlaceType) => void,
    changePlacementMode : (placementMode : PlacementActions) => void }
    > {
  buildTooltipItem (fieldToPlaceInfo: {fieldType: levelParser.FieldToPlaceType, howManyAvailable: number}) : ReactElement {
    return (
      <span>
        <button onClick={() => this.props.chooseFieldToPlace(fieldToPlaceInfo.fieldType)}>{fieldToPlaceInfo.fieldType} {fieldToPlaceInfo.howManyAvailable}</button>
      </span>
    )
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

class SpeedControls extends React.Component< {engine : Engine} > {
  render () : ReactElement {
    return (
      <div className='SpeedControls'>
        <span>
          <button onClick={this.props.engine.gameStart.bind(this.props.engine)}>START</button>
        </span>
        <span>
          <button onClick={this.props.engine.gameStop.bind(this.props.engine)}>STOP</button>
        </span>
        <span>
          <button onClick={this.props.engine.gameReset.bind(this.props.engine)}>RESET</button>
        </span>
      </div>
    )
  }
}

// This class serves as the builder for basic game/editor view.
export class LevelViewBuilder extends React.Component<{engine: Engine}, {fieldToAdd: levelParser.FieldToPlaceType, level: Level, placementAction : PlacementActions }> {
  constructor (props : {engine: Engine}) {
    super(props)
    this.state = { fieldToAdd: null, level: props.engine.level, placementAction: null }
  }

  getImage (field : fields.Field) : string {
    if (field.id === this.props.engine.dragon.fieldId) {
      return 'S'
    } else {
      return field.image
    }
  }

  public updateComponentStateAfterMove (newLevelState : Level) {
    this.setState({fieldToAdd : this.state.fieldToAdd, level : newLevelState, placementAction: this.state.placementAction});
  }

  buildRow (rowNumber: number, fieldUpdate : (index : number) => void): ReactElement {
    const offset = rowNumber * this.props.engine.level.getCellsPerRow()

    return (
      <div key={rowNumber} className='row'>
        {[...Array(this.props.engine.level.getCellsPerRow()).keys()].map((fieldIndex : number) => {
          const field = this.props.engine.level.getField(offset+fieldIndex)
          return <FieldView key={field.id} id={field.id} image={this.getImage(field)} fieldUpdate={fieldUpdate}/>
        })}
      </div>
    )
  }

  changeFieldToAdd (fieldType: levelParser.FieldToPlaceType) : void {
    this.setState({ fieldToAdd: fieldType, level: this.state.level, placementAction: 'PLACE' })
  }

  changePlacementAction (actionMode : PlacementActions) {
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

  deleteElement (index : number) : void {
    if (this.state.level.isPlacedByUser(index)) {
      this.state.level.deleteUserField(index)
    }
    this.setState({ fieldToAdd: null, level: this.state.level, placementAction: null })
  }

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
        <BottomTooltip fieldsToPlace={this.props.engine.level.getFieldsToPlace()} chooseFieldToPlace={this.changeFieldToAdd.bind(this)} changePlacementMode={this.changePlacementAction.bind(this)} />
        <SpeedControls engine={this.props.engine}/>
      </div>
    )
  }
}
