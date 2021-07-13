import * as fields from '../levels/fields'
import { Editor } from '../editor/editor'
import { Engine } from '../engine/engine'
import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom'
import { FieldsToPlaceSelectionView } from './fieldsToPlaceSelectionView'
import { LevelViewBuilder, LevelViewBuilderState } from './levelBuilder'

// This class serves as the builder for basic game/editor view.
export class EditorViewBuilder extends React.Component<{engine: Engine}> {
  editor : Editor

  constructor (props : {engine: Engine}) {
    super(props)
    const editor = new Editor(props.engine)
    this.editor = editor
  }

  // Override of parent function to match editor behaviour.
  // TODO: Przepisanie tak, aby użytkownik mógł stawiać sobie ściany na planszy
  deleteElement (index : number, state: LevelViewBuilderState) : void {
    if (!(state.level.getField(index) instanceof fields.Wall)) {
      this.editor.clearSquare(index)
    }
    this.setState({ fieldToAdd: null, level: this.editor.engine.level, placementAction: null })
  }

  // Override of parent function to match editor behaviour.
  placeElement (index : number, state: LevelViewBuilderState) : void {
    if (state.fieldToAdd && this.props.engine.level.getField(index) instanceof fields.Empty) {
      this.editor.fillSquare(index, state.fieldToAdd, state.choosenOption)
    }
    this.setState({ fieldToAdd: null, level: this.editor.engine.level, placementAction: null })
  }

  exportLevel () : void {
    ReactDOM.render((<div>{this.editor.exportLevel()}</div>), document.querySelector('#app-container'))
  }

  render () : ReactElement {
    return (
      <>
        <LevelViewBuilder engine={this.editor.engine} deleteElement={this.deleteElement.bind(this)} placeElement={this.placeElement.bind(this)} />
        <FieldsToPlaceSelectionView editor={this.editor} initialGadgets={this.editor.gadgetsToPlaceByPlayer}/>
        <button onClick={() => this.exportLevel()}>EXPORT LEVEL</button>
      </>
    )
  }
}
