import * as fields from '../levels/fields'
import { Editor } from '../editor/editor'
import { LevelViewBuilder } from './levelBuilder'
import { Engine } from '../engine/engine'
import React, { ReactElement } from 'react'
import { BottomTooltip } from './bottomTooltipBuilder'
import { SpeedControls } from './speedControlBuilder'
import ReactDOM from 'react-dom'
import { FieldsToPlaceSelectionView } from './fieldsToPlaceSelectionView'

// This class serves as the builder for basic game/editor view.
export class EditorViewBuilder extends LevelViewBuilder {
  editor : Editor
  constructor (props : {engine: Engine}) {
    super(props)
    const editor = new Editor(props.engine)
    this.editor = editor
  }

  // TODO: Dodanie wybierania pól dostępnych użytkownikowi
  // Override of parent function to match editor behaviour.
  deleteElement (index : number) : void {
    if (!(this.state.level.getField(index) instanceof fields.Wall)) {
      this.editor.deleteUserField(index)
    }
    this.setState({ fieldToAdd: null, level: this.editor.engine.level, placementAction: null })
  }

  // Override of parent function to match editor behaviour.
  placeElement (index : number) : void {
    if (this.state.fieldToAdd && this.props.engine.level.getField(index) instanceof fields.Empty) {
      this.editor.placeUserField(index, this.state.fieldToAdd, this.state.choosenOption)
    }
    this.setState({ fieldToAdd: null, level: this.editor.engine.level, placementAction: null })
  }

  exportLevel () : void {
    ReactDOM.render((<div>{this.editor.exportLevel()}</div>), document.querySelector('#app-container'))
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
        <FieldsToPlaceSelectionView editor={this.editor} initialFieldsToPlaceByUser={this.editor.fieldsToPlaceByUser}/>
        <button onClick={() => this.exportLevel()}>EXPORT LEVEL</button>
      </div>
    )
  }
}
