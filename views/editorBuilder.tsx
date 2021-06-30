import * as fields from '../levels/fields'
import { Editor } from '../editor/editor'
import { LevelViewBuilder } from './levelBuilder'
import { Engine } from '../engine/engine'

// This class serves as the builder for basic game/editor view.
export class EditorViewBuilder extends LevelViewBuilder {
  editor : Editor
  constructor (props : {engine: Engine}) {
    super(props)
    const editor = new Editor(props.engine)
    this.editor = editor
  }

  // Override of parent function to match editor behaviour.
  deleteElement (index : number) : void {
    if (!(this.state.level.getField(index) instanceof fields.Wall)) {
      this.editor.deleteUserField(index)
    }
    this.setState({ fieldToAdd: null, level: this.editor.engine.level, placementAction: null })
    console.log(JSON.stringify(this.editor.engine.level))
  }

  // Override of parent function to match editor behaviour.
  placeElement (index : number) : void {
    if (this.state.fieldToAdd && this.props.engine.level.getField(index) instanceof fields.Empty) {
      this.editor.placeUserField(index, this.state.fieldToAdd)
    }
    this.setState({ fieldToAdd: null, level: this.editor.engine.level, placementAction: null })
    console.log(JSON.stringify(this.editor.engine.level))
  }
}
