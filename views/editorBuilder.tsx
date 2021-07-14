import * as fields from '../levels/fields'
import { Editor } from '../editor/editor'
import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom'
import { FieldsToPlaceSelectionView } from './fieldsToPlaceSelectionView'
import { LevelViewBuilder, LevelViewBuilderState } from './levelBuilder'

// This class serves as the builder for basic game/editor view.
export class EditorViewBuilder extends React.Component<{editor: Editor}> {
  // Override of parent function to match editor behaviour.
  // TODO: Przepisanie tak, aby użytkownik mógł stawiać sobie ściany na planszy
  deleteElement (index : number, state: LevelViewBuilderState) : void {
    if (!(state.level.getField(index) instanceof fields.Wall)) {
      this.props.editor.clearSquare(index)
    }
    this.setState({ fieldToAdd: null, level: this.props.editor.engine.level, placementAction: null })
  }

  // Override of parent function to match editor behaviour.
  placeElement (index : number, state: LevelViewBuilderState) : void {
    if (state.fieldToAdd && this.props.editor.engine.level.getField(index) instanceof fields.Empty) {
      this.props.editor.fillSquare(index, state.fieldToAdd, state.choosenOption)
    }
    this.setState({ fieldToAdd: null, level: this.props.editor.engine.level, placementAction: null })
  }

  exportLevel () : void {
    // TODO: Dodać kontrolkę zmieniającą przycisk na disabled, kiedy nie mamy ustawionego startu lub końca.
    ReactDOM.render((<div>{this.props.editor.exportLevel()}</div>), document.querySelector('#app-container'))
  }

  render () : ReactElement {
    return (
      <>
        <LevelViewBuilder engine={this.props.editor.engine} deleteElement={this.deleteElement.bind(this)} placeElement={this.placeElement.bind(this)} />
        <FieldsToPlaceSelectionView editor={this.props.editor} initialGadgets={this.props.editor.gadgetsPlayer}/>
        <button onClick={() => this.exportLevel()}>EXPORT LEVEL</button>
      </>
    )
  }
}
