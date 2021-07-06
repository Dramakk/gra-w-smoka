import React, { ReactElement } from 'react'
import { Editor } from '../editor/editor'
import { FieldToPlaceObjectType } from '../levels/level'
// This class serves as builder for control panel, which allows to change the number of fields given to player
export class FieldsToPlaceSelectionView extends React.Component<{editor: Editor, initialFieldsToPlaceByUser: FieldToPlaceObjectType[]}, {fieldsToPlaceByUser: FieldToPlaceObjectType[]}> {
  editorReference: Editor
  constructor (props: { editor: Editor, initialFieldsToPlaceByUser: FieldToPlaceObjectType[] }) {
    super(props)
    this.editorReference = this.props.editor
    this.state = { fieldsToPlaceByUser: props.initialFieldsToPlaceByUser }
  }

  // Change quantity of field to be placed
  changeQty (index: number, changeInQty: number): void {
    this.editorReference.changeQtyOfFieldsToPlaceByUser(index, changeInQty)
    this.setState({ fieldsToPlaceByUser: this.editorReference.fieldsToPlaceByUser })
  }

  // Build selection component for one type of field.
  buildForField (index: number, fieldToPlace: FieldToPlaceObjectType): ReactElement {
    return (
      <li>
        <p>{fieldToPlace.fieldType} {fieldToPlace.howManyAvailable}</p>
        <button onClick={() => this.changeQty(index, 1)}>+</button>
        <button onClick={() => this.changeQty(index, -1)}>-</button>
      </li>
    )
  }

  render () : ReactElement {
    return (
      <div>
        Choose how many of given field you want to give to player.
        <ul>
          {this.state.fieldsToPlaceByUser.map((fieldToPlaceObject, index) => this.buildForField(index, fieldToPlaceObject))}
        </ul>
      </div>
    )
  }
}
